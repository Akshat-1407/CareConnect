# CareConnect360 — Frontend Routes

Next.js App Router using JavaScript/JSX.

# Public & Authentication

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Patient registration |
| `/doctor-register` | Doctor registration |
| `/forgot-password` | Forgot password |
| `/reset-password/[token]` | Reset password |
| `/doctors` | Public approved-doctor listing |
| `/doctors/[doctorId]` | Public doctor profile |

Login redirects:

```text
PATIENT → /patient/dashboard
DOCTOR  → /doctor/dashboard
ADMIN   → /admin/dashboard
```

# Patient

| Route | Purpose |
|---|---|
| `/patient/dashboard` | Dashboard |
| `/patient/profile` | Profile |
| `/patient/doctors` | Find doctors |
| `/patient/doctors/[doctorId]` | Doctor details |
| `/patient/book/[doctorId]` | Book appointment |
| `/patient/appointments` | My appointments |
| `/patient/appointments/[appointmentId]` | Appointment detail |
| `/patient/consultation/[appointmentId]` | WebRTC consultation |
| `/patient/prescriptions` | Prescriptions |
| `/patient/prescriptions/[prescriptionId]` | Prescription detail |
| `/patient/medical-records` | Medical records |
| `/patient/medical-records/upload` | Upload record |
| `/patient/payments` | Payment history |
| `/patient/invoices` | Invoices |
| `/patient/invoices/[invoiceId]` | Invoice detail |
| `/patient/settings` | Settings |

## Patient Dashboard

Show:
- upcoming appointments
- recent prescriptions
- recent payments
- recent medical records
- quick doctor search
- Book Appointment CTA

## Booking Flow

```text
Find Doctor
→ Doctor Profile
→ Select Date
→ Fetch Available Slots
→ Select Slot
→ Enter Reason
→ Create Appointment
→ Make Payment
→ Confirmation
```

## Consultation Page

Components:
- local video
- remote video
- microphone toggle
- camera toggle
- call state
- end call
- optional consultation chat
- doctor/appointment information

Flow:

```text
Validate appointment
→ prepare room
→ connect signaling WebSocket
→ getUserMedia()
→ RTCPeerConnection
→ exchange SDP offer/answer
→ exchange ICE candidates
→ WebRTC media connection
→ cleanup on end/unmount
```

# Doctor

| Route | Purpose |
|---|---|
| `/doctor/dashboard` | Dashboard |
| `/doctor/profile` | Doctor profile |
| `/doctor/availability` | Availability/time-off |
| `/doctor/appointments` | Appointments |
| `/doctor/appointments/[appointmentId]` | Appointment detail |
| `/doctor/consultation/[appointmentId]` | WebRTC consultation |
| `/doctor/patients` | Patients treated/scheduled |
| `/doctor/patients/[patientId]` | Authorized patient detail |
| `/doctor/prescriptions` | Prescription history |
| `/doctor/prescriptions/create/[appointmentId]` | Write prescription |
| `/doctor/prescriptions/[prescriptionId]` | Prescription detail/edit |
| `/doctor/earnings` | Earnings |
| `/doctor/settings` | Settings |

## Doctor Dashboard

Show:
- today's appointments
- upcoming appointments
- pending appointments
- completed consultations
- total patients
- current-month earnings

## Prescription Form

```text
Diagnosis
General instructions
Follow-up date

Medication rows:
- medicine name
- dosage
- frequency
- duration
- route
- instructions
```

# Admin

| Route | Purpose |
|---|---|
| `/admin/dashboard` | Platform dashboard |
| `/admin/users` | Users |
| `/admin/patients` | Patients |
| `/admin/patients/[patientId]` | Patient details |
| `/admin/doctors` | Doctors |
| `/admin/doctors/[doctorId]` | Doctor verification/details |
| `/admin/appointments` | All appointments |
| `/admin/appointments/[appointmentId]` | Appointment detail |
| `/admin/payments` | Transactions |
| `/admin/invoices` | Invoices |
| `/admin/specializations` | Manage specialties |
| `/admin/reports` | Reports |

## Admin Responsibilities

- approve/reject/suspend doctors
- activate/deactivate users
- view patient accounts
- oversee appointments
- monitor payments/invoices
- manage specializations
- view operational reports

Admin should not diagnose patients, prescribe medication or conduct consultations.

# Frontend Access Rules

```text
/patient/* → PATIENT only
/doctor/*  → DOCTOR only
/admin/*   → ADMIN only
```

Frontend guards improve UX, but Django must enforce authorization independently.
