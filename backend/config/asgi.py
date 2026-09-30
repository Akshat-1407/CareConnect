import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from apps.consultations.middleware import JWTAuthMiddlewareStack
import apps.consultations.routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(
        AuthMiddlewareStack(
            URLRouter(
                apps.consultations.routing.websocket_urlpatterns
            )
        )
    ),
})
