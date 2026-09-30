from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads the access token from an HttpOnly
    cookie named 'access_token' instead of (or in addition to) the
    Authorization header.
    """

    def authenticate(self, request):
        # First try the standard Authorization header
        header = self.get_header(request)
        if header:
            raw_token = self.get_raw_token(header)
            if raw_token:
                try:
                    validated_token = self.get_validated_token(raw_token)
                    return self.get_user(validated_token), validated_token
                except (InvalidToken, TokenError):
                    pass

        # Fall back to HttpOnly cookie
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token')
        raw_token = request.COOKIES.get(cookie_name)
        if not raw_token:
            return None

        try:
            validated_token = self.get_validated_token(raw_token.encode())
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError):
            return None
