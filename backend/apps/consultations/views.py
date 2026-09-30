from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.appointments.models import Appointment
from .models import ConsultationSession

DEFAULT_ICE_SERVERS = [
    {"urls": ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"]}
]


class ConsultationDetailView(APIView):
    """
    GET /api/v1/consultations/<appointment_id>/
    Retrieve consultation metadata, eligibility check, and ICE servers configuration.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, appointment_id):
        appointment = get_object_or_404(
            Appointment.objects.select_related(
                'patient',
                'doctor',
                'doctor__user',
                'slot'
            ),
            pk=appointment_id
        )

        user = request.user
        is_patient = (appointment.patient_id == user.id)
        is_doctor = (appointment.doctor.user_id == user.id)
        is_admin = getattr(user, 'role', '') == 'admin'

        if not (is_patient or is_doctor or is_admin):
            return Response(
                {"detail": "You are not authorized to access this consultation."},
                status=status.HTTP_403_FORBIDDEN
            )

        role = 'patient' if is_patient else ('doctor' if is_doctor else 'admin')
        is_eligible = appointment.status == Appointment.Status.CONFIRMED

        session = getattr(appointment, 'consultation_session', None)

        slot = appointment.slot
        slot_data = {
            'date': str(slot.date) if slot else None,
            'start_time': str(slot.start_time) if slot else None,
            'end_time': str(slot.end_time) if slot else None,
        } if slot else None

        return Response({
            'appointment_id': appointment.id,
            'status': appointment.status,
            'is_eligible': is_eligible,
            'user_role': role,
            'patient': {
                'id': appointment.patient.id,
                'name': appointment.patient.get_full_name() or appointment.patient.username,
                'email': appointment.patient.email,
            },
            'doctor': {
                'id': appointment.doctor.id,
                'name': f"Dr. {appointment.doctor.user.get_full_name() or appointment.doctor.user.username}",
                'specialization': appointment.doctor.specialization,
            },
            'slot': slot_data,
            'session': {
                'status': session.status if session else 'SCHEDULED',
                'started_at': session.started_at if session else None,
                'ended_at': session.ended_at if session else None,
            },
            'ice_servers': DEFAULT_ICE_SERVERS,
        }, status=status.HTTP_200_OK)


class EndConsultationView(APIView):
    """
    POST /api/v1/consultations/<appointment_id>/end/
    Marks consultation ended and updates appointment status to COMPLETED.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id):
        appointment = get_object_or_404(
            Appointment.objects.select_related('patient', 'doctor', 'doctor__user'),
            pk=appointment_id
        )

        user = request.user
        is_patient = (appointment.patient_id == user.id)
        is_doctor = (appointment.doctor.user_id == user.id)

        if not (is_patient or is_doctor or user.role == 'admin'):
            return Response(
                {"detail": "Access denied."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Mark consultation session ended
        session, _ = ConsultationSession.objects.get_or_create(
            appointment=appointment,
            defaults={'status': ConsultationSession.Status.COMPLETED, 'ended_at': timezone.now()}
        )
        session.status = ConsultationSession.Status.COMPLETED
        session.ended_at = timezone.now()
        session.save(update_fields=['status', 'ended_at'])

        # If doctor ends call, update appointment to COMPLETED
        if is_doctor or user.role == 'admin':
            if appointment.status == Appointment.Status.CONFIRMED:
                appointment.status = Appointment.Status.COMPLETED
                appointment.save(update_fields=['status'])

        return Response({
            'message': 'Consultation ended successfully.',
            'appointment_status': appointment.status,
        }, status=status.HTTP_200_OK)
