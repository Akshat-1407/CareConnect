"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, UserCheck, Calendar, CreditCard, ShieldCheck, ArrowRight, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminStats } from "@/services/admin";
import AdminNav from "@/components/admin/AdminNav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth("admin", "/internal/admin/login");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    async function loadStats() {
      try {
        setLoading(true);
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [authLoading]);

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

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-2 bg-slate-100 text-slate-700 border-slate-300">
              System Overview
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-slate-800">{user?.username}</span>. Here is the real-time operational status.
            </p>
          </div>
        </div>

        {/* Real-time Metric Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Patients */}
            <Card className="border-slate-200 shadow-sm hover:shadow transition">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Patients
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {stats?.total_patients ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Registered accounts</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Users className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Total Doctors */}
            <Card className="border-slate-200 shadow-sm hover:shadow transition">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Active Doctors
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {stats?.total_doctors ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Verified providers</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <UserCheck className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Card className="border-slate-200 shadow-sm hover:shadow transition">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Appointments
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {stats?.total_appointments ?? 0}
                  </p>
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{stats?.completed_appointments ?? 0} completed</span>
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Calendar className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Payments / Revenue */}
            <Card className="border-slate-200 shadow-sm hover:shadow transition">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Verified Revenue
                  </span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    ₹{stats?.total_revenue?.toLocaleString() ?? 0}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {stats?.total_payments ?? 0} transactions
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <CreditCard className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Portal Management Navigation Cards */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">Platform Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/doctors">
              <Card className="hover:shadow-md transition cursor-pointer border-slate-200 group h-full">
                <CardContent className="p-5 space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition flex items-center justify-between">
                    <span>Doctor Accounts</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Register new doctors, configure specialties, and monitor consultation schedules.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/users">
              <Card className="hover:shadow-md transition cursor-pointer border-slate-200 group h-full">
                <CardContent className="p-5 space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition flex items-center justify-between">
                    <span>Registered Users</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    View patients and account profiles registered across the platform.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/appointments">
              <Card className="hover:shadow-md transition cursor-pointer border-slate-200 group h-full">
                <CardContent className="p-5 space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-600 transition flex items-center justify-between">
                    <span>All Appointments</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review confirmed bookings, pending sessions, and completed consultations.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/payments">
              <Card className="hover:shadow-md transition cursor-pointer border-slate-200 group h-full">
                <CardContent className="p-5 space-y-2">
                  <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition flex items-center justify-between">
                    <span>Payment Transactions</span>
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify Razorpay transaction IDs, booking fees, and confirmation statuses.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
