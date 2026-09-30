from django.urls import path
from .views import ConsultationDetailView, EndConsultationView

urlpatterns = [
    path('<int:appointment_id>/', ConsultationDetailView.as_view(), name='consultation-detail'),
    path('<int:appointment_id>/end/', EndConsultationView.as_view(), name='consultation-end'),
]
