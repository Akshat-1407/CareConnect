from django.urls import path
from .admin_views import (
    AdminStatsView,
    AdminUserListView,
    AdminUserDetailView,
    AdminDoctorListView,
    AdminDoctorDetailView,
    AdminDoctorCreateView,
    AdminAppointmentListView,
    AdminAppointmentDetailView,
    AdminPaymentListView,
    AdminPaymentDetailView,
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('doctors/', AdminDoctorListView.as_view(), name='admin-doctors'),
    path('doctors/<int:pk>/', AdminDoctorDetailView.as_view(), name='admin-doctor-detail'),
    path('doctors/create/', AdminDoctorCreateView.as_view(), name='admin-doctor-create'),
    path('appointments/', AdminAppointmentListView.as_view(), name='admin-appointments'),
    path('appointments/<int:pk>/', AdminAppointmentDetailView.as_view(), name='admin-appointment-detail'),
    path('payments/', AdminPaymentListView.as_view(), name='admin-payments'),
    path('payments/<int:pk>/', AdminPaymentDetailView.as_view(), name='admin-payment-detail'),
]
