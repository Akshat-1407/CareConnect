"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Search, Pill, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getPrescriptions } from "@/services/prescriptions";
import PrescriptionCard from "@/components/prescriptions/PrescriptionCard";
import PrescriptionDetailModal from "@/components/prescriptions/PrescriptionDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PatientPrescriptionsPage() {
  const { user, loading: authLoading } = useRequireAuth("patient", "/login");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    async function loadData() {
      try {
        setLoading(true);
        const data = await getPrescriptions();
        setPrescriptions(data || []);
      } catch (err) {
        console.error("Failed to load prescriptions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [authLoading]);

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const docName = rx.doctor?.name?.toLowerCase() || "";
    const diagnosis = rx.diagnosis?.toLowerCase() || "";
    const meds = rx.medications?.map((m) => m.medicine_name.toLowerCase()).join(" ") || "";
    return docName.includes(term) || diagnosis.includes(term) || meds.includes(term);
  });

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <span className="text-sm font-medium">Loading your medical prescriptions...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Badge variant="secondary" className="mb-2 bg-teal-50 text-teal-700 border-teal-200">
            Medical Records
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Prescriptions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access medical diagnoses, medicine dosages, and advice issued by your doctors.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by doctor, medicine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs bg-white"
          />
        </div>
      </div>

      {/* Prescription List or Empty State */}
      {filteredPrescriptions.length === 0 ? (
        <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div className="h-16 w-16 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Pill className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {searchTerm ? "No matching prescriptions found" : "No Prescriptions Yet"}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `No prescriptions matched "${searchTerm}". Try another search term.`
              : "When a doctor issues a prescription after your consultation, it will appear here with complete medicine instructions."}
          </p>
          {!searchTerm && (
            <Link href="/patient/appointments">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white gap-2 text-xs">
                <Calendar className="h-3.5 w-3.5" /> View My Appointments
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              onViewDetails={(rx) => setSelectedPrescription(rx)}
            />
          ))}
        </div>
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
