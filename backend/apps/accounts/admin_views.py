from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.db.models import Sum, Count
from django.contrib.auth import get_user_model

from apps.accounts.permissions import IsAdminRole
from apps.doctors.models import DoctorProfile
from apps.appointments.models import Appointment
from apps.payments.models import Payment

User = get_user_model()


class AdminStatsView(APIView):
    """
    GET /api/v1/admin/stats/
    High-level platform statistics for the admin dashboard.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        total_patients = User.objects.filter(role='patient').count()
        total_doctors = DoctorProfile.objects.count()
        total_appointments = Appointment.objects.count()
        confirmed_appointments = Appointment.objects.filter(status=Appointment.Status.CONFIRMED).count()
        completed_appointments = Appointment.objects.filter(status=Appointment.Status.COMPLETED).count()

        successful_payments = Payment.objects.filter(status=Payment.Status.SUCCESS)
        total_payments_count = successful_payments.count()
        total_revenue = successful_payments.aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            'total_patients': total_patients,
            'total_doctors': total_doctors,
            'total_appointments': total_appointments,
            'confirmed_appointments': confirmed_appointments,
            'completed_appointments': completed_appointments,
            'total_payments': total_payments_count,
            'total_revenue': float(total_revenue),
        }, status=status.HTTP_200_OK)


class AdminUserListView(APIView):
    """
    GET /api/v1/admin/users/
    List users on the platform with optional role filtering.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        role_filter = request.query_params.get('role')
        search_query = request.query_params.get('search')

        qs = User.objects.all().order_by('-date_joined')
        if role_filter:
            qs = qs.filter(role=role_filter)
        if search_query:
            qs = qs.filter(username__icontains=search_query) | qs.filter(email__icontains=search_query)

        data = [
            {
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'first_name': u.first_name,
                'last_name': u.last_name,
                'role': u.role,
                'is_active': u.is_active,
                'date_joined': u.date_joined.isoformat() if u.date_joined else None,
            }
            for u in qs
        ]
        return Response(data, status=status.HTTP_200_OK)


class AdminDoctorListView(APIView):
    """
    GET /api/v1/admin/doctors/
    List all doctors and their profile metadata.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        doctors = DoctorProfile.objects.select_related('user').annotate(
            slots_count=Count('availability_slots', distinct=True),
            appointments_count=Count('doctor_appointments', distinct=True)
        ).order_by('-user__date_joined')

        data = [
            {
                'id': d.id,
                'user_id': d.user.id,
                'username': d.user.username,
                'email': d.user.email,
                'name': f"Dr. {d.user.get_full_name() or d.user.username}",
                'first_name': d.user.first_name,
                'last_name': d.user.last_name,
                'specialization': d.specialization,
                'consultation_fee': str(d.consultation_fee),
                'bio': d.bio,
                'is_active': d.user.is_active,
                'slots_count': d.slots_count,
                'appointments_count': d.appointments_count,
                'date_joined': d.user.date_joined.isoformat() if d.user.date_joined else None,
            }
            for d in doctors
        ]
        return Response(data, status=status.HTTP_200_OK)


class AdminDoctorCreateView(APIView):
    """
    POST /api/v1/admin/doctors/create/
    Create a new doctor user account and DoctorProfile.
    """
    permission_classes = [IsAdminRole]

    def post(self, request):
        data = request.data
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        specialization = data.get('specialization', '').strip()
        consultation_fee = data.get('consultation_fee')
        bio = data.get('bio', '').strip()

        # Validation
        errors = {}
        if not username:
            errors['username'] = ['Username is required.']
        elif User.objects.filter(username=username).exists():
            errors['username'] = ['A user with this username already exists.']

        if not email:
            errors['email'] = ['Email is required.']
        elif User.objects.filter(email=email).exists():
            errors['email'] = ['A user with this email already exists.']

        if not password or len(password) < 6:
            errors['password'] = ['Password must be at least 6 characters long.']

        if not specialization:
            errors['specialization'] = ['Specialization is required.']

        if not consultation_fee:
            errors['consultation_fee'] = ['Consultation fee is required.']
        else:
            try:
                fee_val = float(consultation_fee)
                if fee_val <= 0:
                    errors['consultation_fee'] = ['Consultation fee must be greater than 0.']
            except (ValueError, TypeError):
                errors['consultation_fee'] = ['Consultation fee must be a valid number.']

        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user = User(
                username=username,
                email=email,
                role='doctor',
                first_name=first_name,
                last_name=last_name
            )
            user.set_password(password)
            user.save()

            doctor = DoctorProfile.objects.create(
                user=user,
                specialization=specialization,
                consultation_fee=consultation_fee,
                bio=bio
            )

        return Response({
            'message': 'Doctor account created successfully.',
            'doctor': {
                'id': doctor.id,
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'name': f"Dr. {user.get_full_name() or user.username}",
                'specialization': doctor.specialization,
                'consultation_fee': str(doctor.consultation_fee),
                'bio': doctor.bio,
            }
        }, status=status.HTTP_201_CREATED)


class AdminAppointmentListView(APIView):
    """
    GET /api/v1/admin/appointments/
    List all appointments across all patients and doctors.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        status_filter = request.query_params.get('status')
        qs = Appointment.objects.select_related(
            'patient',
            'doctor',
            'doctor__user',
            'slot'
        ).order_by('-created_at')

        if status_filter:
            qs = qs.filter(status=status_filter)

        data = [
            {
                'id': a.id,
                'patient': {
                    'id': a.patient.id,
                    'name': a.patient.get_full_name() or a.patient.username,
                    'email': a.patient.email,
                },
                'doctor': {
                    'id': a.doctor.id,
                    'name': f"Dr. {a.doctor.user.get_full_name() or a.doctor.user.username}",
                    'specialization': a.doctor.specialization,
                },
                'slot': {
                    'date': str(a.slot.date) if a.slot else None,
                    'start_time': str(a.slot.start_time) if a.slot else None,
                    'end_time': str(a.slot.end_time) if a.slot else None,
                } if a.slot else None,
                'amount': str(a.amount),
                'status': a.status,
                'notes': a.notes,
                'created_at': a.created_at.isoformat() if a.created_at else None,
            }
            for a in qs
        ]
        return Response(data, status=status.HTTP_200_OK)


class AdminPaymentListView(APIView):
    """
    GET /api/v1/admin/payments/
    List all payments recorded on the platform.
    """
    permission_classes = [IsAdminRole]

    def get(self, request):
        status_filter = request.query_params.get('status')
        qs = Payment.objects.select_related(
            'appointment',
            'appointment__patient',
            'appointment__doctor',
            'appointment__doctor__user'
        ).order_by('-created_at')

        if status_filter:
            qs = qs.filter(status=status_filter)

        data = [
            {
                'id': p.id,
                'appointment_id': p.appointment_id,
                'patient': {
                    'id': p.appointment.patient.id if p.appointment else None,
                    'name': (p.appointment.patient.get_full_name() or p.appointment.patient.username) if p.appointment else "N/A",
                    'email': p.appointment.patient.email if p.appointment else "",
                },
                'doctor': {
                    'name': f"Dr. {p.appointment.doctor.user.get_full_name() or p.appointment.doctor.user.username}" if (p.appointment and p.appointment.doctor) else "N/A"
                },
                'amount': str(p.amount),
                'currency': p.currency,
                'status': p.status,
                'razorpay_order_id': p.razorpay_order_id,
                'razorpay_payment_id': p.razorpay_payment_id,
                'created_at': p.created_at.isoformat() if p.created_at else None,
            }
            for p in qs
        ]
        return Response(data, status=status.HTTP_200_OK)
