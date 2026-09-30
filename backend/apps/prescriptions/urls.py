from django.urls import path
from .views import (
    PrescriptionListCreateView,
    PrescriptionDetailView,
    AppointmentPrescriptionView
)

urlpatterns = [
    path('', PrescriptionListCreateView.as_view(), name='prescription-list-create'),
    path('create/', PrescriptionListCreateView.as_view(), name='prescription-create'),
    path('<int:pk>/', PrescriptionDetailView.as_view(), name='prescription-detail'),
    path('appointment/<int:appointment_id>/', AppointmentPrescriptionView.as_view(), name='appointment-prescription'),
]
