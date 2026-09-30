from django.urls import path
from .admin_views import (
    AdminStatsView,
    AdminUserListView,
    AdminDoctorListView,
    AdminDoctorCreateView,
    AdminAppointmentListView,
    AdminPaymentListView,
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('doctors/', AdminDoctorListView.as_view(), name='admin-doctors'),
    path('doctors/create/', AdminDoctorCreateView.as_view(), name='admin-doctor-create'),
    path('appointments/', AdminAppointmentListView.as_view(), name='admin-appointments'),
    path('payments/', AdminPaymentListView.as_view(), name='admin-payments'),
]
