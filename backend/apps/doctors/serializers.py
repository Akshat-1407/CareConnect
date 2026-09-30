from rest_framework import serializers
from django.utils import timezone
from .models import DoctorProfile, AvailabilitySlot


class DoctorProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    full_name = serializers.SerializerMethodField()
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = DoctorProfile
        fields = (
            'id',
            'first_name',
            'last_name',
            'full_name',
            'email',
            'specialization',
            'qualification',
            'experience_years',
            'consultation_fee',
            'bio',
            'is_available',
        )

    def get_full_name(self, obj):
        name = obj.user.get_full_name()
        if not name:
            name = obj.user.username
        return f"Dr. {name}"


class AvailabilitySlotSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = AvailabilitySlot
        fields = (
            'id',
            'doctor',
            'doctor_name',
            'date',
            'start_time',
            'end_time',
            'is_booked',
            'created_at',
        )
        read_only_fields = ('id', 'doctor', 'doctor_name', 'is_booked', 'created_at')

    def get_doctor_name(self, obj):
        name = obj.doctor.user.get_full_name() or obj.doctor.user.username
        return f"Dr. {name}"


class CreateAvailabilitySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilitySlot
        fields = ('id', 'date', 'start_time', 'end_time')
        read_only_fields = ('id',)

    def validate(self, attrs):
        date = attrs.get('date')
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        if start_time >= end_time:
            raise serializers.ValidationError({
                "end_time": "End time must be after start time."
            })

        now = timezone.localtime()
        if date < now.date():
            raise serializers.ValidationError({
                "date": "Slot date cannot be in the past."
            })
        if date == now.date() and start_time <= now.time():
            raise serializers.ValidationError({
                "start_time": "Slot start time must be in the future."
            })

        doctor = self.context.get('doctor')
        if not doctor:
            raise serializers.ValidationError("Doctor profile not found.")

        # Check for overlapping slots for the same doctor on this date
        overlapping = AvailabilitySlot.objects.filter(
            doctor=doctor,
            date=date,
            start_time__lt=end_time,
            end_time__gt=start_time,
        )
        if overlapping.exists():
            raise serializers.ValidationError(
                "This slot overlaps with an existing appointment slot for this date."
            )

        return attrs

    def create(self, validated_data):
        doctor = self.context['doctor']
        return AvailabilitySlot.objects.create(doctor=doctor, **validated_data)
