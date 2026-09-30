from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db import models
from django.utils import timezone
from django.shortcuts import get_object_or_404

from apps.accounts.permissions import IsDoctor
from .models import DoctorProfile, AvailabilitySlot
from .serializers import (
    DoctorProfileSerializer,
    AvailabilitySlotSerializer,
    CreateAvailabilitySlotSerializer,
)


def get_or_create_doctor_profile(user):
    """Retrieve existing doctor profile or create a default one for the doctor user."""
    profile, _ = DoctorProfile.objects.get_or_create(
        user=user,
        defaults={
            'specialization': 'General Physician',
            'qualification': 'MBBS',
            'experience_years': 5,
            'consultation_fee': 500.00,
            'bio': 'Certified medical practitioner providing virtual consultations.',
            'is_available': True,
        }
    )
    return profile


class DoctorListView(APIView):
    """
    GET /api/v1/doctors/
    Browse active doctors. Supports simple query filtering:
    - ?search=... (matches doctor name, username, or specialization)
    - ?specialization=... (matches specialization)
    """
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.query_params.get('search', '').strip()
        specialization = request.query_params.get('specialization', '').strip()

        queryset = DoctorProfile.objects.filter(is_available=True).select_related('user')

        if search:
            queryset = queryset.filter(
                models.Q(user__first_name__icontains=search) |
                models.Q(user__last_name__icontains=search) |
                models.Q(user__username__icontains=search) |
                models.Q(specialization__icontains=search)
            )

        if specialization:
            queryset = queryset.filter(specialization__icontains=specialization)

        serializer = DoctorProfileSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DoctorDetailView(APIView):
    """
    GET /api/v1/doctors/<int:pk>/
    View public profile details of a single doctor.
    """
    permission_classes = [AllowAny]

    def get(self, request, pk):
        doctor = get_object_or_404(DoctorProfile.objects.select_related('user'), pk=pk)
        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DoctorAvailableSlotsView(APIView):
    """
    GET /api/v1/doctors/<int:doctor_id>/slots/
    View unbooked, future appointment slots for a specific doctor.
    Optional query param: ?date=YYYY-MM-DD
    """
    permission_classes = [AllowAny]

    def get(self, request, doctor_id):
        doctor = get_object_or_404(DoctorProfile, pk=doctor_id)
        now = timezone.localtime()

        slots = AvailabilitySlot.objects.filter(
            doctor=doctor,
            is_booked=False
        ).filter(
            models.Q(date__gt=now.date()) |
            models.Q(date=now.date(), start_time__gt=now.time())
        ).order_by('date', 'start_time')

        date_param = request.query_params.get('date', '').strip()
        if date_param:
            slots = slots.filter(date=date_param)

        serializer = AvailabilitySlotSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DoctorAvailabilityView(APIView):
    """
    Doctor-authenticated availability endpoint:
    - GET /api/v1/doctor/availability/ -> list doctor's slots
    - POST /api/v1/doctor/availability/ -> add future slot
    """
    permission_classes = [IsDoctor]

    def get(self, request):
        doctor = get_or_create_doctor_profile(request.user)
        upcoming_only = request.query_params.get('upcoming', 'false').lower() == 'true'
        date_param = request.query_params.get('date', '').strip()

        slots = AvailabilitySlot.objects.filter(doctor=doctor)

        if upcoming_only:
            now = timezone.localtime()
            slots = slots.filter(
                models.Q(date__gt=now.date()) |
                models.Q(date=now.date(), start_time__gt=now.time())
            )

        if date_param:
            slots = slots.filter(date=date_param)

        slots = slots.order_by('date', 'start_time')
        serializer = AvailabilitySlotSerializer(slots, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        doctor = get_or_create_doctor_profile(request.user)
        serializer = CreateAvailabilitySlotSerializer(
            data=request.data,
            context={'doctor': doctor}
        )
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        slot = serializer.save()
        return Response(
            AvailabilitySlotSerializer(slot).data,
            status=status.HTTP_201_CREATED
        )


class DoctorAvailabilityDetailView(APIView):
    """
    Doctor-authenticated slot management:
    - DELETE /api/v1/doctor/availability/<int:pk>/ -> remove an unbooked future slot
    """
    permission_classes = [IsDoctor]

    def delete(self, request, pk):
        doctor = get_or_create_doctor_profile(request.user)
        slot = get_object_or_404(AvailabilitySlot, pk=pk)

        # Enforce that doctor can modify only their own slots
        if slot.doctor_id != doctor.id:
            return Response(
                {"detail": "You do not have permission to delete this slot."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Enforce that booked slots cannot be deleted
        if slot.is_booked:
            return Response(
                {"detail": "Cannot remove an appointment slot that is already booked."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Enforce that past slots cannot be deleted as availability slots
        if slot.is_in_past():
            return Response(
                {"detail": "Cannot remove a slot from the past."},
                status=status.HTTP_400_BAD_REQUEST
            )

        slot.delete()
        return Response(
            {"message": "Availability slot removed successfully."},
            status=status.HTTP_200_OK
        )
