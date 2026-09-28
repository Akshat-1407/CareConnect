# CareConnect360 — WebRTC Video Consultation Architecture

# Responsibilities

```text
WebRTC
→ real-time audio/video

Django Channels + WebSocket
→ signaling

Django Channels In-Memory Channel Layer
→ WebSocket group messaging for this single-server project

MySQL
→ persistent application/consultation data

STUN/TURN
→ NAT traversal and relay when direct peer connection fails
```

# REST Routes

```text
POST /api/v1/consultations/{appointmentId}/prepare/
GET  /api/v1/consultations/{appointmentId}/
POST /api/v1/consultations/{appointmentId}/start/
POST /api/v1/consultations/{appointmentId}/end/
```

# Signaling Route

```text
/ws/consultations/{appointmentId}/
```

Development example:

```text
ws://localhost:8000/ws/consultations/123/
```

Production should use secure WebSocket (`wss`).

# Events

```text
join_room
offer
answer
ice_candidate
leave_room
end_call
chat_message
```

# Connection Flow

```text
Patient Browser
      │
      │ join room
      ▼
Django Channels
      │
      ▼
Doctor Browser

Patient creates SDP offer
      │
      ▼
Django Channels
      │
      ▼
Doctor

Doctor creates SDP answer
      │
      ▼
Django Channels
      │
      ▼
Patient

Patient ⇄ ICE candidates ⇄ Doctor
              │
              ▼
     Peer connection established

Patient Browser ═════ WebRTC audio/video ═════ Doctor Browser
```

Django does not normally carry the actual audio/video stream. It handles authentication, consultation authorization, REST operations, and WebRTC signaling.

# Authorization

Before accepting a signaling socket:

```text
Authenticate user
      ↓
Load appointment
      ↓
Is user the patient or assigned doctor?
      ↓
Is appointment eligible for consultation?
      ↓
Allow WebSocket group join
```

Reject unauthorized sockets.

# Django Channels Without Django Channels in-memory channel layer

For this project, use Django Channels' in-memory channel layer:

```python
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer"
    }
}
```

This is appropriate for development, demonstrations, and a simple single-process/single-server deployment.

Important limitation: the in-memory channel layer is not shared between multiple Django worker processes or multiple backend servers. If the application is later scaled horizontally, replace it with a production shared channel layer.

MySQL remains the system of record for:

- users
- patients
- doctors
- appointments
- consultations
- prescriptions
- payments
- invoices
- medical records

# STUN/TURN

STUN helps peers discover network/public connection information.

TURN relays media when a direct peer-to-peer connection cannot be established.

For local development/testing, STUN may be enough in many cases. For a reliable deployed telemedicine application, configure TURN.

# Frontend Components

```text
VideoCall.jsx
VideoParticipant.jsx
VideoControls.jsx
CallStatus.jsx
ConsultationChat.jsx
```

Recommended hooks/utilities:

```text
useWebRTC.js
useWebSocket.js
lib/webrtc.js
lib/websocket.js
```

# Cleanup

When leaving the consultation:

1. stop local media tracks;
2. close `RTCPeerConnection`;
3. close WebSocket;
4. clear references/listeners;
5. notify the backend when appropriate.

# Architecture

```text
                 Next.js Frontend
           ┌─────────────┴─────────────┐
           │                           │
      Patient UI                  Doctor UI
           │                           │
           └──────── REST ─────────────┘
                       │
                 Django REST API
                       │
                     MySQL


Patient Browser                         Doctor Browser
      │                                      │
      └──── WebSocket ─► Django Channels ◄───┘
                              │
                    In-Memory Channel Layer


Patient Browser ◄════════ WebRTC ════════► Doctor Browser
                              │
                          STUN / TURN
```

# Scaling Note

The current architecture intentionally does not use Django Channels in-memory channel layer.

If CareConnect360 later needs multiple Django WebSocket workers or multiple backend instances, the in-memory channel layer should be replaced by a shared production channel layer. That is a future scaling concern and is not required for the current project.
