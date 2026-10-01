"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  ShieldCheck,
  Video,
  Lock,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  Calendar,
  FileText,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const pathname = usePathname();

  // Strictly hide Footer on internal admin portal routes
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/internal/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200/80 bg-slate-900 text-slate-300">
      {/* ========================================================= */}
      {/* 1. MAIN FOOTER CONTENT                                    */}
      {/* ========================================================= */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Col 1 & 2: Brand & Platform Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 text-slate-950 font-bold shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform duration-200">
                <Stethoscope className="h-5 w-5 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  Care<span className="text-teal-400">Connect</span>
                </span>
                <span className="text-[10px] font-bold text-teal-400/80 tracking-wider uppercase mt-0.5">
                  VirtualCare Telemedicine
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Seamless virtual healthcare consultations connecting patients with verified medical specialists. Real-time WebRTC video calls, verified payment checkout, and secure electronic prescriptions.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                HIPAA-Conscious Architecture
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live WebRTC & API
              </span>
            </div>
          </div>

          {/* Col 3: For Patients */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Patient Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/patient/doctors" className="text-slate-400 hover:text-teal-400 transition">
                  Browse Specialists
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-teal-400 transition">
                  Patient Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-slate-400 hover:text-teal-400 transition">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/patient/appointments" className="text-slate-400 hover:text-teal-400 transition">
                  Consultation History
                </Link>
              </li>
              <li>
                <Link href="/patient/prescriptions" className="text-slate-400 hover:text-teal-400 transition">
                  Digital Prescriptions
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: For Doctors */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Doctor Portal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/doctor/login" className="text-slate-400 hover:text-teal-400 transition">
                  Doctor Portal Login
                </Link>
              </li>
              <li>
                <Link href="/doctor/dashboard" className="text-slate-400 hover:text-teal-400 transition">
                  Provider Dashboard
                </Link>
              </li>
              <li>
                <Link href="/doctor/availability" className="text-slate-400 hover:text-teal-400 transition">
                  Schedule & Slot Manager
                </Link>
              </li>
              <li>
                <Link href="/doctor/appointments" className="text-slate-400 hover:text-teal-400 transition">
                  Assigned Consultations
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Security & Stack */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Security & Stack
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5 text-teal-400" />
                <span>WebRTC 1-on-1 Video</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-teal-400" />
                <span>HttpOnly JWT Cookies</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-teal-400" />
                <span>Razorpay Test Gateway</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                <span>Django & MySQL Database</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. BOTTOM COPYRIGHT & DISCLAIMER BAR                      */}
        {/* ========================================================= */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} CareConnect Telemedicine Platform. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">
              VirtualCare Telemedicine MVP
            </span>
            <span>•</span>
            <span className="text-teal-400/90 font-mono">
              Fast, Private, Direct
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
