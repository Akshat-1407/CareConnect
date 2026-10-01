"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Pill,
  Calendar,
  User,
  PlusCircle,
  Loader2,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getPrescriptions } from "@/services/prescriptions";
import { getDoctorAppointments } from "@/services/appointments";
import PrescriptionDetailModal from "@/components/prescriptions/PrescriptionDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DoctorPrescriptionsPage() {
  const { user, loading: authLoading } = useRequireAuth("doctor", "/doctor/login");
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [activeTab, setActiveTab] = useState("issued"); // 'issued' | 'eligible'

  useEffect(() => {
    if (authLoading) return;

    async function loadData() {
      try {
        setLoading(true);
        const [rxData, apptData] = await Promise.all([
          getPrescriptions().catch(() => []),
          getDoctorAppointments().catch(() => []),
        ]);
        setPrescriptions(rxData || []);
        setAppointments(apptData || []);
      } catch (err) {
        console.error("Failed to load doctor prescriptions or appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [authLoading]);

  // Appointments that are CONFIRMED or COMPLETED
  const eligibleAppointments = appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "COMPLETED"
  );

  // Set of appointment IDs that already have a prescription
  const prescribedAppointmentIds = new Set(
    prescriptions.map((p) => p.appointment_id || p.appointment?.id)
  );

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const patientName = rx.patient?.name?.toLowerCase() || "";
    const diagnosis = rx.diagnosis?.toLowerCase() || "";
    const meds = rx.medications?.map((m) => m.medicine_name.toLowerCase()).join(" ") || "";
    const rxId = String(rx.id);
    return patientName.includes(term) || diagnosis.includes(term) || meds.includes(term) || rxId.includes(term);
  });

  const filteredEligible = eligibleAppointments.filter((appt) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const patientName = (appt.patient_name || "").toLowerCase();
    const email = (appt.patient_email || "").toLowerCase();
    const apptId = String(appt.id);
    return patientName.includes(term) || email.includes(term) || apptId.includes(term);
  });

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <span className="text-sm font-medium">Loading medical prescriptions & records...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Clinical Records & Pharmacy
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prescriptions Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review issued medical prescriptions and write new drug dosages for your patients.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/doctor/prescriptions/create">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm gap-2 text-xs font-semibold h-10 px-4">
              <PlusCircle className="h-4 w-4" />
              Write New Prescription
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Issued</p>
            <p className="text-2xl font-black text-slate-900">{prescriptions.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Consultations Eligible</p>
            <p className="text-2xl font-black text-slate-900">{eligibleAppointments.length}</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Prescription</p>
            <p className="text-2xl font-black text-slate-900">
              {Math.max(0, eligibleAppointments.filter((a) => !prescribedAppointmentIds.has(a.id)).length)}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("issued")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "issued"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Issued Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("eligible")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "eligible"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            Appointments to Prescribe ({eligibleAppointments.length})
          </button>
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder={activeTab === "issued" ? "Search patient, drug, Rx #..." : "Search patient, appt #..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs bg-white"
          />
        </div>
      </div>

      {/* TAB 1: ISSUED PRESCRIPTIONS */}
      {activeTab === "issued" && (
        <>
          {filteredPrescriptions.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <Pill className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {searchTerm ? "No matching prescriptions found" : "No Prescriptions Issued Yet"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                {searchTerm
                  ? `No issued prescriptions matched "${searchTerm}". Try another query.`
                  : "After you complete or confirm a patient consultation, you can issue formal digital prescriptions here."}
              </p>
              {!searchTerm && (
                <Link href="/doctor/prescriptions/create">
                  <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-2 text-xs">
                    <PlusCircle className="h-3.5 w-3.5" /> Write First Prescription
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPrescriptions.map((prescription) => {
                const dateFormatted = prescription.created_at
                  ? new Date(prescription.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "";
                const medCount = prescription.medications?.length || 0;

                return (
                  <Card
                    key={prescription.id}
                    className="border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                  >
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-bold text-slate-900">
                              {prescription.patient?.name || "Patient"}
                            </CardTitle>
                            <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                              {prescription.patient?.email || `Appt #${prescription.appointment_id}`}
                            </p>
                          </div>
                        </div>

                        <Badge variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-700 font-bold">
                          Rx #{prescription.id}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                            Clinical Diagnosis
                          </span>
                          <p className="text-xs font-semibold text-slate-800 line-clamp-2">
                            {prescription.diagnosis}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            <span>{dateFormatted}</span>
                          </div>
                          <div className="flex items-center gap-1 text-teal-700 font-medium">
                            <Pill className="h-3 w-3 text-teal-600" />
                            <span>
                              {medCount} {medCount === 1 ? "Medicine" : "Medicines"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex gap-2">
                        <Button
                          onClick={() => setSelectedPrescription(prescription)}
                          variant="outline"
                          size="sm"
                          className="w-full text-xs font-semibold text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800 gap-1.5"
                        >
                          <FileText className="h-3.5 w-3.5" /> View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: ELIGIBLE APPOINTMENTS TO PRESCRIBE */}
      {activeTab === "eligible" && (
        <>
          {filteredEligible.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                No Eligible Appointments Found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Prescriptions can only be authored for confirmed or completed appointments.
              </p>
              <Link href="/doctor/appointments">
                <Button size="sm" variant="outline" className="text-xs gap-1.5">
                  Check Appointments Schedule
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEligible.map((appt) => {
                const isPrescribed = prescribedAppointmentIds.has(appt.id);
                const patientName = appt.patient_name || "Patient";
                const patientEmail = appt.patient_email || "";

                return (
                  <Card
                    key={appt.id}
                    className="border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <CardHeader className="pb-3 border-b border-slate-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-sm font-bold text-slate-900">
                            {patientName}
                          </CardTitle>
                          <p className="text-[11px] text-slate-500">{patientEmail}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${
                            appt.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {appt.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {appt.slot?.date} ({appt.slot?.start_time?.slice(0, 5)} -{" "}
                            {appt.slot?.end_time?.slice(0, 5)})
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100">
                            &ldquo;{appt.notes}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        {isPrescribed ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Prescribed
                            </span>
                            <Link href={`/doctor/prescriptions/create/${appt.id}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-slate-600 hover:text-slate-900 h-8"
                              >
                                View / Re-write
                              </Button>
                            </Link>
                          </div>
                        ) : (
                          <Link href={`/doctor/prescriptions/create/${appt.id}`} className="w-full block">
                            <Button
                              size="sm"
                              className="w-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold gap-1.5 h-9"
                            >
                              <PlusCircle className="h-3.5 w-3.5" /> Write Prescription
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Prescription Detail Modal */}
      <PrescriptionDetailModal
        prescription={selectedPrescription}
        isOpen={Boolean(selectedPrescription)}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}
