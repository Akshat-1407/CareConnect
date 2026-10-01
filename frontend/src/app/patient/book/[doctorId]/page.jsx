"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Stethoscope,
  Award,
  Calendar,
  Clock,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getDoctorById, getDoctorSlots } from "@/services/doctors";
import { bookAppointment } from "@/services/appointments";
import { verifyPayment } from "@/services/payments";
import { openRazorpayCheckout } from "@/lib/razorpay";
import SlotPicker from "@/components/doctors/SlotPicker";
import RazorpayCheckoutModal from "@/components/payments/RazorpayCheckoutModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatTimeString(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatDateString(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookDoctorPage() {
  const { user, loading: authLoading } = useRequireAuth("patient", "/login");
  const params = useParams();
  const router = useRouter();
  const doctorId = params?.doctorId;

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState("");

  // Booking & Payment States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatusText, setPaymentStatusText] = useState("");
  const [confirmedData, setConfirmedData] = useState(null);
  const [bookingError, setBookingError] = useState("");

  // Interactive Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activePaymentOrder, setActivePaymentOrder] = useState(null);

  useEffect(() => {
    if (!doctorId || authLoading) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [docData, slotsData] = await Promise.all([
          getDoctorById(doctorId),
          getDoctorSlots(doctorId),
        ]);
        setDoctor(docData);
        setSlots(slotsData || []);
      } catch (err) {
        console.error("Error loading doctor booking details:", err);
        setError("Doctor or slots could not be loaded. Please return to the doctor directory.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [doctorId, authLoading]);

  // Handle backend signature verification and confirmation
  const handleVerifyPayment = async (paymentResponse) => {
    try {
      setShowPaymentModal(false);
      setIsProcessing(true);
      setPaymentStatusText("Verifying payment signature with backend...");

      const verifyRes = await verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
      });

      setConfirmedData(verifyRes);
      setIsProcessing(false);
    } catch (vErr) {
      console.error("Payment verification failed:", vErr);
      setBookingError(vErr?.data?.detail || "Payment verification failed. Please contact support.");
      setIsProcessing(false);
    }
  };

  const handleStartBooking = async () => {
    if (!selectedSlot) return;

    // Client-side guard: prevent booking a slot whose time has already passed
    const slotDateTime = new Date(`${selectedSlot.date}T${selectedSlot.start_time}`);
    if (slotDateTime <= new Date()) {
      setBookingError("This slot's time has already passed. Please select a different slot.");
      setSelectedSlot(null);
      return;
    }

    setBookingError("");
    setIsProcessing(true);
    setPaymentStatusText("Verifying slot and initiating Razorpay order...");

    try {
      // 1. Create PENDING_PAYMENT appointment and Razorpay order
      const res = await bookAppointment({
        slot_id: selectedSlot.id,
        notes: notes.trim(),
      });

      const { appointment, razorpay: rzpData } = res;

      setPaymentStatusText("Opening Razorpay checkout...");

      // 2. Try opening official Razorpay checkout
      const openedOfficial = await openRazorpayCheckout({
        orderId: rzpData.order_id,
        amount: rzpData.amount,
        currency: rzpData.currency || "INR",
        keyId: rzpData.key_id,
        doctorName: doctor.full_name,
        prefill: {
          name: user?.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : user?.username,
          email: user?.email || "",
          contact: user?.phone || "",
        },
        onSuccess: handleVerifyPayment,
        onError: (err) => {
          setIsProcessing(false);
          setBookingError(err?.message || "Payment cancelled.");
        },
      });

      // 3. If official Razorpay checkout isn't using a live key or couldn't open,
      // open the interactive Razorpay payment modal
      if (!openedOfficial) {
        setIsProcessing(false);
        setActivePaymentOrder(rzpData);
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg = err?.data?.detail || err?.data?.non_field_errors?.[0] || "Failed to book slot. It may have already been taken.";
      setBookingError(msg);
      setIsProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Doctor Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">{error || "Doctor profile is unavailable."}</p>
        <Link href="/patient/doctors">
          <Button variant="default" className="bg-teal-600 hover:bg-teal-700 text-white">
            Back to Doctors Directory
          </Button>
        </Link>
      </div>
    );
  }

  // Success Confirmation Screen
  if (confirmedData) {
    const appt = confirmedData.appointment;
    const payment = confirmedData.payment;

    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card className="border-teal-200 bg-white shadow-lg text-center overflow-hidden">
          <div className="bg-teal-600 py-8 px-4 text-white">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Booking Confirmed!</h1>
            <p className="text-teal-100 text-xs mt-1">
              Your appointment is scheduled and verified.
            </p>
          </div>

          <CardContent className="p-6 space-y-6 text-left">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="text-slate-500">Appointment ID</span>
                <span className="font-bold text-slate-800">#{appt.id}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="text-slate-500">Doctor</span>
                <span className="font-semibold text-slate-800">{doctor.full_name}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-semibold text-teal-700">
                  {formatDateString(selectedSlot.date)} at {formatTimeString(selectedSlot.start_time)}
                </span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <span className="text-slate-500">Payment Status</span>
                <Badge variant="success" className="text-[10px]">
                  PAID (₹{payment?.amount || appt.amount})
                </Badge>
              </div>
              {payment?.razorpay_payment_id && (
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Payment Ref</span>
                  <span className="font-mono">{payment.razorpay_payment_id}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/patient/appointments" className="flex-1">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2">
                  <Calendar className="h-4 w-4" /> View My Appointments
                </Button>
              </Link>
              <Link href="/patient/doctors" className="flex-1">
                <Button variant="outline" className="w-full">
                  Browse More Doctors
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link href="/patient/doctors">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
            <ArrowLeft className="h-4 w-4" /> Back to Doctors
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Doctor Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm sticky top-24">
            <CardHeader className="text-center pb-4 border-b border-slate-100">
              <div className="h-20 w-20 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-2xl mx-auto mb-3 shadow-inner">
                {doctor.first_name ? doctor.first_name[0] : "D"}
              </div>
              <CardTitle className="text-xl font-bold text-slate-900">
                {doctor.full_name}
              </CardTitle>
              <div className="mt-1">
                <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
                  {doctor.specialization}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {doctor.qualification}
              </p>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Award className="h-4 w-4 text-teal-600" /> Experience
                  </span>
                  <span className="font-semibold text-slate-800">
                    {doctor.experience_years} years
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CreditCard className="h-4 w-4 text-teal-600" /> Consultation Fee
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{doctor.consultation_fee}
                  </span>
                </div>
              </div>

              {doctor.bio && (
                <div className="pt-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    About
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {doctor.bio}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Verified CareConnect Practitioner</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Slot Picker & Booking Action */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Book an Appointment</h2>
            <p className="text-sm text-slate-500 mt-1">
              Select an available time slot below to schedule your virtual video consultation.
            </p>
          </div>

          {/* Interactive Slot Picker */}
          <SlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={(slot) => {
              setSelectedSlot(slot);
              setBookingError("");
            }}
          />

          {/* Selected Slot Summary Card */}
          {selectedSlot && (
            <Card className="border-teal-200 bg-teal-50/50 shadow-sm animate-in fade-in-50 duration-200">
              <CardHeader className="pb-3 border-b border-teal-100">
                <div className="flex items-center gap-2 text-teal-800">
                  <CheckCircle2 className="h-5 w-5 text-teal-600" />
                  <CardTitle className="text-base">Selected Appointment Slot</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span>{formatDateString(selectedSlot.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <span>
                      {formatTimeString(selectedSlot.start_time)} –{" "}
                      {formatTimeString(selectedSlot.end_time)}
                    </span>
                  </div>
                </div>

                {/* Optional Notes for Doctor */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Symptoms or Consultation Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe what you'd like to discuss..."
                    className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-teal-200/60 text-sm">
                  <span className="text-slate-600 font-medium">Consultation Fee:</span>
                  <span className="text-lg font-bold text-slate-900">
                    ₹{doctor.consultation_fee}
                  </span>
                </div>

                {bookingError && (
                  <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    onClick={handleStartBooking}
                    disabled={isProcessing}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{paymentStatusText || "Processing Payment..."}</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        <span>Pay ₹{doctor.consultation_fee} via Razorpay</span>
                      </>
                    )}
                  </Button>
                  <p className="text-center text-[11px] text-slate-400">
                    Secured by Razorpay. Slot availability is verified prior to transaction confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Interactive Razorpay Checkout Modal (Opens whenever payment is started) */}
      <RazorpayCheckoutModal
        isOpen={showPaymentModal}
        orderData={activePaymentOrder}
        doctorName={doctor?.full_name}
        user={user}
        onSuccess={handleVerifyPayment}
        onDismiss={() => {
          setShowPaymentModal(false);
          setIsProcessing(false);
        }}
      />
    </div>
  );
}
