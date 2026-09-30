from django.urls import path, re_path
from .consumers import ConsultationConsumer

websocket_urlpatterns = [
    re_path(r'^ws/consultations/(?P<appointment_id>\w+)/$', ConsultationConsumer.as_asgi()),
    path('ws/consultations/<int:appointment_id>/', ConsultationConsumer.as_asgi()),
]
