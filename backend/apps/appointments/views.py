from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.conf import settings

from apps.accounts.permissions import IsPatient, IsDoctor, IsPatientOrDoctor
from apps.doctors.models import AvailabilitySlot
from apps.payments.models import Payment
from apps.payments.razorpay_client import create_order, normalize_key_id
from .models import Appointment
from .serializers import AppointmentSerializer, CreateAppointmentSerializer


class AppointmentListCreateView(APIView):
    """
    Patient-only appointment endpoint:
    - GET: list patient's appointments
    - POST: book a slot (creates PENDING_PAYMENT appointment and Razorpay order)
    """
    permission_classes = [IsPatient]

    def get(self, request):
        appointments = Appointment.objects.filter(
            patient=request.user
        ).select_related(
            'doctor',
            'doctor__user',
            'slot'
        ).order_by('-created_at')

        status_filter = request.query_params.get('status', '').strip()
        if status_filter:
            appointments = appointments.filter(status=status_filter)

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CreateAppointmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        slot_id = serializer.validated_data['slot_id']
        notes = serializer.validated_data.get('notes', '')

        with transaction.atomic():
            # Lock the slot row to prevent race conditions and double bookings
            try:
                slot = AvailabilitySlot.objects.select_for_update().select_related(
                    'doctor',
                    'doctor__user'
                ).get(pk=slot_id)
            except AvailabilitySlot.DoesNotExist:
                return Response(
                    {"detail": "The requested appointment slot does not exist."},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Check if an existing appointment is attached to this slot
            if hasattr(slot, 'appointment'):
                existing_appt = slot.appointment
                if existing_appt.status == Appointment.Status.CONFIRMED:
                    return Response(
                        {"detail": "This slot has already been booked and confirmed."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                elif existing_appt.status == Appointment.Status.PENDING_PAYMENT:
                    if existing_appt.patient_id == request.user.id:
                        payment = getattr(existing_appt, 'payment', None)
                        if not payment:
                            order_data = create_order(
                                amount=existing_appt.amount,
                                currency='INR',
                                receipt=f"appt_{existing_appt.id}"
                            )
                            payment = Payment.objects.create(
                                appointment=existing_appt,
                                razorpay_order_id=order_data['id'],
                                amount=existing_appt.amount,
                                currency=order_data.get('currency', 'INR'),
                                status=Payment.Status.PENDING,
                            )
                        return Response({
                            "message": "Continuing payment for your appointment.",
                            "appointment": AppointmentSerializer(existing_appt).data,
                            "razorpay": {
                                "order_id": payment.razorpay_order_id,
                                "amount": int(float(existing_appt.amount) * 100),
                                "currency": payment.currency,
                                "key_id": normalize_key_id(getattr(settings, 'RAZORPAY_KEY_ID', 'rzp_test_placeholder')),
                            }
                        }, status=status.HTTP_200_OK)
                    else:
                        return Response(
                            {"detail": "This slot is currently being booked by another patient. Please choose another slot."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

            # Recheck slot availability on backend
            if slot.is_booked:
                return Response(
                    {"detail": "This slot has already been booked. Please choose another slot."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if slot.is_in_past():
                return Response(
                    {"detail": "Cannot book an appointment slot from the past."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Mark slot booked in transaction
            slot.is_booked = True
            slot.save(update_fields=['is_booked'])

            # Create appointment
            amount = slot.doctor.consultation_fee
            appointment = Appointment.objects.create(
                patient=request.user,
                doctor=slot.doctor,
                slot=slot,
                amount=amount,
                notes=notes,
                status=Appointment.Status.PENDING_PAYMENT,
            )

            # Create Razorpay order
            order_data = create_order(
                amount=amount,
                currency='INR',
                receipt=f"appt_{appointment.id}"
            )

            # Record payment
            Payment.objects.create(
                appointment=appointment,
                razorpay_order_id=order_data['id'],
                amount=amount,
                currency=order_data.get('currency', 'INR'),
                status=Payment.Status.PENDING,
            )

            appointment_data = AppointmentSerializer(appointment).data

            return Response({
                "message": "Appointment created. Please proceed to payment.",
                "appointment": appointment_data,
                "razorpay": {
                    "order_id": order_data['id'],
                    "amount": int(float(amount) * 100),  # in paise
                    "currency": order_data.get('currency', 'INR'),
                    "key_id": normalize_key_id(getattr(settings, 'RAZORPAY_KEY_ID', 'rzp_test_placeholder')),
                }
            }, status=status.HTTP_201_CREATED)


class AppointmentDetailView(APIView):
    """
    View details of an individual appointment.
    Accessible to the assigned patient or doctor.
    """
    permission_classes = [IsPatientOrDoctor]

    def get(self, request, pk):
        appointment = get_object_or_404(
            Appointment.objects.select_related('doctor', 'doctor__user', 'slot', 'patient'),
            pk=pk
        )

        # Check ownership
        if request.user.role == 'patient' and appointment.patient_id != request.user.id:
            return Response({"detail": "Access denied."}, status=status.HTTP_403_FORBIDDEN)
        if request.user.role == 'doctor' and appointment.doctor.user_id != request.user.id:
            return Response({"detail": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AppointmentCancelView(APIView):
    """
    Cancel an appointment and release the slot.
    Accessible by the patient or doctor.
    """
    permission_classes = [IsPatientOrDoctor]

    def post(self, request, pk):
        with transaction.atomic():
            appointment = get_object_or_404(
                Appointment.objects.select_for_update().select_related('doctor', 'slot'),
                pk=pk
            )

            if request.user.role == 'patient' and appointment.patient_id != request.user.id:
                return Response({"detail": "Access denied."}, status=status.HTTP_403_FORBIDDEN)
            if request.user.role == 'doctor' and appointment.doctor.user_id != request.user.id:
                return Response({"detail": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

            if appointment.status in [Appointment.Status.COMPLETED, Appointment.Status.CANCELLED]:
                return Response(
                    {"detail": f"Cannot cancel an appointment with status {appointment.status}."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            appointment.status = Appointment.Status.CANCELLED
            appointment.save(update_fields=['status'])

            # Release slot
            if appointment.slot:
                appointment.slot.is_booked = False
                appointment.slot.save(update_fields=['is_booked'])

            return Response({
                "message": "Appointment cancelled successfully.",
                "appointment": AppointmentSerializer(appointment).data
            }, status=status.HTTP_200_OK)


class DoctorAppointmentListView(APIView):
    """
    Doctor-only appointment list:
    GET /api/v1/doctor/appointments/
    """
    permission_classes = [IsDoctor]

    def get(self, request):
        try:
            doctor = request.user.doctor_profile
        except Exception:
            return Response([], status=status.HTTP_200_OK)

        appointments = Appointment.objects.filter(
            doctor=doctor
        ).select_related(
            'patient',
            'slot',
            'doctor',
            'doctor__user'
        ).order_by('-created_at')

        status_filter = request.query_params.get('status', '').strip()
        if status_filter:
            appointments = appointments.filter(status=status_filter)

        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
