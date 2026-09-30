"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Stethoscope, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getDoctors } from "@/services/doctors";
import DoctorSearch from "@/components/doctors/DoctorSearch";
import DoctorList from "@/components/doctors/DoctorList";
import { Button } from "@/components/ui/button";

export default function PatientDoctorsPage() {
  const { user, loading: authLoading } = useRequireAuth("patient", "/login");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialization, setSpecialization] = useState("");

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctors({
        search: searchTerm,
        specialization: specialization,
      });
      setDoctors(data || []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, specialization]);

  useEffect(() => {
    if (!authLoading) {
      // Debounce search input slightly
      const timer = setTimeout(() => {
        fetchDoctors();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [fetchDoctors, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/patient/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Stethoscope className="h-4 w-4 text-teal-600" />
          <span>CareConnect Specialists</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Your Healthcare Specialist
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Browse verified doctors, select an available consultation slot, and book your virtual appointment.
        </p>
      </div>

      {/* Doctor Search & Filters */}
      <DoctorSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSpecialization={specialization}
        onSpecializationChange={setSpecialization}
      />

      {/* Doctor Cards Grid */}
      <DoctorList doctors={doctors} loading={loading} />
    </div>
  );
}
