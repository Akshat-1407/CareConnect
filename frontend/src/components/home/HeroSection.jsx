"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection({ backendStatus }) {
  return (
    <section className="relative w-full bg-[#FAFAFA] pb-32 lg:pb-40 overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Minimal Backend Status */}
        <div className="mb-5 mt-10 flex items-center gap-4">
          <div className="h-[1px] w-12 bg-slate-300" />
          <div className="text-xs font-medium tracking-widest uppercase text-slate-500">
            {backendStatus.loading ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300 animate-pulse" />
                Connecting to Network
              </span>
            ) : backendStatus.connected ? (
              <span className="flex items-center gap-2 text-slate-700">
                <span className="h-2 w-2 rounded-full bg-teal-600" />
                System Operational
              </span>
            ) : (
              <span className="flex items-center gap-2 text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                System Offline
              </span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-medium text-slate-900 tracking-tight leading-[1.05]">
              Care, <br className="hidden sm:block" />
              without the commute.
            </h1>
            <p className="mt-8 text-lg sm:text-xl text-slate-600 font-light leading-relaxed max-w-xl">
              Connect with board-certified specialists and receive digital prescriptions from your home. A simpler, more intentional approach to modern telemedicine.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-6">
              <Link href="/patient/doctors" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto h-14 px-8 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium tracking-wide transition-colors">
                  Find a Specialist
                </button>
              </Link>
              <Link href="/doctor/login" className="group flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-teal-700 transition-colors">
                <span>Access Provider Portal</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-12 lg:mt-0 lg:ml-8">
            {/* An editorial, asymmetric visual element instead of a SaaS dashboard */}
            <div className="relative w-full aspect-[4/5] bg-slate-100 p-8 flex flex-col justify-between shadow-sm">
              <div className="w-full h-full border border-slate-200/60 relative bg-white/60 backdrop-blur-md p-8 flex flex-col">
                  <div className="space-y-8">
                    <div className="h-px w-full bg-slate-200" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Next Available</span>
                      <span className="text-sm font-medium text-slate-900">Today, 2:30 PM</span>
                    </div>
                    <div className="h-px w-full bg-slate-200" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Consultation</span>
                      <span className="text-sm font-medium text-slate-900">Encrypted Video</span>
                    </div>
                    <div className="h-px w-full bg-slate-200" />
                  </div>
                  <div className="mt-auto">
                    <p className="text-2xl font-serif text-slate-800 italic leading-snug">&quot;Quality care should be uninterrupted.&quot;</p>
                  </div>
              </div>
              {/* Subtle offset block */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-900/5 -z-10" />
              {/* Subtle accent square */}
              <div className="absolute top-8 right-8 w-3 h-3 bg-teal-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
