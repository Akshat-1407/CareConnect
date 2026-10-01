# CareConnect360 - VirtualCare Telemedicine Platform

CareConnect360 is a comprehensive, modern telemedicine MVP designed to facilitate seamless virtual healthcare. It allows patients to discover verified doctors, book appointments, complete secure payments, and conduct real-time video consultations directly within the platform.

## 🚀 Key Features

### For Patients
- **Discover Doctors:** Browse and search for verified medical specialists.
- **Secure Booking:** Schedule appointments and securely pay consultation fees via Razorpay.
- **Virtual Consultations:** Join confirmed WebRTC-based high-quality video calls directly from the browser.
- **Digital Prescriptions:** Access post-consultation medical notes and digital prescriptions.
- **Patient Dashboard:** A cohesive portal to manage upcoming appointments and medical history.

### For Doctors
- **Schedule Management:** Easily define available time slots for patient bookings.
- **Consultation Hub:** View assigned appointments and prepare for upcoming patient visits.
- **Telehealth Video:** Conduct secure video consultations with patients in real-time.
- **Prescription Issuance:** Write and issue digital prescriptions securely post-consultation.

### For Administrators
- **Platform Management:** Secure internal portal to oversee users, doctors, and platform health.
- **Provider Provisioning:** Create and manage verified doctor accounts (doctors cannot self-register).
- **Financial Oversight:** View high-level transaction and payment statuses.

---

## 🛠️ Technology Stack

**Frontend:**
- [Next.js](https://nextjs.org/) (App Router)
- React.js
- Tailwind CSS (v4) with fully responsive Light & Dark Mode
- shadcn/ui (Accessible component primitives)
- WebRTC (Native browser APIs for Video/Audio)
- Lucide React (Icons)

**Backend:**
- [Django](https://www.djangoproject.com/) & Django REST Framework (DRF)
- Django Channels (WebSockets for WebRTC signaling)
- MySQL (Relational Database)
- JWT Authentication (`djangorestframework-simplejwt` via HttpOnly Cookies)
- Razorpay API (Payment Gateway Integration)

---

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
- **Node.js** (v18.0 or newer)
- **Python** (3.10 or newer)
- **MySQL Server** (running locally or remotely)
- **Razorpay Account** (for test mode API keys)

---

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CareConnect360.git
cd CareConnect
```

### 2. Backend Setup (Django)
Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate   
pip install -r requirements.txt
```

Set up your backend environment variables:
```bash
cp .env.example .env
```
Edit `.env` and configure your MySQL credentials, Django Secret Key, and Razorpay Keys.

Run migrations and start the server:
```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (Next.js)
Open a new terminal, navigate to the frontend directory:
```bash
cd frontend
npm install
```

Set up your frontend environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` to include `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api/v1`) and your public Razorpay Key ID.

---

## ▶️ Running the Application

To run the full CareConnect360 platform locally, you will need two separate terminal windows.

### Terminal 1: Start the Django Backend
Navigate to the `backend` directory, activate your virtual environment, and start the server. This runs on port `8000` by default.
```bash
cd backend
.\.venv\Scripts\activate   
python -m daphne -b 127.0.0.1 -p 8000 config.asgi:application
```

### Terminal 2: Start the Next.js Frontend
Navigate to the `frontend` directory and start the development server. This runs on port `3000` by default.
```bash
cd frontend
npm run dev
```

### Additional Helpful Commands

**Frontend:**
- **Lint the code:** `npm run lint`
- **Create a production build:** `npm run build`
- **Start the production build:** `npm start`

**Backend:**
- **Create database migrations:** `python manage.py makemigrations`
- **Apply database migrations:** `python manage.py migrate`
- **Create a superuser (Admin):** `python manage.py createsuperuser`

---

## 🏗️ Architecture & Security Highlights

- **Stateless & Secure Auth:** Utilizes JSON Web Tokens (JWT) stored exclusively in `HttpOnly` cookies to prevent XSS attacks.
- **Direct Peer-to-Peer Video:** Video streams are strictly Peer-to-Peer (P2P) via WebRTC. Django Channels is only used as a transient signaling server.
- **Server-Side Payments:** Payment verification is rigorously handled by Django. Webhooks and signature validations strictly dictate appointment statuses.
- **Role-Based Access Control (RBAC):** Distinct routing and layout paradigms for Patients, Doctors, and System Admins.

---

## 📂 Project Structure

```text
CareConnect360/
├── backend/                  # Django REST & Channels backend
│   ├── apps/                 # Django apps (accounts, doctors, appointments, etc.)
│   ├── config/               # Main Django settings & ASGI/WSGI config
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # Next.js App Router frontend
│   ├── src/
│   │   ├── app/              # Next.js page routing (admin, doctor, patient)
│   │   ├── components/       # Reusable UI components & shadcn primitives
│   │   ├── context/          # Auth context providers
│   │   ├── hooks/            # Custom hooks (e.g., useWebRTC)
│   │   └── services/         # API integration logic
│   ├── package.json
│   └── tailwind.config.js
├── README.md                 # Agentic architecture specification
└── documentation.md          # Project documentation (this file)
```
