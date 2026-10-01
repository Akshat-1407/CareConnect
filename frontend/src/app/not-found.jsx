"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ArrowLeft,
  Search,
  Stethoscope,
  Calendar,
  FileText,
  Activity,
  HeartPulse,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Top Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-bold shadow-2xs mb-6 animate-in fade-in zoom-in-95 duration-500">
          <HeartPulse className="h-3.5 w-3.5 text-teal-600 animate-pulse" />
          <span>Error 404 — Clinical Route Not Found</span>
        </div>

        {/* Large 404 Visual with glowing backdrop */}
        <div className="relative mb-6">
          <div className="text-7xl sm:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-center text-teal-600 rotate-12 hover:rotate-0 transition-transform duration-300">
              <Activity className="h-10 w-10 sm:h-12 sm:w-12 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Headings & Descriptions */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Page Lost in the Medical Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto mb-8 leading-relaxed">
          The requested clinical resource, appointment portal, or consultation link may have been moved or does not exist.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="h-11 rounded-full px-6 text-xs sm:text-sm font-bold border-slate-300 text-slate-700 hover:bg-slate-100 gap-2 shadow-2xs"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </Button>

          <Link href="/">
            <Button className="h-11 rounded-full px-7 text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-600/20 gap-2 transition-all">
              <Home className="h-4 w-4" /> Return to Home
            </Button>
          </Link>
        </div>

        {/* Support hint */}
        <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-1.5">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Need assistance? Contact support or check your active appointments.</span>
        </p>
      </div>
    </div>
  );
}
