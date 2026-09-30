from django.urls import path
from .views import (
    DoctorListView,
    DoctorDetailView,
    DoctorAvailableSlotsView,
)

urlpatterns = [
    path('', DoctorListView.as_view(), name='doctor-list'),
    path('<int:pk>/', DoctorDetailView.as_view(), name='doctor-detail'),
    path('<int:doctor_id>/slots/', DoctorAvailableSlotsView.as_view(), name='doctor-slots'),
]
