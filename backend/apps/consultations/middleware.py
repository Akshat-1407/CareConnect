import urllib.parse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

User = get_user_model()


@database_sync_to_async
def get_user_from_token(token_string):
    try:
        token = AccessToken(token_string)
        user_id = token['user_id']
        return User.objects.get(id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist, Exception):
        return AnonymousUser()


def parse_cookie_header(headers):
    """Parse cookie header tuple from ASGI scope headers."""
    cookies = {}
    for name, value in headers:
        if name.lower() == b'cookie':
            cookie_str = value.decode('utf-8', errors='ignore')
            for item in cookie_str.split(';'):
                item = item.strip()
                if '=' in item:
                    k, v = item.split('=', 1)
                    cookies[k.strip()] = v.strip()
    return cookies


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom Channels middleware to authenticate WebSocket connections using
    JWT from the HttpOnly 'access_token' cookie or from query string (?token=...).
    """

    async def __call__(self, scope, receive, send):
        token = None

        # 1. Check cookies (from scope['cookies'] if populated, or raw headers)
        cookies = scope.get('cookies')
        if not cookies and 'headers' in scope:
            cookies = parse_cookie_header(scope['headers'])

        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token')
        if cookies and cookie_name in cookies:
            token = cookies[cookie_name]

        # 2. Check query string as fallback (?token=...)
        if not token and 'query_string' in scope:
            query_string = scope['query_string'].decode('utf-8', errors='ignore')
            query_params = urllib.parse.parse_qs(query_string)
            token = query_params.get('token', [None])[0]

        # 3. Authenticate user from token
        if token:
            scope['user'] = await get_user_from_token(token)
        else:
            if 'user' not in scope or scope['user'] is None:
                scope['user'] = AnonymousUser()

        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner):
    """Helper to stack JWTAuthMiddleware."""
    return JWTAuthMiddleware(inner)
