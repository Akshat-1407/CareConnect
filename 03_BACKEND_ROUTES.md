# CareConnect360 — Backend Routes

Base REST API:

```text
/api/v1/
```

WebSockets:

```text
/ws/
```

# Authentication

```text
POST   /api/v1/auth/register/
POST   /api/v1/auth/doctor-register/
POST   /api/v1/auth/login/
POST   /api/v1/auth/logout/
POST   /api/v1/auth/token/refresh/

GET    /api/v1/auth/me/
PATCH  /api/v1/auth/me/

POST   /api/v1/auth/change-password/
POST   /api/v1/auth/forgot-password/
POST   /api/v1/auth/reset-password/
```

Patient registration always creates `PATIENT`.

Doctor registration creates `DOCTOR` with verification status `PENDING`.

Never accept `ADMIN` from public registration.

# Patient APIs

## Dashboard

```text
GET /api/v1/patient/dashboard/
```

Return upcoming appointments, recent prescriptions, payments and medical records.

## Profile

```text
GET   /api/v1/patients/me/
PATCH /api/v1/patients/me/
```

## Doctor Discovery

```text
GET /api/v1/doctors/
GET /api/v1/doctors/{doctorId}/
GET /api/v1/doctors/{doctorId}/available-slots/?date=YYYY-MM-DD
GET /api/v1/specializations/
```

Possible filters:

```text
?search=
?specialization=
?max_fee=
?min_experience=
```

Only APPROVED doctors are publicly returned.

## Appointments

```text
GET  /api/v1/appointments/
POST /api/v1/appointments/
GET  /api/v1/appointments/{appointmentId}/
POST /api/v1/appointments/{appointmentId}/cancel/
POST /api/v1/appointments/{appointmentId}/reschedule/
```

The server validates doctor approval, availability, time-off and conflicts. It calculates end time and consultation fee server-side and books atomically.

## Medical Records

```text
GET    /api/v1/medical-records/
POST   /api/v1/medical-records/
GET    /api/v1/medical-records/{recordId}/
PATCH  /api/v1/medical-records/{recordId}/
DELETE /api/v1/medical-records/{recordId}/
```

## Prescriptions

Patient read-only:

```text
GET /api/v1/prescriptions/
GET /api/v1/prescriptions/{prescriptionId}/
```

## Payments

```text
POST /api/v1/payments/create-order/
POST /api/v1/payments/verify/
GET  /api/v1/payments/
GET  /api/v1/payments/{paymentId}/
```

## Invoices

```text
GET /api/v1/invoices/
GET /api/v1/invoices/{invoiceId}/
GET /api/v1/invoices/{invoiceId}/download/
```

# Doctor APIs

## Dashboard

```text
GET /api/v1/doctor/dashboard/
```

Return today's/upcoming/pending appointments, completed consultations, total patients and current-month earnings.

## Profile

```text
GET   /api/v1/doctor/me/
PATCH /api/v1/doctor/me/
```

## Availability

```text
GET    /api/v1/doctor/availability/
POST   /api/v1/doctor/availability/
PATCH  /api/v1/doctor/availability/{availabilityId}/
DELETE /api/v1/doctor/availability/{availabilityId}/
```

## Time Off

```text
GET    /api/v1/doctor/time-off/
POST   /api/v1/doctor/time-off/
DELETE /api/v1/doctor/time-off/{timeOffId}/
```

## Appointments

```text
GET /api/v1/doctor/appointments/
GET /api/v1/doctor/appointments/{appointmentId}/

POST /api/v1/doctor/appointments/{appointmentId}/accept/
POST /api/v1/doctor/appointments/{appointmentId}/reject/
POST /api/v1/doctor/appointments/{appointmentId}/complete/
```

Filters:

```text
?status=PENDING
?status=CONFIRMED
?scope=today
?scope=upcoming
?scope=completed
```

## Patients

```text
GET /api/v1/doctor/patients/
GET /api/v1/doctor/patients/{patientId}/
```

Doctors may only access patients they are authorized to treat/have treated.

## Prescriptions

```text
GET   /api/v1/doctor/prescriptions/
POST  /api/v1/doctor/prescriptions/
GET   /api/v1/doctor/prescriptions/{prescriptionId}/
PATCH /api/v1/doctor/prescriptions/{prescriptionId}/
```

Example creation:

```json
{
  "appointment_id": 54,
  "diagnosis": "Viral fever",
  "general_instructions": "Rest and maintain hydration.",
  "follow_up_date": "2026-10-15",
  "items": [
    {
      "medicine_name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "3 days",
      "route": "Oral",
      "instructions": "After food"
    }
  ]
}
```

Patient and doctor are derived from the appointment server-side.

## Earnings

```text
GET /api/v1/doctor/earnings/
```

# Consultation APIs

Shared by patient and doctor:

```text
POST /api/v1/consultations/{appointmentId}/prepare/
GET  /api/v1/consultations/{appointmentId}/
POST /api/v1/consultations/{appointmentId}/start/
POST /api/v1/consultations/{appointmentId}/end/
```

Before returning/joining a room, verify:
- authenticated user;
- assigned appointment participant;
- valid appointment state;
- allowed consultation time.

# WebSocket

Development:

```text
ws://localhost:8000/ws/consultations/{appointmentId}/
```

Production:

```text
wss://<backend-domain>/ws/consultations/{appointmentId}/
```

Supported events:

```text
join_room
offer
answer
ice_candidate
leave_room
end_call
chat_message
```

Django Channels handles signaling/control messages. WebRTC carries media.

# Admin APIs

## Dashboard

```text
GET /api/v1/admin/dashboard/
```

Statistics:
- total patients
- total doctors
- pending/approved doctors
- total appointments
- completed appointments
- successful payments
- revenue

## Users

```text
GET  /api/v1/admin/users/
GET  /api/v1/admin/users/{userId}/
POST /api/v1/admin/users/{userId}/activate/
POST /api/v1/admin/users/{userId}/deactivate/
```

## Patients

```text
GET /api/v1/admin/patients/
GET /api/v1/admin/patients/{patientId}/
```

## Doctors

```text
GET /api/v1/admin/doctors/
GET /api/v1/admin/doctors/{doctorId}/

POST /api/v1/admin/doctors/{doctorId}/approve/
POST /api/v1/admin/doctors/{doctorId}/reject/
POST /api/v1/admin/doctors/{doctorId}/suspend/
```

Filters:

```text
?status=PENDING
?status=APPROVED
?status=REJECTED
?status=SUSPENDED
```

## Appointments

```text
GET /api/v1/admin/appointments/
GET /api/v1/admin/appointments/{appointmentId}/
```

## Payments

```text
GET /api/v1/admin/payments/
GET /api/v1/admin/payments/{paymentId}/
```

Filters:

```text
?status=SUCCESS
?status=PENDING
?status=FAILED
?status=REFUNDED
```

## Invoices

```text
GET /api/v1/admin/invoices/
GET /api/v1/admin/invoices/{invoiceId}/
```

## Specializations

```text
GET    /api/v1/admin/specializations/
POST   /api/v1/admin/specializations/
PATCH  /api/v1/admin/specializations/{specializationId}/
DELETE /api/v1/admin/specializations/{specializationId}/
```

Prefer deactivating referenced specializations rather than destructive deletion.

## Reports

```text
GET /api/v1/admin/reports/appointments/
GET /api/v1/admin/reports/revenue/
GET /api/v1/admin/reports/doctors/
```

# API Route Tree

```text
/api/v1/
├── auth/
├── patients/
├── doctors/
├── appointments/
├── consultations/
├── prescriptions/
├── medical-records/
├── payments/
├── invoices/
├── patient/
│   └── dashboard/
├── doctor/
│   ├── dashboard/
│   ├── appointments/
│   ├── availability/
│   ├── time-off/
│   ├── patients/
│   ├── prescriptions/
│   └── earnings/
└── admin/
    ├── dashboard/
    ├── users/
    ├── patients/
    ├── doctors/
    ├── appointments/
    ├── payments/
    ├── invoices/
    ├── specializations/
    └── reports/
```
