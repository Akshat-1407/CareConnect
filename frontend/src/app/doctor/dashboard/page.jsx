"use client";

import { useState, useEffect } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loader2, Calendar, Clock, FileText, Stethoscope, ArrowRight, ShieldCheck, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDoctorAppointments } from "@/services/appointments";

export default function DoctorDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth("doctor", "/doctor/login");
  const [appointments, setAppointments] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const fetchData = async () => {
        try {
          const data = await getDoctorAppointments({ status: "CONFIRMED" });
          // Sort appointments by start_time
          const sorted = (data || []).sort((a, b) => new Date(a.slot.start_time) - new Date(b.slot.start_time));
          setAppointments(sorted.slice(0, 3)); // Just show top 3 upcoming
        } catch (err) {
          console.error("Failed to fetch appointments:", err);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-teal-600" />
        <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading workspace...</span>
      </div>
    );
  }

  const quickLinks = [
    {
      href: "/doctor/availability",
      icon: Clock,
      label: "Manage Schedule",
      desc: "Adjust your available time slots.",
      color: "teal"
    },
    {
      href: "/doctor/appointments",
      icon: Calendar,
      label: "All Appointments",
      desc: "View complete patient roster.",
      color: "blue"
    },
    {
      href: "/doctor/prescriptions",
      icon: FileText,
      label: "Prescriptions Hub",
      desc: "Issue digital prescriptions.",
      color: "emerald"
    },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      
      {/* 1. Header & Profile Banner */}
      <div className="mb-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-inner shrink-0">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome back, Dr. {user?.last_name || user?.username}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-sm text-slate-500 font-medium">
                {user?.email}
              </span>
              <span className="hidden sm:inline-block text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                <ShieldCheck className="h-3 w-3" />
                Verified Provider
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
          <Link href="/doctor/availability">
            <Button className="rounded-full shadow-xs bg-teal-600 hover:bg-teal-700 text-white font-bold h-11 px-6 transition-all">
              Update Availability
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content Area: Upcoming Consultations */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upcoming Consultations</h2>
              <p className="text-xs text-slate-500 mt-0.5">Your confirmed appointments for today and the near future.</p>
            </div>
            <Link href="/doctor/appointments" className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loadingData ? (
              <div className="flex flex-col items-center justify-center py-10 space-y-3">
                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Loading schedule...</span>
              </div>
            ) : appointments.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {appointments.map((appt) => (
                  <li key={appt.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{appt.patient_name}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(appt.slot.start_time).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(appt.slot.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <Link href={`/doctor/appointments`}>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 rounded-full text-xs font-bold text-teal-700 border-teal-200 hover:bg-teal-50">
                          Prepare
                        </Button>
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">No Upcoming Appointments</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  You don't have any confirmed consultations lined up. Make sure your availability is up to date.
                </p>
                <Link href="/doctor/availability">
                  <Button variant="outline" size="sm" className="mt-4 rounded-full text-xs font-bold text-slate-700">
                    Manage Schedule
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quick Actions</h2>
            <p className="text-xs text-slate-500 mt-0.5">Manage your practice and records.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {quickLinks.map(({ href, icon: Icon, label, desc, color }) => {
              const styles = colorMap[color];
              return (
                <Link key={href} href={href} className="block">
                  <div className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${styles.bg} ${styles.text} ${styles.border}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {label}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium line-clamp-1">
                          {desc}
                        </p>
                      </div>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-slate-300 transform group-hover:translate-x-1 group-hover:text-teal-600 transition-all shrink-0 ml-3" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Telehealth Guidelines */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-slate-500" />
              Telehealth Guidelines
            </h3>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-teal-600 text-lg leading-none">•</span>
                Join the consultation room 5 minutes prior to the start time.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-teal-600 text-lg leading-none">•</span>
                Ensure a professional, quiet environment for patient privacy.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-teal-600 text-lg leading-none">•</span>
                Draft prescriptions directly in the Prescriptions Hub post-call.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
