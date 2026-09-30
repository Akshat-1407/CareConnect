from django.contrib import admin
from .models import Prescription, PrescriptionMedication


class PrescriptionMedicationInline(admin.TabularInline):
    model = PrescriptionMedication
    extra = 1


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'appointment', 'patient', 'doctor', 'created_at')
    list_filter = ('created_at', 'doctor')
    search_fields = ('patient__username', 'doctor__user__username', 'diagnosis')
    inlines = [PrescriptionMedicationInline]


@admin.register(PrescriptionMedication)
class PrescriptionMedicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'prescription', 'medicine_name', 'dosage', 'frequency', 'duration')
    search_fields = ('medicine_name', 'prescription__id')
