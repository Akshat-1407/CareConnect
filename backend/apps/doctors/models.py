from django.db import models
from django.conf import settings
from django.utils import timezone


class DoctorProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='doctor_profile'
    )
    specialization = models.CharField(max_length=100)
    qualification = models.CharField(max_length=150, blank=True, default='')
    experience_years = models.PositiveIntegerField(default=0)
    consultation_fee = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    bio = models.TextField(blank=True, default='')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'doctors_profile'
        ordering = ['user__first_name', 'user__last_name']

    def __str__(self):
        name = self.user.get_full_name() or self.user.username
        return f"Dr. {name} - {self.specialization}"


class AvailabilitySlot(models.Model):
    doctor = models.ForeignKey(
        DoctorProfile,
        on_delete=models.CASCADE,
        related_name='availability_slots'
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'doctors_availability_slot'
        ordering = ['date', 'start_time']
        constraints = [
            models.UniqueConstraint(
                fields=['doctor', 'date', 'start_time'],
                name='unique_doctor_date_starttime'
            )
        ]

    def __str__(self):
        return f"{self.doctor} | {self.date} {self.start_time}-{self.end_time} ({'Booked' if self.is_booked else 'Available'})"

    def is_in_past(self):
        now = timezone.localtime()
        if self.date < now.date():
            return True
        if self.date == now.date() and self.start_time <= now.time():
            return True
        return False
