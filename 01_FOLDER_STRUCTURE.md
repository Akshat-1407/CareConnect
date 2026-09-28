# CareConnect360 — Complete Folder Structure

## Technology Stack

```text
Frontend
├── Next.js App Router
├── JavaScript / JSX
├── Tailwind CSS
└── WebRTC Browser APIs

Backend
├── Python
├── Django
├── Django REST Framework
├── Django Channels
└── WebSockets

Database
└── MySQL

Real-Time Infrastructure
├── WebRTC    → video/audio
├── WebSocket → signaling

Payment
└── Razorpay

Roles
├── PATIENT
├── DOCTOR
└── ADMIN
```

No Docker is used. There is no notification feature/module.

---

# Root

```text
CareConnect360/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

---

# Frontend

```text
frontend/
├── public/
│   ├── images/
│   │   ├── doctors/
│   │   └── placeholders/
│   ├── icons/
│   └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx
│   │   │   ├── register/page.jsx
│   │   │   ├── doctor-register/page.jsx
│   │   │   ├── forgot-password/page.jsx
│   │   │   └── reset-password/[token]/page.jsx
│   │   │
│   │   ├── doctors/
│   │   │   ├── page.jsx
│   │   │   └── [doctorId]/page.jsx
│   │   │
│   │   ├── patient/
│   │   │   ├── layout.jsx
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── profile/page.jsx
│   │   │   ├── doctors/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [doctorId]/page.jsx
│   │   │   ├── book/[doctorId]/page.jsx
│   │   │   ├── appointments/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [appointmentId]/page.jsx
│   │   │   ├── consultation/[appointmentId]/page.jsx
│   │   │   ├── prescriptions/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [prescriptionId]/page.jsx
│   │   │   ├── medical-records/
│   │   │   │   ├── page.jsx
│   │   │   │   └── upload/page.jsx
│   │   │   ├── payments/page.jsx
│   │   │   ├── invoices/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [invoiceId]/page.jsx
│   │   │   └── settings/page.jsx
│   │   │
│   │   ├── doctor/
│   │   │   ├── layout.jsx
│   │   │   ├── dashboard/page.jsx
│   │   │   ├── profile/page.jsx
│   │   │   ├── availability/page.jsx
│   │   │   ├── appointments/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [appointmentId]/page.jsx
│   │   │   ├── consultation/[appointmentId]/page.jsx
│   │   │   ├── patients/
│   │   │   │   ├── page.jsx
│   │   │   │   └── [patientId]/page.jsx
│   │   │   ├── prescriptions/
│   │   │   │   ├── page.jsx
│   │   │   │   ├── [prescriptionId]/page.jsx
│   │   │   │   └── create/[appointmentId]/page.jsx
│   │   │   ├── earnings/page.jsx
│   │   │   └── settings/page.jsx
│   │   │
│   │   └── admin/
│   │       ├── layout.jsx
│   │       ├── dashboard/page.jsx
│   │       ├── users/page.jsx
│   │       ├── patients/
│   │       │   ├── page.jsx
│   │       │   └── [patientId]/page.jsx
│   │       ├── doctors/
│   │       │   ├── page.jsx
│   │       │   └── [doctorId]/page.jsx
│   │       ├── appointments/
│   │       │   ├── page.jsx
│   │       │   └── [appointmentId]/page.jsx
│   │       ├── payments/page.jsx
│   │       ├── invoices/page.jsx
│   │       ├── specializations/page.jsx
│   │       └── reports/page.jsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Badge.jsx
│   │   │   └── Loader.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PatientSidebar.jsx
│   │   │   ├── DoctorSidebar.jsx
│   │   │   └── AdminSidebar.jsx
│   │   ├── doctors/
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── DoctorFilters.jsx
│   │   │   ├── DoctorProfile.jsx
│   │   │   └── AvailabilityCalendar.jsx
│   │   ├── appointments/
│   │   │   ├── AppointmentCard.jsx
│   │   │   ├── AppointmentTable.jsx
│   │   │   ├── AppointmentStatus.jsx
│   │   │   └── BookingForm.jsx
│   │   ├── consultation/
│   │   │   ├── VideoCall.jsx
│   │   │   ├── VideoControls.jsx
│   │   │   ├── VideoParticipant.jsx
│   │   │   ├── CallStatus.jsx
│   │   │   └── ConsultationChat.jsx
│   │   ├── prescriptions/
│   │   │   ├── PrescriptionForm.jsx
│   │   │   ├── PrescriptionView.jsx
│   │   │   └── MedicationRow.jsx
│   │   ├── payments/
│   │   │   ├── PaymentButton.jsx
│   │   │   ├── PaymentHistory.jsx
│   │   │   └── InvoiceCard.jsx
│   │   └── dashboard/
│   │       ├── StatCard.jsx
│   │       └── DashboardHeader.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useWebRTC.js
│   │   └── useWebSocket.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── patientService.js
│   │   ├── doctorService.js
│   │   ├── appointmentService.js
│   │   ├── consultationService.js
│   │   ├── prescriptionService.js
│   │   ├── paymentService.js
│   │   └── adminService.js
│   ├── lib/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── permissions.js
│   │   ├── webrtc.js
│   │   └── websocket.js
│   └── utils/
│       ├── formatDate.js
│       ├── formatCurrency.js
│       └── constants.js
│
├── .env.local
├── jsconfig.json
├── next.config.mjs
├── package.json
└── postcss.config.mjs
```

---

# Backend

Organize Django by business domain rather than duplicating applications for each role.

```text
backend/
├── manage.py
├── requirements.txt
├── .env
│
├── config/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── apps/
│   ├── accounts/
│   │   ├── migrations/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── permissions.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── patients/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── tests.py
│   │
│   ├── doctors/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── services.py
│   │   └── tests.py
│   │
│   ├── appointments/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── services.py
│   │   └── tests.py
│   │
│   ├── consultations/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── consumers.py
│   │   ├── routing.py
│   │   ├── services.py
│   │   └── tests.py
│   │
│   ├── prescriptions/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   └── tests.py
│   │
│   ├── medical_records/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests.py
│   │
│   ├── payments/
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py
│   │   └── tests.py
│   │
│   └── dashboard/
│       ├── views.py
│       ├── urls.py
│       └── services.py
│
├── media/
│   ├── medical_records/
│   └── doctor_profiles/
└── static/
```
