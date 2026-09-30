from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    DoctorLoginView,
    LogoutView,
    MeView,
    TokenRefreshCookieView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth-register'),
    path('login/', LoginView.as_view(), name='auth-login'),
    path('doctor/login/', DoctorLoginView.as_view(), name='auth-doctor-login'),
    path('logout/', LogoutView.as_view(), name='auth-logout'),
    path('me/', MeView.as_view(), name='auth-me'),
    path('token/refresh/', TokenRefreshCookieView.as_view(), name='auth-token-refresh'),
]
