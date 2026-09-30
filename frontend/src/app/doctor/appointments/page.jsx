"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calendar, ArrowLeft, Loader2, Clock } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getDoctorAppointments, cancelAppointment } from "@/services/appointments";
import AppointmentCard from "@/components/appointments/AppointmentCard";
import { Button } from "@/components/ui/button";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function DoctorAppointmentsPage() {
  const { user, loading: authLoading } = useRequireAuth("doctor", "/doctor/login");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctorAppointments({ status: statusFilter });
      setAppointments(data || []);
    } catch (err) {
      console.error("Failed to load doctor appointments:", err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!authLoading) {
      fetchAppointments();
    }
  }, [fetchAppointments, authLoading]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      setCancellingId(id);
      await cancelAppointment(id);
      fetchAppointments();
    } catch (err) {
      alert(err?.data?.detail || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/doctor/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600 -ml-2 h-7 px-2">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Assigned Appointments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review upcoming patient video consultations and appointment statuses.
          </p>
        </div>

        <Link href="/doctor/availability">
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4 text-blue-600" /> Manage Availability Slots
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_FILTERS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Appointments Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
          <span className="text-sm">Loading assigned appointments...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No appointments scheduled</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            {statusFilter
              ? "No appointments match this filter."
              : "You don't have any patient bookings yet. Make sure your availability slots are set."}
          </p>
          <Link href="/doctor/availability">
            <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Availability Slots
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              role="doctor"
              onCancel={handleCancel}
              cancellingId={cancellingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
