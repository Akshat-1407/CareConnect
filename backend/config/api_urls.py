from django.urls import path, include
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from apps.accounts.views import AdminLoginView
from apps.doctors.views import DoctorAvailabilityView, DoctorAvailabilityDetailView
from apps.appointments.views import DoctorAppointmentListView


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "status": "healthy",
            "service": "CareConnect Telemedicine API",
            "version": "v1"
        })


urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),

    # Auth routes (patient register/login, doctor login, shared logout/me/refresh)
    path('auth/', include('apps.accounts.urls')),

    # Internal admin auth (separate path)
    path('internal/admin/auth/login/', AdminLoginView.as_view(), name='admin-login'),

    # Doctor discovery (patient facing)
    path('doctors/', include('apps.doctors.urls')),

    # Doctor schedule & appointments (doctor portal)
    path('doctor/availability/', DoctorAvailabilityView.as_view(), name='doctor-availability'),
    path('doctor/availability/<int:pk>/', DoctorAvailabilityDetailView.as_view(), name='doctor-availability-detail'),
    path('doctor/appointments/', DoctorAppointmentListView.as_view(), name='doctor-appointments'),

    # Patient appointments and payments
    path('appointments/', include('apps.appointments.urls')),
    path('payments/', include('apps.payments.urls')),

    # Feature routes
    path('consultations/', include('apps.consultations.urls')),
    path('prescriptions/', include('apps.prescriptions.urls')),
    path('doctor/prescriptions/', include('apps.prescriptions.urls')),

    # Admin portal routes
    path('admin/', include('apps.accounts.admin_urls')),
]
