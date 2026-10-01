"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  RefreshCw,
  Stethoscope,
  ArrowRight,
  Loader2,
  DollarSign
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminStats } from "@/services/admin";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth("admin", "/internal/admin/login");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      setRefreshing(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadStats();
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="text-sm font-medium text-slate-500 tracking-wide">Loading workspace...</span>
      </div>
    );
  }

  // Calculated Metrics
  const totalAppts = stats?.total_appointments || 0;
  const confirmedAppts = stats?.confirmed_appointments || 0;
  const completedAppts = stats?.completed_appointments || 0;
  const pendingAppts = stats?.pending_appointments || 0;
  const cancelledAppts = stats?.cancelled_appointments || 0;

  const totalSlots = stats?.total_slots || 0;
  const bookedSlots = stats?.booked_slots || 0;
  const availableSlots = stats?.available_slots || 0;
  const slotOccupancyPct = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  const totalPatients = stats?.total_patients || 0;
  const totalDoctors = stats?.total_doctors || 0;
  const patientDoctorRatio = totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : totalPatients;

  // Status Color Mapping for Appointments
  const apptStatusColors = {
    CONFIRMED: "text-blue-700 bg-blue-50 border-blue-200",
    COMPLETED: "text-emerald-700 bg-emerald-50 border-emerald-200",
    PENDING_PAYMENT: "text-amber-700 bg-amber-50 border-amber-200",
    CANCELLED: "text-red-700 bg-red-50 border-red-200"
  };

  const apptStatusLabels = {
    CONFIRMED: "Confirmed",
    COMPLETED: "Completed",
    PENDING_PAYMENT: "Pending",
    CANCELLED: "Cancelled"
  };

  // Status Color Mapping for Payments
  const paymentStatusColors = {
    SUCCESS: "text-emerald-700 bg-emerald-50 border-emerald-200",
    PENDING: "text-amber-700 bg-amber-50 border-amber-200",
    FAILED: "text-red-700 bg-red-50 border-red-200"
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-in fade-in duration-300">
      
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">System Operational</span>
          </div>
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight">Overview</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-lg">
            Real-time platform activity, revenue data, and clinical metrics.
          </p>
        </div>
        <button
          onClick={loadStats}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors rounded-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Syncing..." : "Sync Data"}
        </button>
      </div>

      {/* 2. Top-level KPIs - Unified Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
        
        {/* Revenue KPI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <DollarSign className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-widest">Revenue</h3>
          </div>
          <div>
            <div className="text-3xl font-medium text-slate-900 tracking-tight">
              ₹{stats?.total_revenue?.toLocaleString("en-IN") ?? 0}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <span className="font-medium text-emerald-600">{stats?.payment_success_rate ?? 100}% Success</span>
              <span>•</span>
              <span>₹{stats?.avg_revenue_per_appt ?? 0} avg</span>
            </div>
          </div>
        </div>

        {/* Consultations KPI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-widest">Consultations</h3>
          </div>
          <div>
            <div className="text-3xl font-medium text-slate-900 tracking-tight">
              {totalAppts}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <span className="font-medium text-slate-700">{confirmedAppts} Active</span>
              <span>•</span>
              <span>{completedAppts} Done</span>
            </div>
          </div>
        </div>

        {/* Providers KPI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Stethoscope className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-widest">Providers</h3>
          </div>
          <div>
            <div className="text-3xl font-medium text-slate-900 tracking-tight">
              {totalDoctors}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <span className="font-medium text-slate-700">{availableSlots} Slots</span>
              <span>•</span>
              <span>{slotOccupancyPct}% Booked</span>
            </div>
          </div>
        </div>

        {/* Patients KPI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-4 h-4" />
            <h3 className="text-xs font-semibold uppercase tracking-widest">Patients</h3>
          </div>
          <div>
            <div className="text-3xl font-medium text-slate-900 tracking-tight">
              {totalPatients}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
              <span className="font-medium text-slate-700">{patientDoctorRatio} Ratio</span>
              <span>•</span>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-200" />

      {/* 3. Deep Dives (Appointments & Ops) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Appointments Breakdown */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Pipeline Status</h2>
          
          <div className="bg-slate-50 p-6 border border-slate-200 space-y-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-medium text-slate-900">{totalAppts} Total Bookings</span>
            </div>
            
            {/* Visual Bar */}
            <div className="h-3 w-full bg-slate-200 flex">
               {totalAppts > 0 && (
                 <>
                   <div style={{ width: `${(confirmedAppts / totalAppts) * 100}%` }} className="bg-blue-500 h-full" />
                   <div style={{ width: `${(completedAppts / totalAppts) * 100}%` }} className="bg-emerald-500 h-full" />
                   <div style={{ width: `${(pendingAppts / totalAppts) * 100}%` }} className="bg-amber-400 h-full" />
                   <div style={{ width: `${(cancelledAppts / totalAppts) * 100}%` }} className="bg-red-400 h-full" />
                 </>
               )}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="w-2 h-2 bg-blue-500 rounded-full" />
                   <span className="text-xs font-medium text-slate-700">Confirmed</span>
                 </div>
                 <div className="text-lg font-medium text-slate-900">{confirmedAppts}</div>
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-xs font-medium text-slate-700">Completed</span>
                 </div>
                 <div className="text-lg font-medium text-slate-900">{completedAppts}</div>
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="w-2 h-2 bg-amber-400 rounded-full" />
                   <span className="text-xs font-medium text-slate-700">Pending</span>
                 </div>
                 <div className="text-lg font-medium text-slate-900">{pendingAppts}</div>
               </div>
               <div>
                 <div className="flex items-center gap-2 mb-1">
                   <span className="w-2 h-2 bg-red-400 rounded-full" />
                   <span className="text-xs font-medium text-slate-700">Cancelled</span>
                 </div>
                 <div className="text-lg font-medium text-slate-900">{cancelledAppts}</div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Specialties & Payments */}
        <div className="lg:col-span-5 space-y-10">
          {/* Medical Specialties */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Specialty Distribution</h2>
            <div className="border border-slate-200">
              {stats?.specializations && stats.specializations.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {stats.specializations.map((spec) => (
                    <li key={spec.specialization} className="px-4 py-3 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-900">{spec.specialization}</span>
                      <span className="text-slate-500">{spec.count} Providers</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-sm text-slate-400 font-light">No specialization data available.</div>
              )}
            </div>
          </div>

          {/* Operational Checks */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">System Metrics</h2>
            <div className="border border-slate-200 divide-y divide-slate-100">
               <div className="px-4 py-3 flex items-center justify-between">
                 <span className="text-sm text-slate-600">Avg. Revenue / Session</span>
                 <span className="text-sm font-medium text-slate-900">₹{stats?.avg_revenue_per_appt ?? 0}</span>
               </div>
               <div className="px-4 py-3 flex items-center justify-between">
                 <span className="text-sm text-slate-600">Successful Payments</span>
                 <span className="text-sm font-medium text-emerald-600">{stats?.successful_payments ?? 0}</span>
               </div>
               <div className="px-4 py-3 flex items-center justify-between">
                 <span className="text-sm text-slate-600">Failed / Dropped</span>
                 <span className="text-sm font-medium text-red-600">{stats?.failed_payments ?? 0}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-slate-200" />

      {/* 4. Tables Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Recent Consultations Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Recent Appointments</h2>
            <Link href="/admin/appointments" className="text-xs font-medium text-slate-900 hover:text-teal-700 transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="border border-slate-200 overflow-x-auto">
            {stats?.recent_appointments && stats.recent_appointments.length > 0 ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Patient & ID</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{appt.patient_name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">#{appt.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{appt.doctor_name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[120px]">{appt.specialization}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-medium uppercase tracking-wider ${apptStatusColors[appt.status] || "text-slate-700 bg-slate-50 border-slate-200"}`}>
                          {apptStatusLabels[appt.status] || appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-sm text-slate-400 font-light">
                No recent appointments found.
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Recent Transactions</h2>
            <Link href="/admin/payments" className="text-xs font-medium text-slate-900 hover:text-teal-700 transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="border border-slate-200 overflow-x-auto">
            {stats?.recent_payments && stats.recent_payments.length > 0 ? (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Patient</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-mono text-xs text-slate-600">{p.razorpay_order_id}</div>
                        <div className="mt-1 flex items-center">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${paymentStatusColors[p.status] || "text-slate-700 bg-slate-50 border-slate-200"}`}>
                            {p.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{p.patient_name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">Appt #{p.appointment_id}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-medium text-slate-900">₹{p.amount}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-sm text-slate-400 font-light">
                No recent transactions found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
