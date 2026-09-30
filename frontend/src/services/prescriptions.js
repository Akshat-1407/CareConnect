import { apiClient } from "./api";

/**
 * Fetch prescriptions for the authenticated user (patient or doctor).
 */
export async function getPrescriptions() {
  return apiClient("/prescriptions/");
}

/**
 * Fetch prescription details by ID.
 * @param {number|string} id
 */
export async function getPrescriptionDetail(id) {
  return apiClient(`/prescriptions/${id}/`);
}

/**
 * Fetch prescription for a specific appointment ID.
 * @param {number|string} appointmentId
 */
export async function getAppointmentPrescription(appointmentId) {
  return apiClient(`/prescriptions/appointment/${appointmentId}/`);
}

/**
 * Doctor issues a prescription for an appointment.
 * @param {Object} data - { appointment_id, diagnosis, instructions, medications: [...] }
 */
export async function createPrescription(data) {
  return apiClient("/prescriptions/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
