import json
import logging
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone
from apps.appointments.models import Appointment
from .models import ConsultationSession

logger = logging.getLogger(__name__)

# In-memory registry to track connected peers in consultation rooms
ROOM_MEMBERS = {}


class ConsultationConsumer(AsyncJsonWebsocketConsumer):
    """
    WebSocket consumer for 1-to-1 WebRTC signaling.
    Route: /ws/consultations/{appointmentId}/
    Transfers SDP offers, answers, and ICE candidates between patient and doctor.
    """

    async def connect(self):
        self.appointment_id = self.scope['url_route']['kwargs'].get('appointment_id')
        self.room_group_name = f"consultation_{self.appointment_id}"
        self.user = self.scope.get('user')

        # 1. Enforce user authentication
        if not self.user or not self.user.is_authenticated:
            logger.warning(
                f"[WebSocket] Unauthenticated connection rejected for appointment {self.appointment_id}"
            )
            await self.close(code=4001)
            return

        # 2. Verify appointment existence, eligibility, and participant ownership
        verification = await self.verify_consultation_access(self.appointment_id, self.user)
        if not verification['valid']:
            logger.warning(
                f"[WebSocket] Access denied for user {self.user.id} on appointment {self.appointment_id}: {verification['reason']}"
            )
            await self.close(code=verification['code'])
            return

        self.appointment = verification['appointment']
        self.user_role = verification['role']

        # 3. Add to room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        # 4. Mark consultation session as active
        await self.mark_consultation_started(self.appointment_id)

        # 5. Check existing members already in this room
        existing_peers = list(ROOM_MEMBERS.get(self.room_group_name, {}).values())

        if self.room_group_name not in ROOM_MEMBERS:
            ROOM_MEMBERS[self.room_group_name] = {}
        ROOM_MEMBERS[self.room_group_name][self.channel_name] = {
            'role': self.user_role,
            'user_id': self.user.id,
            'user_name': self.user.get_full_name() or self.user.username,
        }

        # 6. Send acknowledgment to the connected client with existing peers info
        await self.send_json({
            'type': 'connection_established',
            'role': self.user_role,
            'user_id': self.user.id,
            'user_name': self.user.get_full_name() or self.user.username,
            'appointment_id': int(self.appointment_id),
            'existing_peers': existing_peers,
        })

        # 7. Broadcast peer_joined to the room so other party knows to initiate connection
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'consultation_message',
                'sender_channel_name': self.channel_name,
                'data': {
                    'type': 'peer_joined',
                    'role': self.user_role,
                    'user_id': self.user.id,
                    'user_name': self.user.get_full_name() or self.user.username,
                }
            }
        )

    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            # Remove from room members
            if self.room_group_name in ROOM_MEMBERS:
                ROOM_MEMBERS[self.room_group_name].pop(self.channel_name, None)
                if not ROOM_MEMBERS[self.room_group_name]:
                    del ROOM_MEMBERS[self.room_group_name]

            # Notify peer that participant left
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'consultation_message',
                    'sender_channel_name': self.channel_name,
                    'data': {
                        'type': 'peer_left',
                        'role': getattr(self, 'user_role', 'unknown'),
                        'user_id': getattr(self.user, 'id', None),
                    }
                }
            )

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive_json(self, content):
        """
        Handle incoming WebRTC signaling JSON from client:
        - 'offer'
        - 'answer'
        - 'ice-candidate' / 'ice_candidate'
        - 'ready'
        - 'join'
        - 'end-call' / 'end_call'
        - 'media-state' / 'media_state'
        """
        msg_type = content.get('type')
        if not msg_type:
            return

        # Normalize message payload with sender info
        payload = dict(content)
        payload['sender_role'] = getattr(self, 'user_role', 'unknown')
        payload['sender_id'] = getattr(self.user, 'id', None)

        if msg_type in ['end-call', 'end_call']:
            await self.mark_consultation_ended(self.appointment_id)

        # Forward message to the other participant in the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'consultation_message',
                'sender_channel_name': self.channel_name,
                'data': payload
            }
        )

    async def consultation_message(self, event):
        """Forward signaling message to client (skipping original sender)."""
        if event.get('sender_channel_name') == self.channel_name:
            return

        await self.send_json(event['data'])

    @database_sync_to_async
    def verify_consultation_access(self, appointment_id, user):
        """Verify appointment existence, CONFIRMED status, and user assignment."""
        try:
            appt = Appointment.objects.select_related(
                'patient',
                'doctor',
                'doctor__user'
            ).get(pk=appointment_id)
        except (Appointment.DoesNotExist, ValueError):
            return {
                'valid': False,
                'code': 4004,
                'reason': 'Appointment does not exist.'
            }

        # Check eligibility: must be CONFIRMED
        if appt.status != Appointment.Status.CONFIRMED:
            return {
                'valid': False,
                'code': 4002,
                'reason': f"Appointment status is '{appt.status}', eligible only when CONFIRMED."
            }

        # Check role assignment
        if appt.patient_id == user.id:
            role = 'patient'
        elif appt.doctor.user_id == user.id:
            role = 'doctor'
        elif getattr(user, 'role', '') == 'admin':
            role = 'admin'
        else:
            return {
                'valid': False,
                'code': 4003,
                'reason': 'User is neither assigned patient nor doctor.'
            }

        return {
            'valid': True,
            'appointment': appt,
            'role': role
        }

    @database_sync_to_async
    def mark_consultation_started(self, appointment_id):
        """Record or update active consultation session."""
        try:
            session, created = ConsultationSession.objects.get_or_create(
                appointment_id=appointment_id,
                defaults={
                    'status': ConsultationSession.Status.ACTIVE,
                    'started_at': timezone.now()
                }
            )
            if not created and not session.started_at:
                session.started_at = timezone.now()
                session.status = ConsultationSession.Status.ACTIVE
                session.save(update_fields=['started_at', 'status'])
        except Exception as e:
            logger.error(f"Error marking consultation started: {e}")

    @database_sync_to_async
    def mark_consultation_ended(self, appointment_id):
        """Mark consultation session ended."""
        try:
            session = ConsultationSession.objects.get(appointment_id=appointment_id)
            session.ended_at = timezone.now()
            session.status = ConsultationSession.Status.COMPLETED
            session.save(update_fields=['ended_at', 'status'])
        except Exception:
            pass
