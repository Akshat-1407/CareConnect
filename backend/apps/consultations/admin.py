from django.contrib import admin
from .models import ConsultationSession


@admin.register(ConsultationSession)
class ConsultationSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'appointment', 'status', 'started_at', 'ended_at', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('appointment__id', 'appointment__patient__username', 'appointment__doctor__user__username')
