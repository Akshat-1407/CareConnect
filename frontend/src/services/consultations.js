import { apiClient } from "./api";

/**
 * Fetch consultation details, eligibility, participant info, and ICE servers.
 * @param {number|string} appointmentId
 */
export async function getConsultationDetails(appointmentId) {
  return apiClient(`/consultations/${appointmentId}/`);
}

/**
 * Mark consultation ended on the backend.
 * @param {number|string} appointmentId
 */
export async function endConsultation(appointmentId) {
  return apiClient(`/consultations/${appointmentId}/end/`, {
    method: "POST",
  });
}
