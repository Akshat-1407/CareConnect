from django.db import models
from django.conf import settings


class Prescription(models.Model):
    appointment = models.OneToOneField(
        'appointments.Appointment',
        on_delete=models.CASCADE,
        related_name='prescription'
    )
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )
    doctor = models.ForeignKey(
        'doctors.DoctorProfile',
        on_delete=models.CASCADE,
        related_name='prescriptions'
    )
    diagnosis = models.TextField(help_text="Clinical diagnosis or findings")
    instructions = models.TextField(blank=True, default='', help_text="Special instructions / advice")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'prescriptions_prescription'
        ordering = ['-created_at']

    def __str__(self):
        return f"Prescription #{self.id} for Appt #{self.appointment_id}"


class PrescriptionMedication(models.Model):
    prescription = models.ForeignKey(
        Prescription,
        on_delete=models.CASCADE,
        related_name='medications'
    )
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    notes = models.CharField(max_length=300, blank=True, default='')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'prescriptions_medication'
        ordering = ['order', 'id']

    def __str__(self):
        return f"{self.medicine_name} ({self.dosage}) - Prescription #{self.prescription_id}"
