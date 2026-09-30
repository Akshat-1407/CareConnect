"use client";

import { X, FileText, Stethoscope, User, Calendar, AlertCircle } from "lucide-react";
import MedicationList from "./MedicationList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PrescriptionDetailModal({ prescription, isOpen, onClose }) {
  if (!isOpen || !prescription) return null;

  const dateFormatted = prescription.created_at
    ? new Date(prescription.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Prescription Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Medical Prescription</h3>
                <Badge variant="outline" className="text-[10px] text-teal-300 border-teal-500/40">
                  Rx #{prescription.id}
                </Badge>
              </div>
              <p className="text-xs text-slate-400">CareConnect Telemedicine Health Network</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Doctor Information
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                {prescription.doctor?.name}
              </p>
              <p className="text-xs text-slate-500">{prescription.doctor?.specialization}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Patient & Appointment
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-teal-600" />
                {prescription.patient?.name}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" />
                Issued on {dateFormatted} (Appt #{prescription.appointment_id})
              </p>
            </div>
          </div>

          {/* Diagnosis Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Clinical Diagnosis & Findings
            </h4>
            <div className="p-3.5 bg-teal-50/50 border border-teal-100 rounded-xl text-slate-900 font-medium">
              {prescription.diagnosis}
            </div>
          </div>

          {/* Medications Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span>Prescribed Medications (Rx)</span>
                <Badge variant="secondary" className="text-[10px]">
                  {prescription.medications?.length || 0}
                </Badge>
              </h4>
            </div>
            <MedicationList medications={prescription.medications} />
          </div>

          {/* Instructions / Advice */}
          {prescription.instructions && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Doctor&apos;s Advice & Instructions
              </h4>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-wrap leading-relaxed">
                {prescription.instructions}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
