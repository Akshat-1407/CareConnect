"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  PlusCircle,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getDoctorAppointments } from "@/services/appointments";
import { getPrescriptions } from "@/services/prescriptions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function DoctorSelectAppointmentForPrescriptionPage() {
  const { user, loading: authLoading } = useRequireAuth("doctor", "/doctor/login");
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (authLoading) return;

    async function loadData() {
      try {
        setLoading(true);
        const [apptData, rxData] = await Promise.all([
          getDoctorAppointments().catch(() => []),
          getPrescriptions().catch(() => []),
        ]);
        setAppointments(apptData || []);
        setPrescriptions(rxData || []);
      } catch (err) {
        console.error("Failed to load appointments:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [authLoading]);

  // Only CONFIRMED or COMPLETED appointments can have prescriptions
  const eligibleAppointments = appointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "COMPLETED"
  );

  const prescribedAppointmentIds = new Set(
    prescriptions.map((p) => p.appointment_id || p.appointment?.id)
  );

  const filteredAppointments = eligibleAppointments.filter((appt) => {
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
        <span className="text-sm font-medium">Loading your patient appointments...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Top Breadcrumb / Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <Link href="/doctor/prescriptions">
          <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600 -ml-2 h-8 px-2.5">
            <ArrowLeft className="h-4 w-4" /> Prescriptions Hub
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Badge variant="secondary" className="mb-2 bg-teal-50 text-teal-700 border-teal-200">
            Select Consultation
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create New Prescription
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Choose a confirmed or completed consultation appointment to issue patient medications and instructions.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs bg-white"
          />
        </div>
      </div>

      {/* Appointment Selection Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="h-16 w-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {searchTerm ? "No matching appointments found" : "No Eligible Appointments Found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `No appointments matched "${searchTerm}". Try another search term.`
              : "You do not have any confirmed or completed appointments ready for a prescription yet."}
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/doctor/appointments">
              <Button size="sm" variant="outline" className="text-xs gap-1.5">
                View Appointments
              </Button>
            </Link>
            <Link href="/doctor/dashboard">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
                Doctor Dashboard
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.map((appt) => {
            const isPrescribed = prescribedAppointmentIds.has(appt.id);
            const patientName = appt.patient_name || "Patient";
            const patientEmail = appt.patient_email || "";

            return (
              <Card
                key={appt.id}
                className="border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">
                          {patientName}
                        </CardTitle>
                        <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                          {patientEmail}
                        </p>
                      </div>
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
                      <span className="font-semibold text-slate-800">
                        {appt.slot?.date}
                      </span>
                      <span className="text-slate-400">|</span>
                      <span>
                        {appt.slot?.start_time?.slice(0, 5)} - {appt.slot?.end_time?.slice(0, 5)}
                      </span>
                    </div>

                    {appt.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2">
                        &ldquo;{appt.notes}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <Link href={`/doctor/prescriptions/create/${appt.id}`} className="block w-full">
                      <Button
                        size="sm"
                        className={`w-full text-xs font-semibold gap-1.5 h-9 ${
                          isPrescribed
                            ? "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                            : "bg-teal-600 hover:bg-teal-700 text-white"
                        }`}
                      >
                        {isPrescribed ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            Prescribed (Edit / Rewrite)
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-3.5 w-3.5" />
                            Write Prescription
                          </>
                        )}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
