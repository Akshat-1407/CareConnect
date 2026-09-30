import { apiClient } from "./api";

/**
 * Book an appointment slot.
 * Creates a PENDING_PAYMENT appointment and Razorpay order.
 * @param {Object} data - { slot_id, notes }
 */
export async function bookAppointment(data) {
  return apiClient("/appointments/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Fetch patient's appointments with optional status filter.
 * @param {Object} params - { status }
 */
export async function getPatientAppointments(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient(`/appointments/${qs}`);
}

/**
 * Fetch a single appointment by ID.
 * @param {number|string} id
 */
export async function getAppointmentById(id) {
  return apiClient(`/appointments/${id}/`);
}

/**
 * Cancel an appointment.
 * @param {number|string} id
 */
export async function cancelAppointment(id) {
  return apiClient(`/appointments/${id}/cancel/`, {
    method: "POST",
  });
}

/**
 * Doctor-only: Fetch assigned appointments.
 * @param {Object} params - { status }
 */
export async function getDoctorAppointments(params = {}) {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient(`/doctor/appointments/${qs}`);
}
