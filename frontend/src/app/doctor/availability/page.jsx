"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AvailabilityManager from "@/components/doctors/AvailabilityManager";
import { Button } from "@/components/ui/button";

export default function DoctorAvailabilityPage() {
  const { user, loading: authLoading } = useRequireAuth("doctor", "/doctor/login");

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/doctor/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Clock className="h-4 w-4 text-blue-600" />
          <span>Doctor Schedule Portal</span>
        </div>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Manage Availability
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add future consultation time slots for patients to book. You can remove any future slots that haven&apos;t been booked yet.
        </p>
      </div>

      {/* Main Availability Management Component */}
      <AvailabilityManager />
    </div>
  );
}
