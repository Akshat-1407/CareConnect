from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'slot', 'status', 'amount', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('patient__username', 'patient__email', 'doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
