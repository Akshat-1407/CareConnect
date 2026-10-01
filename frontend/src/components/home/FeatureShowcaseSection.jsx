"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeatureShowcaseSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-32">
        
        {/* Block 1: Patient Side */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
             <div className="w-full max-w-md aspect-square bg-white border border-slate-200 p-8 sm:p-12 flex flex-col justify-center space-y-8 relative shadow-sm">
               <div className="w-3 h-3 bg-teal-600 absolute top-10 left-10" />
               <div>
                 <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">Direct Access</p>
                 <p className="text-2xl font-light text-slate-900 leading-snug">&quot;Finding a specialist took minutes, not months. The video quality was exceptional.&quot;</p>
               </div>
               <div className="h-px w-16 bg-slate-300" />
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight mb-8">Designed for Patients</h2>
            <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
              <p>
                We removed the friction from healthcare. No waiting rooms, no complex scheduling, and no hidden fees.
              </p>
              <p>
                CareConnect allows you to browse specialized practitioners, book appointments instantly, and consult via secure, peer-to-peer video—all within your browser. 
                Your medical history and prescriptions are stored safely and accessible whenever you need them.
              </p>
            </div>
            <Link href="/patient/doctors" className="inline-flex items-center gap-2 mt-10 text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors">
              <span className="underline underline-offset-4 decoration-teal-200 hover:decoration-teal-700 transition-colors">View Specialists</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Block 2: Doctor Side */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
           <div className="lg:pr-8">
            <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight mb-8">Built for Providers</h2>
            <div className="space-y-6 text-lg text-slate-600 font-light leading-relaxed">
              <p>
                Manage your digital practice without the administrative overhead. We handle the infrastructure so you can focus on patient care.
              </p>
              <p>
                Set your own schedule with our flexible availability manager. Conduct consultations seamlessly, and use our integrated prescription drawer to issue detailed digital Rx directly to your patient&apos;s portal.
              </p>
            </div>
            <Link href="/doctor/login" className="inline-flex items-center gap-2 mt-10 text-sm font-medium text-teal-700 hover:text-teal-900 transition-colors">
              <span className="underline underline-offset-4 decoration-teal-200 hover:decoration-teal-700 transition-colors">Provider Login</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end">
             <div className="w-full max-w-md aspect-[4/3] bg-slate-900 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden shadow-md">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-full opacity-50" />
               <div className="relative z-10 space-y-6">
                 <div className="h-px w-full bg-slate-700" />
                 <div className="flex justify-between text-slate-400 text-xs uppercase tracking-widest font-medium">
                   <span>Consultation #8492</span>
                   <span className="text-emerald-400">Active</span>
                 </div>
                 <div className="h-px w-full bg-slate-700" />
                 <div className="pt-8">
                   <p className="text-white text-xl font-medium">Digital Prescription builder ready.</p>
                   <p className="text-slate-400 text-sm mt-3 font-light leading-relaxed">Securely issuing medication to patient record...</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}
