from django.urls import path
from .views import (
    VerifyPaymentView,
    PaymentListView,
    PaymentDetailView,
)

urlpatterns = [
    path('', PaymentListView.as_view(), name='payment-list'),
    path('verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('<int:pk>/', PaymentDetailView.as_view(), name='payment-detail'),
]
