"use client";

import { useState } from "react";
import { Plus, FileCheck, Stethoscope, User, Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";
import MedicationRow from "./MedicationRow";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const DEFAULT_MEDICATION = {
  medicine_name: "",
  dosage: "",
  frequency: "",
  duration: "",
  notes: "",
};

export default function PrescriptionForm({ appointment, onSubmit, isSubmitting = false }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [instructions, setInstructions] = useState("");
  const [medications, setMedications] = useState([{ ...DEFAULT_MEDICATION }]);
  const [validationError, setValidationError] = useState("");

  const handleAddMedication = () => {
    setMedications((prev) => [...prev, { ...DEFAULT_MEDICATION }]);
  };

  const handleRemoveMedication = (index) => {
    if (medications.length <= 1) return;
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index, updated) => {
    setMedications((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    if (!diagnosis.trim()) {
      setValidationError("Please enter clinical diagnosis or findings.");
      return;
    }

    // Check that all medications have required fields
    for (let i = 0; i < medications.length; i++) {
      const m = medications[i];
      if (!m.medicine_name.trim() || !m.dosage.trim() || !m.frequency.trim() || !m.duration.trim()) {
        setValidationError(`Please fill out Medicine Name, Dosage, Frequency, and Duration for Medication #${i + 1}.`);
        return;
      }
    }

    onSubmit({
      appointment_id: appointment.id,
      diagnosis: diagnosis.trim(),
      instructions: instructions.trim(),
      medications,
    });
  };

  const patientName =
    appointment?.patient?.name ||
    appointment?.patient_name ||
    (appointment?.patient?.first_name ? `${appointment.patient.first_name} ${appointment.patient.last_name || ""}`.trim() : null) ||
    appointment?.patient?.username ||
    "Patient";
  const slot = appointment?.slot;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Appointment Information Card */}
      <Card className="border-slate-200 bg-slate-50/70 shadow-sm">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <User className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Prescription For Patient
                </span>
                <h3 className="text-base font-bold text-slate-900">{patientName}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-600 sm:justify-end">
              <Badge variant="outline" className="bg-white border-slate-300">
                Appt #{appointment?.id}
              </Badge>
              {slot && (
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Calendar className="h-3.5 w-3.5 text-teal-600" />
                  <span>{slot.date}</span>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinical Diagnosis Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-600" /> Clinical Diagnosis & Findings *
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          <Textarea
            required
            rows={3}
            placeholder="Enter clinical diagnosis, primary symptoms, and examination findings..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            className="text-xs sm:text-sm bg-white"
          />
          <p className="text-[11px] text-slate-400">
            Be specific with medical findings and clinical assessment.
          </p>
        </CardContent>
      </Card>

      {/* Medications Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900">
            Prescribed Medications (Rx) *
          </CardTitle>
          <Button
            type="button"
            onClick={handleAddMedication}
            variant="outline"
            size="sm"
            className="h-8 text-xs font-semibold text-teal-700 border-teal-200 hover:bg-teal-50 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" /> Add Medicine
          </Button>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          {medications.map((med, idx) => (
            <MedicationRow
              key={idx}
              index={idx}
              medication={med}
              onChange={handleMedicationChange}
              onRemove={handleRemoveMedication}
              canRemove={medications.length > 1}
            />
          ))}
        </CardContent>
      </Card>

      {/* Special Instructions & Advice */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Doctor&apos;s Advice & General Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          <Textarea
            rows={3}
            placeholder="e.g. Diet restrictions, daily hydration, follow-up after 1 week, emergency contact warnings..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="text-xs sm:text-sm bg-white"
          />
          <p className="text-[11px] text-slate-400">
            Optional dietary, lifestyle, or follow-up recommendations.
          </p>
        </CardContent>
      </Card>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 shadow-md shadow-teal-600/20 gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving Prescription...
            </>
          ) : (
            <>
              <FileCheck className="h-4 w-4" /> Issue Medical Prescription
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
