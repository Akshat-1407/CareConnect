/**
 * Dynamically loads the Razorpay checkout script if not already present.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Triggers the official Razorpay checkout popup.
 * Returns true if official modal was opened, false if fallback modal should be displayed.
 *
 * @param {Object} options
 * @param {string} options.orderId - Razorpay order ID
 * @param {number} options.amount - Amount in paise
 * @param {string} options.currency - e.g. 'INR'
 * @param {string} options.keyId - Razorpay Key ID
 * @param {string} options.doctorName - Doctor's full name
 * @param {Object} options.prefill - { name, email, contact }
 * @param {Function} options.onSuccess - Callback on payment success: (response) => {}
 * @param {Function} options.onError - Callback on payment failure or modal dismissal: (error) => {}
 */
export async function openRazorpayCheckout({
  orderId,
  amount,
  currency = "INR",
  keyId,
  doctorName,
  prefill = {},
  onSuccess,
  onError,
}) {
  let cleanKeyId = keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  if (cleanKeyId && cleanKeyId !== "rzp_test_placeholder" && !cleanKeyId.startsWith("rzp_")) {
    cleanKeyId = `rzp_test_${cleanKeyId}`;
  }

  const isRealKey = Boolean(
    cleanKeyId &&
    cleanKeyId !== "rzp_test_placeholder" &&
    cleanKeyId.startsWith("rzp_")
  );

  // If real Razorpay key is present and order is real (not order_test_)
  if (isRealKey && orderId && !orderId.startsWith("order_test_")) {
    const loaded = await loadRazorpayScript();

    if (loaded && window.Razorpay) {
      try {
        const options = {
          key: cleanKeyId,
          amount: amount,
          currency: currency,
          name: "CareConnect Telemedicine",
          description: `Consultation with ${doctorName || "Doctor"}`,
          order_id: orderId,
          prefill: {
            name: prefill.name || "",
            email: prefill.email || "",
            contact: prefill.contact || "",
          },
          theme: {
            color: "#0d9488", // Teal-600
          },
          handler: function (response) {
            onSuccess({
              razorpay_order_id: response.razorpay_order_id || orderId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: {
            ondismiss: function () {
              if (onError) onError({ message: "Payment cancelled by user." });
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          if (onError) onError({ message: response.error?.description || "Payment failed." });
        });
        rzp.open();
        return true;
      } catch (err) {
        console.warn("Official Razorpay modal failed to open:", err);
      }
    }
  }

  // Fallback to interactive test modal
  return false;
}
