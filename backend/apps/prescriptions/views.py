from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from apps.accounts.permissions import IsDoctor
from apps.appointments.models import Appointment
from .models import Prescription
from .serializers import PrescriptionSerializer, CreatePrescriptionSerializer


class PrescriptionListCreateView(APIView):
    """
    GET /api/v1/prescriptions/
    - Patients: view their own prescriptions
    - Doctors: view prescriptions they have authored
    - Admin: view all

    POST /api/v1/prescriptions/
    - Doctor creates prescription for an assigned confirmed/completed appointment
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'patient':
            qs = Prescription.objects.filter(patient=user)
        elif user.role == 'doctor':
            qs = Prescription.objects.filter(doctor__user=user)
        elif user.role == 'admin':
            qs = Prescription.objects.all()
        else:
            return Response([], status=status.HTTP_200_OK)

        qs = qs.select_related(
            'patient',
            'doctor',
            'doctor__user',
            'appointment',
            'appointment__slot'
        ).prefetch_related('medications')

        serializer = PrescriptionSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Only doctors can create prescriptions
        if request.user.role != 'doctor':
            return Response(
                {"detail": "Only doctors can issue prescriptions."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = CreatePrescriptionSerializer(
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            prescription = serializer.save()
            output_serializer = PrescriptionSerializer(prescription)
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PrescriptionDetailView(APIView):
    """
    GET /api/v1/prescriptions/<id>/
    View prescription details.
    Accessible only to the assigned patient, the prescribing doctor, or admin.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        prescription = get_object_or_404(
            Prescription.objects.select_related(
                'patient',
                'doctor',
                'doctor__user',
                'appointment',
                'appointment__slot'
            ).prefetch_related('medications'),
            pk=pk
        )

        user = request.user
        is_patient = (prescription.patient_id == user.id)
        is_doctor = (prescription.doctor.user_id == user.id)
        is_admin = (user.role == 'admin')

        if not (is_patient or is_doctor or is_admin):
            return Response(
                {"detail": "You do not have permission to view this prescription."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PrescriptionSerializer(prescription)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AppointmentPrescriptionView(APIView):
    """
    GET /api/v1/prescriptions/appointment/<appointment_id>/
    Retrieve prescription for a given appointment, or 404 if none exists.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):
        appointment = get_object_or_404(
            Appointment.objects.select_related('patient', 'doctor', 'doctor__user'),
            pk=appointment_id
        )

        user = request.user
        is_patient = (appointment.patient_id == user.id)
        is_doctor = (appointment.doctor.user_id == user.id)
        is_admin = (user.role == 'admin')

        if not (is_patient or is_doctor or is_admin):
            return Response(
                {"detail": "You do not have permission to view prescriptions for this appointment."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            prescription = Prescription.objects.select_related(
                'patient',
                'doctor',
                'doctor__user',
                'appointment',
                'appointment__slot'
            ).prefetch_related('medications').get(appointment_id=appointment_id)
            serializer = PrescriptionSerializer(prescription)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Prescription.DoesNotExist:
            return Response(
                {"detail": "No prescription found for this appointment."},
                status=status.HTTP_404_NOT_FOUND
            )
