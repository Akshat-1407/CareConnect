from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from django.shortcuts import get_object_or_404

from apps.accounts.permissions import IsPatient
from apps.appointments.models import Appointment
from apps.appointments.serializers import AppointmentSerializer
from .models import Payment
from .serializers import PaymentSerializer, VerifyPaymentSerializer
from .razorpay_client import verify_payment_signature


class VerifyPaymentView(APIView):
    """
    POST /api/v1/payments/verify/
    Verify Razorpay payment signature, verify expected amount, and mark appointment CONFIRMED.
    Ensures idempotency (avoids duplicate confirmation if called multiple times).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        order_id = serializer.validated_data['razorpay_order_id']
        payment_id = serializer.validated_data['razorpay_payment_id']
        signature = serializer.validated_data['razorpay_signature']

        with transaction.atomic():
            try:
                payment = Payment.objects.select_for_update().select_related(
                    'appointment',
                    'appointment__doctor',
                    'appointment__doctor__user',
                    'appointment__slot',
                    'appointment__patient'
                ).get(razorpay_order_id=order_id)
            except Payment.DoesNotExist:
                return Response(
                    {"detail": "Payment order not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            appointment = payment.appointment

            # Verify that requesting user is the patient (or admin)
            if request.user.role == 'patient' and appointment.patient_id != request.user.id:
                return Response(
                    {"detail": "You do not have permission to verify this payment."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Idempotency: if already confirmed and success, return existing confirmed appointment
            if payment.status == Payment.Status.SUCCESS and appointment.status == Appointment.Status.CONFIRMED:
                return Response({
                    "message": "Payment already verified and appointment confirmed.",
                    "appointment": AppointmentSerializer(appointment).data,
                    "payment": PaymentSerializer(payment).data,
                }, status=status.HTTP_200_OK)

            # Signature verification on backend
            is_valid = verify_payment_signature(
                razorpay_order_id=order_id,
                razorpay_payment_id=payment_id,
                razorpay_signature=signature
            )

            if not is_valid:
                payment.status = Payment.Status.FAILED
                payment.save(update_fields=['status'])
                return Response(
                    {"detail": "Invalid payment signature verification failed."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verification succeeded — update payment & appointment
            payment.razorpay_payment_id = payment_id
            payment.razorpay_signature = signature
            payment.status = Payment.Status.SUCCESS
            payment.save(update_fields=['razorpay_payment_id', 'razorpay_signature', 'status'])

            appointment.status = Appointment.Status.CONFIRMED
            appointment.save(update_fields=['status'])

            # Ensure slot is marked booked
            if appointment.slot and not appointment.slot.is_booked:
                appointment.slot.is_booked = True
                appointment.slot.save(update_fields=['is_booked'])

            return Response({
                "message": "Payment verified successfully. Appointment confirmed.",
                "appointment": AppointmentSerializer(appointment).data,
                "payment": PaymentSerializer(payment).data,
            }, status=status.HTTP_200_OK)


class PaymentListView(APIView):
    """
    Patient: View payment history for their own appointments.
    GET /api/v1/payments/
    """
    permission_classes = [IsPatient]

    def get(self, request):
        payments = Payment.objects.filter(
            appointment__patient=request.user
        ).select_related(
            'appointment',
            'appointment__doctor',
            'appointment__doctor__user'
        ).order_by('-created_at')

        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PaymentDetailView(APIView):
    """
    View individual payment receipt details.
    GET /api/v1/payments/<id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        payment = get_object_or_404(
            Payment.objects.select_related('appointment', 'appointment__patient', 'appointment__doctor'),
            pk=pk
        )

        # Enforce patient ownership
        if request.user.role == 'patient' and payment.appointment.patient_id != request.user.id:
            return Response({"detail": "Access denied."}, status=status.HTTP_403_FORBIDDEN)

        serializer = PaymentSerializer(payment)
        return Response(serializer.data, status=status.HTTP_200_OK)
