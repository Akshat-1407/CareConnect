import { apiClient } from "./api";

/**
 * Verify Razorpay payment signature and confirm appointment.
 * @param {Object} paymentData - { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export async function verifyPayment(paymentData) {
  return apiClient("/payments/verify/", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
}

/**
 * Fetch patient's payment transaction history.
 */
export async function getPaymentsHistory() {
  return apiClient("/payments/");
}

/**
 * Fetch payment details by ID.
 * @param {number|string} id
 */
export async function getPaymentById(id) {
  return apiClient(`/payments/${id}/`);
}
