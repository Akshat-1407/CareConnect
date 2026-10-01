"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Heart, Activity } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DASHBOARD_ROUTES = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

export default function AuthRedirectLoader({
  currentRole = null,
  redirectDelay = 1400,
}) {
  const { role } = useAuth();
  const router = useRouter();

  const activeRole = role || currentRole || "patient";
  const targetDashboard = DASHBOARD_ROUTES[activeRole] || "/";

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(targetDashboard);
    }, redirectDelay);

    return () => clearTimeout(timer);
  }, [redirectDelay, router, targetDashboard]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center overflow-hidden bg-white select-none">
      {/* ========================================================= */}
      {/* 1. LIGHT ANIMATED BACKGROUND (Ambient orbs & radial glow) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft floating background orbs */}
        <div
          aria-hidden="true"
          className="care-float absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="care-float absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-rose-100/30 blur-3xl [animation-delay:2s]"
        />
        <div
          aria-hidden="true"
          className="care-float absolute -bottom-20 left-1/3 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl [animation-delay:4s]"
        />

        {/* Subtle breathing dot mesh */}
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#94a3b8_0.8px,transparent_0.8px)] [background-size:28px_28px]" />
      </div>

      {/* ========================================================= */}
      {/* 2. CENTER CONTENT (Emblem + Dots + Brand Typography)      */}
      {/* ========================================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
        {/* Emblem Container with Expanding Ripple Waves */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Subtle concentric ripple rings */}
          <div className="absolute h-20 w-20 rounded-full bg-rose-400/15 care-ripple pointer-events-none" />
          <div className="absolute h-20 w-20 rounded-full bg-teal-400/15 care-ripple pointer-events-none [animation-delay:1.5s]" />

          {/* Medical Red Cross with Inner Silhouette & 3D Lighting */}
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center drop-shadow-md hover:scale-105 transition-transform duration-300">
            {/* Red Cross Shape */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Horizontal bar */}
              <div className="h-6 sm:h-7 w-14 sm:w-16 bg-gradient-to-b from-rose-500 to-red-600 rounded-md shadow-sm" />
              {/* Vertical bar */}
              <div className="absolute w-6 sm:w-7 h-14 sm:h-16 bg-gradient-to-r from-rose-500 to-red-600 rounded-md shadow-sm" />
            </div>

            {/* Inner Center Circle with Care Icon */}
            <div className="relative z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white shadow-inner flex items-center justify-center text-red-600 border border-red-100/60">
              <Stethoscope className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-red-600 stroke-[2.4]" />
            </div>
          </div>
        </div>

        {/* Modern 4-Dot Animated Wave Loader */}
        <div className="flex items-center justify-center gap-1.5 mb-7">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-300 dot-bounce-1" />
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 dot-bounce-2" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 dot-bounce-3" />
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dot-bounce-4" />
        </div>

        {/* Elegant Letter-Spaced Brand Typography */}
        <div className="space-y-1">
          <h2 className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-slate-800 uppercase pl-1">
            C A R E &nbsp; C O N N E C T
          </h2>
          <p className="text-[10px] font-medium tracking-[0.25em] text-slate-400 uppercase pl-1">
            V I R T U A L &nbsp; C A R E
          </p>
        </div>
      </div>
    </div>
  );
}
