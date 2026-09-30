"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Stethoscope, User, Search, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminAppointments } from "@/services/admin";
import AdminNav from "@/components/admin/AdminNav";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const STATUS_FILTERS = [
  { label: "All Appointments", value: "" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending Payment", value: "PENDING_PAYMENT" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AdminAppointmentsPage() {
  const { user, loading: authLoading } = useRequireAuth("admin", "/internal/admin/login");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAdminAppointments({
        status: statusFilter || undefined,
      });
      setAppointments(data || []);
    } catch (err) {
      console.error("Failed to load admin appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadAppointments();
  }, [authLoading, statusFilter]);

  const filteredAppointments = appointments.filter((a) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      a.id.toString().includes(term) ||
      a.patient?.name?.toLowerCase().includes(term) ||
      a.doctor?.name?.toLowerCase().includes(term) ||
      a.doctor?.specialization?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success" className="text-[10px]">Confirmed</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px]">Completed</Badge>;
      case "PENDING_PAYMENT":
        return <Badge variant="warning" className="text-[10px]">Pending Payment</Badge>;
      case "CANCELLED":
        return <Badge variant="danger" className="text-[10px]">Cancelled</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminNav />

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-1.5 bg-emerald-50 text-emerald-700 border-emerald-200">
              Operations
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Consultations & Appointments
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete log of all patient bookings, clinical statuses, and assigned providers.
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  statusFilter === tab.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search appointment #, patient, doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-white"
            />
          </div>
        </div>

        {/* Appointments Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-2" />
            <span className="text-sm">Loading appointments log...</span>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No appointments found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? "No appointments match your search." : "No appointments match the selected filter."}
            </p>
          </div>
        ) : (
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Appt #</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Doctor</th>
                    <th className="py-3.5 px-4">Scheduled Slot</th>
                    <th className="py-3.5 px-4">Fee</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Booked At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{appt.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{appt.patient?.name}</span>
                        <span className="text-[11px] text-slate-400 block">{appt.patient?.email}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{appt.doctor?.name}</span>
                        <span className="text-[11px] text-slate-400 block">{appt.doctor?.specialization}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {appt.slot ? (
                          <div className="space-y-0.5">
                            <span className="font-medium text-slate-800 block">{appt.slot.date}</span>
                            <span className="text-[11px] text-slate-400 block">
                              {appt.slot.start_time} – {appt.slot.end_time}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No slot</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ₹{appt.amount}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(appt.status)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {appt.created_at ? new Date(appt.created_at).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
