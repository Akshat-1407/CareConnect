import { apiClient } from "./api";

/**
 * Fetch platform stats for admin dashboard.
 */
export async function getAdminStats() {
  return apiClient("/admin/stats/");
}

/**
 * Fetch all users with optional role or search query.
 */
export async function getAdminUsers(params = {}) {
  const query = new URLSearchParams();
  if (params.role) query.append("role", params.role);
  if (params.search) query.append("search", params.search);
  const qs = query.toString();
  return apiClient(`/admin/users/${qs ? `?${qs}` : ""}`);
}

/**
 * Fetch all registered doctors with slot and appointment counts.
 */
export async function getAdminDoctors() {
  return apiClient("/admin/doctors/");
}

/**
 * Admin creates a new doctor account and profile.
 */
export async function createDoctor(doctorData) {
  return apiClient("/admin/doctors/create/", {
    method: "POST",
    body: JSON.stringify(doctorData),
  });
}

/**
 * Fetch all system appointments with optional status filter.
 */
export async function getAdminAppointments(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  const qs = query.toString();
  return apiClient(`/admin/appointments/${qs ? `?${qs}` : ""}`);
}

/**
 * Fetch all system payments with optional status filter.
 */
export async function getAdminPayments(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  const qs = query.toString();
  return apiClient(`/admin/payments/${qs ? `?${qs}` : ""}`);
}

/**
 * Admin deletes a user account (patient/doctor/admin).
 */
export async function deleteAdminUser(userId) {
  return apiClient(`/admin/users/${userId}/`, {
    method: "DELETE",
  });
}

/**
 * Admin deletes a doctor profile and user account.
 */
export async function deleteAdminDoctor(doctorId) {
  return apiClient(`/admin/doctors/${doctorId}/`, {
    method: "DELETE",
  });
}

/**
 * Admin deletes an appointment.
 */
export async function deleteAdminAppointment(appointmentId) {
  return apiClient(`/admin/appointments/${appointmentId}/`, {
    method: "DELETE",
  });
}

/**
 * Admin deletes a payment record.
 */
export async function deleteAdminPayment(paymentId) {
  return apiClient(`/admin/payments/${paymentId}/`, {
    method: "DELETE",
  });
}
