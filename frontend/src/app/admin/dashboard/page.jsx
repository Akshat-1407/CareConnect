"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  RefreshCw,
  Stethoscope,
  ShieldCheck,
  Zap,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminStats } from "@/services/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  // Calculated Metrics
  const totalAppts = stats?.total_appointments || 0;
  const confirmedAppts = stats?.confirmed_appointments || 0;
  const completedAppts = stats?.completed_appointments || 0;
  const pendingAppts = stats?.pending_appointments || 0;
  const cancelledAppts = stats?.cancelled_appointments || 0;

  const confirmedPct = totalAppts > 0 ? Math.round((confirmedAppts / totalAppts) * 100) : 0;
  const completedPct = totalAppts > 0 ? Math.round((completedAppts / totalAppts) * 100) : 0;
  const pendingPct = totalAppts > 0 ? Math.round((pendingAppts / totalAppts) * 100) : 0;
  const cancelledPct = totalAppts > 0 ? Math.round((cancelledAppts / totalAppts) * 100) : 0;

  const totalSlots = stats?.total_slots || 0;
  const bookedSlots = stats?.booked_slots || 0;
  const availableSlots = stats?.available_slots || 0;
  const slotOccupancyPct = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

  const totalPatients = stats?.total_patients || 0;
  const totalDoctors = stats?.total_doctors || 0;
  const patientDoctorRatio = totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(1) : totalPatients;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ========================================================= */}
      {/* 1. WELCOME HEADER & OPERATIONAL STATUS                    */}
      {/* ========================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 text-[11px] font-semibold">
              Live Control Center
            </Badge>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Platform Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time consultation activity, revenue metrics, and provider performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadStats}
            disabled={refreshing}
            className="text-xs font-semibold gap-2 border-slate-200 hover:bg-slate-50 shadow-xs h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-600 ${refreshing ? "animate-spin text-teal-600" : ""}`} />
            <span>{refreshing ? "Syncing..." : "Refresh Data"}</span>
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. TOP KPI CARDS (4 HIGH-LEVEL METRICS)                   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Revenue */}
        <Card className="border-slate-200 shadow-xs hover:shadow-md transition duration-200 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Gross Platform Volume
              </span>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                ₹{stats?.total_revenue?.toLocaleString("en-IN") ?? 0}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {stats?.payment_success_rate ?? 100}% Success
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">
                  ₹{stats?.avg_revenue_per_appt ?? 0} avg / appt
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Appointments */}
        <Card className="border-slate-200 shadow-xs hover:shadow-md transition duration-200 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Consultations
              </span>
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalAppts}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
                  {confirmedAppts} Active
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-600 font-medium">
                  {completedAppts} Completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Providers */}
        <Card className="border-slate-200 shadow-xs hover:shadow-md transition duration-200 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Verified Doctors
              </span>
              <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Stethoscope className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalDoctors}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
                  {availableSlots} Open Slots
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">
                  {slotOccupancyPct}% Booked
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Community */}
        <Card className="border-slate-200 shadow-xs hover:shadow-md transition duration-200 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Registered Patients
              </span>
              <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {totalPatients}
              </div>
              <div className="flex items-center gap-2 mt-2 text-[11px]">
                <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md">
                  {patientDoctorRatio}:1 Patient/Doc
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium">
                  100% Verified
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 3. VISUAL ANALYTICS BREAKDOWN (2 COLUMNS)                 */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointment Status & Lifecycle Breakdown */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Appointment Pipeline & Status
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Lifecycle stage distribution across all patient bookings.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-slate-600">
              {totalAppts} Total
            </Badge>
          </CardHeader>
          <CardContent className="pt-5 space-y-6">
            {/* Visual Multi-segment Progress Bar */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                {confirmedPct > 0 && (
                  <div
                    style={{ width: `${confirmedPct}%` }}
                    className="bg-blue-500 hover:opacity-90 transition-all"
                    title={`Confirmed: ${confirmedAppts} (${confirmedPct}%)`}
                  />
                )}
                {completedPct > 0 && (
                  <div
                    style={{ width: `${completedPct}%` }}
                    className="bg-emerald-500 hover:opacity-90 transition-all"
                    title={`Completed: ${completedAppts} (${completedPct}%)`}
                  />
                )}
                {pendingPct > 0 && (
                  <div
                    style={{ width: `${pendingPct}%` }}
                    className="bg-amber-400 hover:opacity-90 transition-all"
                    title={`Pending Payment: ${pendingAppts} (${pendingPct}%)`}
                  />
                )}
                {cancelledPct > 0 && (
                  <div
                    style={{ width: `${cancelledPct}%` }}
                    className="bg-rose-400 hover:opacity-90 transition-all"
                    title={`Cancelled: ${cancelledAppts} (${cancelledPct}%)`}
                  />
                )}
              </div>
            </div>

            {/* Metric Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-blue-700 mb-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Confirmed
                </div>
                <div className="text-lg font-black text-blue-900">{confirmedAppts}</div>
                <div className="text-[10px] text-blue-600 font-medium">{confirmedPct}% of total</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 mb-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Completed
                </div>
                <div className="text-lg font-black text-emerald-900">{completedAppts}</div>
                <div className="text-[10px] text-emerald-600 font-medium">{completedPct}% of total</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-amber-700 mb-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending
                </div>
                <div className="text-lg font-black text-amber-900">{pendingAppts}</div>
                <div className="text-[10px] text-amber-600 font-medium">{pendingPct}% of total</div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-rose-700 mb-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Cancelled
                </div>
                <div className="text-lg font-black text-rose-900">{cancelledAppts}</div>
                <div className="text-[10px] text-rose-600 font-medium">{cancelledPct}% of total</div>
              </div>
            </div>

            {/* Slot Utilization Overview */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="font-semibold text-slate-700">Doctor Slot Utilization:</span>
              </div>
              <span className="font-bold text-slate-900">
                {bookedSlots} booked / {totalSlots} total ({slotOccupancyPct}%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Financial Health & Razorpay Performance */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Payment Verification & Revenue Health
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Razorpay payment gateway health, volume, and verification rates.
              </p>
            </div>
            <Badge variant="outline" className="text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
              Razorpay Live
            </Badge>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* Top Revenue Overview Strip */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Net Settled Volume
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">
                  ₹{stats?.total_revenue?.toLocaleString("en-IN") ?? 0}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block">
                  Success Rate
                </span>
                <span className="text-xl sm:text-2xl font-black text-teal-300 mt-1 block">
                  {stats?.payment_success_rate ?? 100}%
                </span>
              </div>
            </div>

            {/* Payment Transaction Counters */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Successful
                </div>
                <div className="text-lg font-black text-emerald-600 mt-0.5">
                  {stats?.successful_payments ?? 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Verified orders</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pending
                </div>
                <div className="text-lg font-black text-amber-600 mt-0.5">
                  {stats?.pending_payments ?? 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Checkout open</div>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Failed
                </div>
                <div className="text-lg font-black text-rose-600 mt-0.5">
                  {stats?.failed_payments ?? 0}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Dropped/invalid</div>
              </div>
            </div>

            {/* Operational Quality Assurance */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Average Doctor Consultation Ticket:</span>
              <span className="font-bold text-slate-900">₹{stats?.avg_revenue_per_appt ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 4. CLINICAL SPECIALTIES & ROSTER DISTRIBUTION             */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Specialties */}
        <Card className="border-slate-200 shadow-xs lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Medical Specialties Distribution
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Active clinical departments and specialist coverage.
              </p>
            </div>
            <Link href="/admin/doctors" className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View Providers</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {stats?.specializations && stats.specializations.length > 0 ? (
              <div className="space-y-3">
                {stats.specializations.map((spec) => {
                  const pct = totalDoctors > 0 ? Math.round((spec.count / totalDoctors) * 100) : 0;
                  return (
                    <div key={spec.specialization} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{spec.specialization}</span>
                        <span className="text-slate-500 font-medium">
                          {spec.count} {spec.count === 1 ? "Doctor" : "Doctors"} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-400">
                No doctor specialization metrics recorded yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Operational Insights */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-900">
              Operational Insights
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              High-level capacity & efficiency metrics.
            </p>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Patient Coverage Ratio</span>
                <span className="font-bold text-slate-900">{patientDoctorRatio} : 1</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Healthy clinical ratio for scalable telemedicine triage.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Slot Availability Pool</span>
                <span className="font-bold text-emerald-600">{availableSlots} Open</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Ready for instant patient booking and consultation.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Consultation Fulfillment</span>
                <span className="font-bold text-blue-600">
                  {totalAppts > 0 ? Math.round(((completedAppts + confirmedAppts) / totalAppts) * 100) : 100}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Active & completed bookings over total initiated.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================= */}
      {/* 5. RECENT ACTIVITY TABLES (APPOINTMENTS & TRANSACTIONS)   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments Feed */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Recent Consultations
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest appointments booked across all specialties.
              </p>
            </div>
            <Link
              href="/admin/appointments"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            {stats?.recent_appointments && stats.recent_appointments.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Patient</th>
                    <th className="py-2.5 px-4">Doctor</th>
                    <th className="py-2.5 px-4">Fee</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_appointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">{appt.patient_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">Appt #{appt.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800 block">{appt.doctor_name}</span>
                        <span className="text-[10px] text-slate-400 block">{appt.specialization}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{appt.amount}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={
                            appt.status === "CONFIRMED"
                              ? "success"
                              : appt.status === "COMPLETED"
                              ? "secondary"
                              : appt.status === "PENDING_PAYMENT"
                              ? "warning"
                              : "danger"
                          }
                          className="text-[10px]"
                        >
                          {appt.status === "PENDING_PAYMENT" ? "Pending" : appt.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent appointments found.
              </div>
            )}
          </div>
        </Card>

        {/* Recent Transactions Feed */}
        <Card className="border-slate-200 shadow-xs overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Recent Transactions
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time Razorpay payment verification stream.
              </p>
            </div>
            <Link
              href="/admin/payments"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            {stats?.recent_payments && stats.recent_payments.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Order ID</th>
                    <th className="py-2.5 px-4">Patient</th>
                    <th className="py-2.5 px-4">Amount</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recent_payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {p.razorpay_order_id}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900 block">{p.patient_name}</span>
                        <span className="text-[10px] text-slate-400">Appt #{p.appointment_id}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        ₹{p.amount}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Badge
                          variant={
                            p.status === "SUCCESS"
                              ? "success"
                              : p.status === "PENDING"
                              ? "warning"
                              : "danger"
                          }
                          className="text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No recent payment transactions recorded.
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
