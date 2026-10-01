"use client";

import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="bg-slate-900 py-32 sm:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-medium text-white tracking-tight leading-tight">
          Ready to begin?
        </h2>
        <p className="mt-8 text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
          Create your account today and experience healthcare on your terms.
        </p>
        <div className="mt-14 flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/register">
            <button className="w-full sm:w-auto h-14 px-8 bg-white text-slate-900 text-sm font-medium tracking-wide hover:bg-slate-100 transition-colors">
              Create an Account
            </button>
          </Link>
          <Link href="/patient/doctors">
            <button className="w-full sm:w-auto h-14 px-8 border border-slate-700 text-white text-sm font-medium tracking-wide hover:border-slate-500 transition-colors">
              Browse Directory
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
