# CareConnect — VirtualCare Telemedicine

CareConnect is a simple telemedicine MVP for finding doctors, booking and paying for appointments, joining video consultations, and receiving prescriptions.

The application has three portals:

- Patient
- Doctor
- Admin

This README is the main project specification. `GEMINI.md` contains permanent development instructions, while phase-specific prompts define what should be implemented at each stage.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js App Router, React, JavaScript/JSX, Tailwind CSS, shadcn/ui |
| Backend | Python, Django, Django REST Framework |
| Database | MySQL |
| Authentication | JWT using `djangorestframework-simplejwt` |
| Video | WebRTC |
| Signaling | Django Channels WebSockets |
| Payments | Razorpay |

Django is the only backend.

The browser communicates with Django through REST APIs. MySQL stores application data. Django Channels handles WebRTC signaling, while WebRTC carries audio and video between browsers.

Redis is not required for the MVP. The Django Channels in-memory layer is acceptable for development. Production should use HTTPS/WSS and a TURN server for reliable WebRTC connectivity.

---

## Core MVP Flow

```text
Patient registers/logs in
→ Finds a doctor
→ Views available slots
→ Books an appointment
→ Pays using Razorpay
→ Appointment becomes confirmed
→ Patient and doctor join video consultation
→ Doctor writes prescription
→ Patient views prescription
```

Keep the first build focused on this flow.

---

## Portals

| Portal | Login | Main Area |
|---|---|---|
| Patient | `/login` | `/patient/*` |
| Doctor | `/doctor/login` | `/doctor/*` |
| Admin | `/internal/admin/login` | `/admin/*` |

The admin login must not be linked from public navigation, homepage, footer, patient login, doctor login, or registration pages.

However, hiding the admin route is not security. Django must verify the admin role on every admin API request.

Public registration creates patient accounts only. Doctor accounts are created by admins. Admin accounts are provisioned privately.

---

## Patient Features

Patients can:

- register, login, and logout
- view dashboard
- browse doctors
- search by name or specialization
- view doctor details and available slots
- book appointments
- pay using Razorpay
- view appointment status
- join confirmed video consultations
- view prescriptions
- view basic payment status

Do not add advanced recommendation systems, ratings, reviews, or location-based search.

---

## Doctor Features

Doctors can:

- login and logout
- view dashboard
- manage availability
- view assigned appointments
- join video consultations
- write prescriptions for assigned appointments

Doctors do not self-register in the MVP.

---

## Admin Features

Admins can:

- login through `/internal/admin/login`
- view a basic dashboard
- view users and doctors
- create doctor accounts
- view appointments
- view payment status

Keep the admin portal basic. Do not add advanced analytics or reporting.

---

## Appointment Booking

Booking flow:

```text
Doctor creates available slot
→ Patient selects doctor and slot
→ Django verifies availability
→ Appointment created as PENDING_PAYMENT
→ Razorpay payment starts
→ Backend verifies payment
→ Appointment becomes CONFIRMED
```

Prevent double booking using Django transactions and database-level protections where needed.

Recommended statuses:

```text
PENDING_PAYMENT
CONFIRMED
COMPLETED
CANCELLED
```

---

## Razorpay Payments

Use Razorpay Checkout in test mode during development.

The backend must:

1. create the Razorpay order
2. verify the Razorpay signature
3. verify the matching order
4. verify the expected amount
5. mark the appointment `CONFIRMED` only after successful verification

Never trust frontend payment success alone.

Keep Razorpay secrets on the Django backend only.

Do not implement refunds, wallets, subscriptions, invoices, or complex accounting.

---

## WebRTC Consultation

Use:

- WebRTC for audio/video
- Django Channels WebSockets for signaling

Recommended signaling route:

```text
/ws/consultations/{appointmentId}/
```

The WebSocket should exchange:

- offer
- answer
- ICE candidates

Before allowing a connection, Django must verify:

- the user is authenticated
- the appointment exists
- the appointment is eligible for consultation
- the user is the assigned patient or doctor

Knowing an appointment ID alone must never grant access.

Basic call controls:

- join
- mute/unmute
- camera on/off
- end call

Do not add recording, screen sharing, group calls, effects, or consultation chat.

---

## Prescriptions

A prescription belongs to an appointment, patient, and doctor.

It can contain:

- diagnosis
- instructions
- medications

Medication fields can include:

- medicine name
- dosage
- frequency
- duration
- notes

Only the assigned doctor can create the prescription. Patients can view only their own prescriptions.

Do not add pharmacy integration, AI diagnosis, medicine recommendation, or prescription PDF generation.

---

## Authentication

Use JWT with:

```text
djangorestframework-simplejwt
```

Django issues:

- access token
- refresh token

Store both tokens in **HttpOnly cookies**.

Do not store JWTs in:

- `localStorage`
- `sessionStorage`
- `NEXT_PUBLIC_*` variables

Use CSRF protection for state-changing requests.

Provide a refresh endpoint such as:

```text
/api/v1/auth/token/refresh/
```

If an authenticated request returns `401` because the access token expired:

1. refresh once
2. retry the original request once
3. redirect to login if refresh fails

Backend authorization must enforce role, appointment, consultation, and prescription ownership.

---

## Main Routes

```text
Public
/
/login
/register
/doctor/login
/internal/admin/login

Patient
/patient/dashboard
/patient/doctors
/patient/book/[doctorId]
/patient/appointments
/patient/consultation/[appointmentId]
/patient/prescriptions
/patient/payments

Doctor
/doctor/dashboard
/doctor/availability
/doctor/appointments
/doctor/consultation/[appointmentId]
/doctor/prescriptions/create/[appointmentId]

Admin
/admin/dashboard
/admin/doctors
/admin/users
/admin/appointments
/admin/payments
```

---

## API Groups

All REST APIs should use:

```text
/api/v1/
```

Suggested groups:

```text
auth/
internal/admin/auth/
doctors/
doctor/availability/
appointments/
doctor/appointments/
payments/
consultations/
prescriptions/
doctor/prescriptions/
admin/
```

---

## Project Structure

```text
CareConnect/
├── README.md
├── GEMINI.md
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   ├── doctors/
│       │   ├── appointments/
│       │   ├── consultation/
│       │   ├── prescriptions/
│       │   └── payments/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── lib/
└── backend/
    ├── config/
    └── apps/
        ├── accounts/
        ├── doctors/
        ├── appointments/
        ├── consultations/
        ├── prescriptions/
        └── payments/
```

---

## Frontend Rules

Keep React code modular.

Do not create one large `care-app.jsx` or oversized `page.jsx` files.

Use:

- `components/` for reusable UI and feature components
- `services/` for API calls
- `context/` for shared authentication state
- `hooks/` for WebRTC/WebSocket lifecycle logic
- `lib/` for shared helpers

Keep `components/ui/` for shadcn/ui primitives.

Avoid both monolithic files and unnecessary tiny wrapper components.

---

## UI / UX

The interface should be modern, polished, responsive, and visually appealing.

Use:

- good spacing
- consistent typography
- clean cards
- icons
- hover states
- loading states
- empty states
- error states
- subtle animations
- smooth interactions

The app should feel dynamic without being overly flashy.

Maintain a consistent healthcare-oriented design across patient, doctor, and admin portals.

---

## Configuration

Frontend may contain only browser-safe values such as:

- Django API URL
- WebSocket URL
- Razorpay public key ID

Backend contains:

- Django secret key
- MySQL credentials
- Razorpay key ID and secret
- allowed frontend origins
- STUN/TURN configuration when needed

Never expose backend secrets through frontend environment variables.

Use `.env.example` files instead of committing real secrets.

---

## Outside the MVP

Do not implement unless explicitly requested:

- notifications
- consultation chat
- medical-record uploads
- invoices
- refunds
- doctor earnings
- advanced analytics
- ratings and reviews
- doctor self-registration
- password recovery
- social login
- insurance integration
- pharmacy integration
- AI diagnosis or recommendations
- appointment reminders
- screen sharing
- recording
- group calls
- Redis
- Celery
- Kafka
- microservices
- Docker

---

## Development Guidance

When using Antigravity:

- treat this README as the source of truth
- treat `GEMINI.md` as permanent development guidance
- implement only the current phase
- do not start future phases automatically
- keep working functionality intact
- avoid unnecessary dependencies
- test changes and fix errors
- do not create automated test files unless explicitly requested
- update this README if an important architecture decision changes