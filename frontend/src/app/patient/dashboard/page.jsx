"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Loader2, User, Calendar, FileText, CreditCard, Stethoscope, ArrowRight, ShieldCheck, Video, Wifi, Headphones, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PatientDashboardPage() {
  const { user, loading } = useRequireAuth("patient", "/login");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <Loader2 className="h-7 w-7 animate-spin text-teal-600" />
        <span className="text-sm font-semibold text-slate-500 animate-pulse">Loading workspace...</span>
      </div>
    );
  }

  const quickLinks = [
    {
      href: "/patient/doctors",
      icon: Stethoscope,
      label: "Find a Specialist",
      desc: "Browse our network of verified healthcare professionals and book a consultation.",
      color: "teal"
    },
    {
      href: "/patient/appointments",
      icon: Calendar,
      label: "My Appointments",
      desc: "Manage your upcoming visits and review past consultation history.",
      color: "blue"
    },
    {
      href: "/patient/prescriptions",
      icon: FileText,
      label: "Prescriptions",
      desc: "Access your digital prescriptions and doctor's medical notes instantly.",
      color: "emerald"
    },
    {
      href: "/patient/payments",
      icon: CreditCard,
      label: "Payment History",
      desc: "Review your secure transaction records and consultation fees.",
      color: "amber"
    },
  ];

  const colorMap = {
    teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-100" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 sm:py-12 animate-in fade-in duration-300">
      
      {/* 1. Header & Profile Banner */}
      <div className="mb-10 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-6 sm:p-8">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-inner shrink-0">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Welcome back, {user?.first_name || user?.username}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-sm text-slate-500 font-medium">
                {user?.email}
              </span>
              <span className="hidden sm:inline-block text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                <ShieldCheck className="h-3 w-3" />
                Verified Patient
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
          <Link href="/patient/doctors">
            <Button className="rounded-full shadow-xs bg-teal-600 hover:bg-teal-700 text-white font-bold h-11 px-6 transition-all">
              Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Quick Links Area */}
        <div className="lg:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Your Portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">Quickly access and manage your healthcare records.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map(({ href, icon: Icon, label, desc, color }) => {
              const styles = colorMap[color];
              return (
                <Link key={href} href={href} className="block h-full">
                  <div className="group relative h-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-teal-200 transition-all duration-200 flex flex-col justify-between">
                    <div>
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 border ${styles.bg} ${styles.text} ${styles.border}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {label}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">
                        {desc}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-teal-600 transition-colors">
                      <span>Access</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Sidebar Mini-Widgets */}
        <div className="lg:col-span-4 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Telehealth Guide</h2>
            <p className="text-xs text-slate-500 mt-0.5">Prepare for your video consultation.</p>
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Video className="w-4 h-4 text-teal-600" />
              Before Your Visit
            </h3>
            
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                  <Wifi className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Check Connection</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Ensure you have a stable Wi-Fi or cellular connection to prevent video drops.</p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                  <Headphones className="w-3 h-3 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Audio Setup</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Use headphones or earbuds to minimize background noise and echo.</p>
                </div>
              </li>
              
              <li className="flex gap-3">
                <div className="mt-0.5 h-6 w-6 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <Sun className="w-3 h-3 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Environment</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Sit in a well-lit, quiet room with the light source facing you directly.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
              <FileText className="w-4 h-4 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Have records ready</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">Keep your previous prescriptions or test reports nearby.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
