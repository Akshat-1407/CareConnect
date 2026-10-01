"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle, Calendar, FileText, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getConsultationDetails } from "@/services/consultations";
import { createPrescription, getAppointmentPrescription } from "@/services/prescriptions";
import PrescriptionForm from "@/components/prescriptions/PrescriptionForm";
import PrescriptionDetailModal from "@/components/prescriptions/PrescriptionDetailModal";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DoctorCreatePrescriptionPage() {
  const { user, loading: authLoading } = useRequireAuth("doctor", "/doctor/login");
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointmentId;

  const [appointment, setAppointment] = useState(null);
  const [existingPrescription, setExistingPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPrescription, setCreatedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (!appointmentId || authLoading) return;

    async function loadAppointmentData() {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch appointment details via consultation endpoint
        const details = await getConsultationDetails(appointmentId);
        setAppointment({
          id: details.appointment_id,
          patient: details.patient,
          doctor: details.doctor,
          slot: details.slot,
          status: details.status,
        });

        // 2. Check if a prescription already exists for this appointment
        try {
          const rx = await getAppointmentPrescription(appointmentId);
          if (rx && rx.id) {
            setExistingPrescription(rx);
          }
        } catch {
          // No prescription exists yet, which is expected
        }
      } catch (err) {
        console.error("Failed to load appointment details:", err);
        setError(err?.data?.detail || "Appointment not found or you are not authorized.");
      } finally {
        setLoading(false);
      }
    }

    loadAppointmentData();
  }, [appointmentId, authLoading]);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      setError("");
      const result = await createPrescription(formData);
      setCreatedPrescription(result);
    } catch (err) {
      console.error("Failed to create prescription:", err);
      setError(
        err?.data?.detail ||
          (err?.data?.appointment_id && err.data.appointment_id[0]) ||
          "Failed to create prescription. Please check your entries."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <span className="text-sm font-medium">Loading appointment details...</span>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Card className="border-rose-200">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs text-slate-500">{error}</p>
            <Link href="/doctor/appointments">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2">
                Back to Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success view
  if (createdPrescription) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <Card className="border-emerald-200 shadow-lg">
          <CardContent className="pt-8 pb-6 space-y-5">
            <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Prescription Issued!</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Medical prescription #{createdPrescription.id} has been recorded for{" "}
                <span className="font-semibold text-slate-800">
                  {appointment?.patient?.name || appointment?.patient_name || "the patient"}
                </span>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 text-left space-y-1.5 border border-slate-200">
              <p>
                <strong className="text-slate-700">Diagnosis:</strong> {createdPrescription.diagnosis}
              </p>
              <p>
                <strong className="text-slate-700">Medicines:</strong>{" "}
                {createdPrescription.medications?.length} prescribed
              </p>
              <p>
                <strong className="text-slate-700">Appointment Status:</strong>{" "}
                <Badge variant="success" className="text-[10px]">
                  COMPLETED
                </Badge>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => setShowDetailModal(true)}
                variant="outline"
                className="w-full gap-2 border-teal-200 text-teal-700 hover:bg-teal-50"
              >
                <FileText className="h-4 w-4" /> Preview Issued Prescription
              </Button>

              <Link href="/doctor/appointments">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2">
                  <Calendar className="h-4 w-4" /> Return to Assigned Appointments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <PrescriptionDetailModal
          prescription={createdPrescription}
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/doctor/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Appointments
        </Link>
        <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
          Doctor Clinical Portal
        </Badge>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Write Medical Prescription
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Issue official diagnosis, medicines, and clinical advice for Appointment #{appointmentId}.
        </p>
      </div>

      {existingPrescription && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-bold block">A prescription already exists for this appointment.</span>
            Submitting this form will update the prescription and replace its medications.
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <PrescriptionForm
        appointment={appointment}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
