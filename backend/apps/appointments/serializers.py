from rest_framework import serializers
from .models import Appointment
from apps.doctors.serializers import DoctorProfileSerializer, AvailabilitySlotSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    doctor = DoctorProfileSerializer(read_only=True)
    slot = AvailabilitySlotSerializer(read_only=True)
    patient_name = serializers.SerializerMethodField()
    patient_email = serializers.CharField(source='patient.email', read_only=True)

    class Meta:
        model = Appointment
        fields = (
            'id',
            'patient',
            'patient_name',
            'patient_email',
            'doctor',
            'slot',
            'status',
            'amount',
            'notes',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'patient', 'doctor', 'slot', 'status', 'amount', 'created_at', 'updated_at')

    def get_patient_name(self, obj):
        name = obj.patient.get_full_name() or obj.patient.username
        return name


class CreateAppointmentSerializer(serializers.Serializer):
    slot_id = serializers.IntegerField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
