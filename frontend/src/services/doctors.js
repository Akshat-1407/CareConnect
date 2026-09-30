import { apiClient } from "./api";

/**
 * Fetch all available doctors with optional search query and specialization filter.
 * @param {Object} params - { search, specialization }
 */
export async function getDoctors(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append("search", params.search);
  if (params.specialization) query.append("specialization", params.specialization);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient(`/doctors/${qs}`);
}

/**
 * Fetch details of a single doctor by ID.
 * @param {number|string} id
 */
export async function getDoctorById(id) {
  return apiClient(`/doctors/${id}/`);
}

/**
 * Fetch unbooked future appointment slots for a specific doctor.
 * @param {number|string} doctorId
 * @param {Object} params - { date }
 */
export async function getDoctorSlots(doctorId, params = {}) {
  const query = new URLSearchParams();
  if (params.date) query.append("date", params.date);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient(`/doctors/${doctorId}/slots/${qs}`);
}

/**
 * Doctor-only: Fetch the authenticated doctor's availability slots.
 * @param {Object} params - { upcoming, date }
 */
export async function getDoctorAvailability(params = {}) {
  const query = new URLSearchParams();
  if (params.upcoming !== undefined) query.append("upcoming", params.upcoming);
  if (params.date) query.append("date", params.date);

  const qs = query.toString() ? `?${query.toString()}` : "";
  return apiClient(`/doctor/availability/${qs}`);
}

/**
 * Doctor-only: Add a new future appointment slot.
 * @param {Object} slotData - { date: 'YYYY-MM-DD', start_time: 'HH:MM:SS', end_time: 'HH:MM:SS' }
 */
export async function createAvailabilitySlot(slotData) {
  return apiClient("/doctor/availability/", {
    method: "POST",
    body: JSON.stringify(slotData),
  });
}

/**
 * Doctor-only: Remove an unbooked future appointment slot.
 * @param {number|string} slotId
 */
export async function deleteAvailabilitySlot(slotId) {
  return apiClient(`/doctor/availability/${slotId}/`, {
    method: "DELETE",
  });
}
