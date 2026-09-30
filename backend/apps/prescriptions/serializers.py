from rest_framework import serializers
from django.db import transaction
from apps.appointments.models import Appointment
from .models import Prescription, PrescriptionMedication


class PrescriptionMedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionMedication
        fields = [
            'id',
            'medicine_name',
            'dosage',
            'frequency',
            'duration',
            'notes',
            'order'
        ]


class PrescriptionSerializer(serializers.ModelSerializer):
    medications = PrescriptionMedicationSerializer(many=True, read_only=True)
    patient = serializers.SerializerMethodField()
    doctor = serializers.SerializerMethodField()
    appointment_details = serializers.SerializerMethodField()

    class Meta:
        model = Prescription
        fields = [
            'id',
            'appointment_id',
            'patient',
            'doctor',
            'diagnosis',
            'instructions',
            'medications',
            'appointment_details',
            'created_at',
            'updated_at'
        ]

    def get_patient(self, obj):
        patient = obj.patient
        return {
            'id': patient.id,
            'name': patient.get_full_name() or patient.username,
            'email': patient.email,
        }

    def get_doctor(self, obj):
        doctor = obj.doctor
        return {
            'id': doctor.id,
            'name': f"Dr. {doctor.user.get_full_name() or doctor.user.username}",
            'specialization': doctor.specialization,
        }

    def get_appointment_details(self, obj):
        appt = obj.appointment
        slot = getattr(appt, 'slot', None)
        return {
            'id': appt.id,
            'status': appt.status,
            'date': str(slot.date) if slot else None,
            'start_time': str(slot.start_time) if slot else None,
            'end_time': str(slot.end_time) if slot else None,
        }


class CreateMedicationInputSerializer(serializers.Serializer):
    medicine_name = serializers.CharField(max_length=200)
    dosage = serializers.CharField(max_length=100)
    frequency = serializers.CharField(max_length=100)
    duration = serializers.CharField(max_length=100)
    notes = serializers.CharField(max_length=300, required=False, allow_blank=True, default='')


class CreatePrescriptionSerializer(serializers.Serializer):
    appointment_id = serializers.IntegerField()
    diagnosis = serializers.CharField()
    instructions = serializers.CharField(required=False, allow_blank=True, default='')
    medications = CreateMedicationInputSerializer(many=True)

    def validate_appointment_id(self, value):
        try:
            appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=value)
        except Appointment.DoesNotExist:
            raise serializers.ValidationError("Appointment not found.")

        # Check eligibility: must be CONFIRMED or COMPLETED
        if appointment.status not in [Appointment.Status.CONFIRMED, Appointment.Status.COMPLETED]:
            raise serializers.ValidationError(
                f"Prescription can only be created for confirmed or completed appointments (current: {appointment.status})."
            )

        # Check assigned doctor
        user = self.context['request'].user
        if appointment.doctor.user_id != user.id:
            raise serializers.ValidationError("You are not the assigned doctor for this appointment.")

        return value

    def validate_medications(self, value):
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one medication is required in the prescription.")
        return value

    def create(self, validated_data):
        appointment_id = validated_data['appointment_id']
        diagnosis = validated_data['diagnosis']
        instructions = validated_data.get('instructions', '')
        medications_data = validated_data['medications']

        appointment = Appointment.objects.select_related('doctor', 'patient').get(pk=appointment_id)

        with transaction.atomic():
            # If prescription already exists, update it or replace medications
            prescription, created = Prescription.objects.get_or_create(
                appointment=appointment,
                defaults={
                    'patient': appointment.patient,
                    'doctor': appointment.doctor,
                    'diagnosis': diagnosis,
                    'instructions': instructions,
                }
            )

            if not created:
                prescription.diagnosis = diagnosis
                prescription.instructions = instructions
                prescription.save(update_fields=['diagnosis', 'instructions', 'updated_at'])
                # Clear existing medications to replace with updated list
                prescription.medications.all().delete()

            # Create medication rows
            med_objects = [
                PrescriptionMedication(
                    prescription=prescription,
                    medicine_name=med['medicine_name'],
                    dosage=med['dosage'],
                    frequency=med['frequency'],
                    duration=med['duration'],
                    notes=med.get('notes', ''),
                    order=idx
                )
                for idx, med in enumerate(medications_data)
            ]
            PrescriptionMedication.objects.bulk_create(med_objects)

            # Mark appointment as completed
            if appointment.status == Appointment.Status.CONFIRMED:
                appointment.status = Appointment.Status.COMPLETED
                appointment.save(update_fields=['status'])

            return prescription
