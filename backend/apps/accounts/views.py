from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from .models import User


def _set_auth_cookies(response, access_token, refresh_token):
    """Set HttpOnly JWT cookies on a response."""
    response.set_cookie(
        key='access_token',
        value=str(access_token),
        max_age=settings.SIMPLE_JWT.get('ACCESS_TOKEN_COOKIE_MAX_AGE', 60 * 15),  # 15 min
        httponly=True,
        secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
        samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        path='/',
    )
    response.set_cookie(
        key='refresh_token',
        value=str(refresh_token),
        max_age=settings.SIMPLE_JWT.get('REFRESH_TOKEN_COOKIE_MAX_AGE', 60 * 60 * 24),  # 1 day
        httponly=True,
        secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
        samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        path='/',
    )


def _clear_auth_cookies(response):
    """Clear JWT cookies with settings-aligned attributes."""
    response.delete_cookie(
        'access_token',
        path='/',
        samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
    )
    response.delete_cookie(
        'refresh_token',
        path='/',
        samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
    )


class RegisterView(APIView):
    """POST /api/v1/auth/register/ — Patient self-registration only."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        response = Response(
            {'user': UserSerializer(user).data, 'message': 'Registration successful.'},
            status=status.HTTP_201_CREATED,
        )
        _set_auth_cookies(response, refresh.access_token, refresh)
        return response


class LoginView(APIView):
    """POST /api/v1/auth/login/ — Patient login only."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        # Patient login endpoint only allows patients
        if user.role != User.Role.PATIENT:
            return Response(
                {'detail': 'This login is for patients only.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        response = Response(
            {'user': UserSerializer(user).data, 'message': 'Login successful.'},
            status=status.HTTP_200_OK,
        )
        _set_auth_cookies(response, refresh.access_token, refresh)
        return response


class DoctorLoginView(APIView):
    """POST /api/v1/auth/doctor/login/ — Doctor login only."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        if user.role != User.Role.DOCTOR:
            return Response(
                {'detail': 'This login is for doctors only.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        response = Response(
            {'user': UserSerializer(user).data, 'message': 'Doctor login successful.'},
            status=status.HTTP_200_OK,
        )
        _set_auth_cookies(response, refresh.access_token, refresh)
        return response


class AdminLoginView(APIView):
    """POST /api/v1/internal/admin/auth/login/ — Admin login only."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        if user.role != User.Role.ADMIN:
            return Response(
                {'detail': 'Access denied.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        response = Response(
            {'user': UserSerializer(user).data, 'message': 'Admin login successful.'},
            status=status.HTTP_200_OK,
        )
        _set_auth_cookies(response, refresh.access_token, refresh)
        return response


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ — Blacklist refresh token and clear cookies."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        response = Response({'message': 'Logged out successfully.'}, status=status.HTTP_200_OK)

        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass  # Token may already be invalid; clear cookies regardless

        _clear_auth_cookies(response)
        return response


class MeView(APIView):
    """GET /api/v1/auth/me/ — Return current authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class TokenRefreshCookieView(APIView):
    """POST /api/v1/auth/token/refresh/ — Issue new access token using refresh cookie."""
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')

        if not refresh_token:
            return Response(
                {'detail': 'Refresh token not provided.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            # We use TokenRefreshSerializer which handles rotation and blacklisting
            from rest_framework_simplejwt.serializers import TokenRefreshSerializer
            from rest_framework_simplejwt.exceptions import InvalidToken
            
            serializer = TokenRefreshSerializer(data={'refresh': refresh_token})
            serializer.is_valid(raise_exception=True)
            
            new_access = serializer.validated_data.get('access')
            new_refresh = serializer.validated_data.get('refresh') # if ROTATE_REFRESH_TOKENS=True

            response = Response({'message': 'Token refreshed.'}, status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=str(new_access),
                max_age=settings.SIMPLE_JWT.get('ACCESS_TOKEN_COOKIE_MAX_AGE', 60 * 15),
                httponly=True,
                secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
                samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                path='/',
            )
            
            if new_refresh:
                response.set_cookie(
                    key='refresh_token',
                    value=str(new_refresh),
                    max_age=settings.SIMPLE_JWT.get('REFRESH_TOKEN_COOKIE_MAX_AGE', 60 * 60 * 24),
                    httponly=True,
                    secure=settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False),
                    samesite=settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax'),
                    path='/',
                )
                
            return response
        except Exception:
            response = Response(
                {'detail': 'Invalid or expired refresh token.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            _clear_auth_cookies(response)
            return response
