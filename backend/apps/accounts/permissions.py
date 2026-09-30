from rest_framework.permissions import BasePermission


class IsPatient(BasePermission):
    """Allow access only to users with the 'patient' role."""
    message = "Access restricted to patients only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'patient'
        )


class IsDoctor(BasePermission):
    """Allow access only to users with the 'doctor' role."""
    message = "Access restricted to doctors only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'doctor'
        )


class IsAdminRole(BasePermission):
    """Allow access only to users with the 'admin' role."""
    message = "Access restricted to administrators only."

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
        )


class IsPatientOrDoctor(BasePermission):
    """Allow access to patients or doctors (e.g. consultation views)."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('patient', 'doctor')
        )
