# CareConnect360 — Roles & Permissions

# Roles

```text
PATIENT
DOCTOR
ADMIN
```

# Patient

Can:
- manage own profile;
- browse approved doctors;
- view doctor availability;
- book/reschedule/cancel own appointments;
- pay for own appointments;
- join own consultations;
- view own prescriptions;
- manage own permitted medical records;
- view own payments/invoices.

Cannot:
- approve doctors;
- view other patients' private data;
- create prescriptions;
- access admin APIs;
- access doctor-only APIs.

# Doctor

Can:
- manage own doctor profile;
- manage availability/time-off;
- view assigned appointments;
- accept/reject appointments;
- join assigned consultations;
- view appropriately authorized patient information;
- create/update prescriptions for assigned appointments;
- view own earnings.

Doctor must be `APPROVED` before becoming publicly bookable.

Cannot:
- approve themselves;
- access unrelated patients;
- manage other doctors;
- access admin-only platform management.

# Admin

Can:
- view platform dashboard;
- manage user activation;
- view patients for administrative purposes;
- review doctor applications;
- approve/reject/suspend doctors;
- oversee appointments;
- monitor payments/invoices;
- manage specializations;
- view reports.

Admin should not:
- diagnose patients;
- write prescriptions;
- act as the treating doctor;
- casually alter clinical history.

# Django Permissions

Recommended reusable permission classes:

```text
IsPatient
IsDoctor
IsAdminRole
IsApprovedDoctor
IsAppointmentPatient
IsAppointmentDoctor
IsAppointmentParticipant
```

Example rule:

If a PATIENT manually calls:

```text
POST /api/v1/admin/doctors/15/approve/
```

Django returns:

```text
403 Forbidden
```

Never depend only on Next.js route guards.

# Doctor Approval Flow

```text
Doctor Registration
        ↓
role = DOCTOR
verification = PENDING
        ↓
Admin Review
    ┌───┴────┐
    ↓        ↓
APPROVE    REJECT
    ↓
APPROVED
    ↓
Public Doctor Search
    ↓
Patient Booking
```

# Frontend Route Guards

```text
/patient/* → PATIENT
/doctor/*  → DOCTOR
/admin/*   → ADMIN
```

On login:

```text
PATIENT → /patient/dashboard
DOCTOR  → /doctor/dashboard
ADMIN   → /admin/dashboard
```
