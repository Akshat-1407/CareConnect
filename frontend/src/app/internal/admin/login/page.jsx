"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Lock, Sparkles } from "lucide-react";

import AuthForm from "@/components/ui/AuthForm";
import { loginAdmin } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import AuthRedirectLoader from "@/components/auth/AuthRedirectLoader";
import { Badge } from "@/components/ui/badge";

const FIELDS = [
  {
    name: "username",
    label: "Admin Username",
    placeholder: "admin_username",
    autoComplete: "username",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "••••••••",
    autoComplete: "current-password",
  },
];

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { isAuthenticated, role, loading } = useGuestOnly();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await loginAdmin(values);
    login(data.user);
    router.push("/admin/dashboard");
  };

  // If user is already authenticated with ANY role, show the dynamic redirect loader
  if (isAuthenticated) {
    return <AuthRedirectLoader currentRole={role} />;
  }

  // Session verification on initial mount
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-800" />
      </div>
    );
  }

  return (
    <main className="relative isolate min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 sm:px-6">
      {/* ========================================================= */}
      {/* 1. LIGHT CHECK / GRID PATTERN BACKGROUND                  */}
      {/* ========================================================= */}
      {/* Crisp, subtle geometric check pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_60%,transparent_100%)]"
      />

      {/* Ambient background glows for depth */}
      <div
        aria-hidden="true"
        className="care-float pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-slate-300/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="care-float pointer-events-none absolute -right-20 bottom-10 h-88 w-88 rounded-full bg-teal-200/25 blur-3xl [animation-delay:2s]"
      />

      {/* ========================================================= */}
      {/* 2. ADMIN LOGIN CARD & BRANDING                            */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-400">
        {/* Page Heading Badge & Icon */}
        <div className="mb-6 text-center">
          <div className="mb-3.5 inline-flex items-center justify-center">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-700 text-white shadow-xl shadow-slate-900/15 border border-slate-700/50">
              <ShieldCheck className="h-7 w-7 text-teal-400" />
              <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-teal-500 text-white shadow-xs">
                <Lock className="h-2.5 w-2.5 stroke-[3]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Care<span className="text-teal-600">Connect</span> Admin
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Internal administrative gateway & clinical management
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/90 bg-white/95 p-7 sm:p-9 shadow-2xl shadow-slate-900/10 backdrop-blur-md transition-all duration-200 hover:shadow-slate-900/15">
          <AuthForm
            title="Administrator Access"
            subtitle="Enter your verified credentials to access the admin portal."
            fields={FIELDS}
            submitLabel="Sign In as Admin"
            accentColor="slate"
            onSubmit={handleSubmit}
          />
        </div>

        {/* Security / Restriction Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
          <span className="font-medium text-slate-500">
            Strictly restricted to authorized administrative personnel
          </span>
        </div>
      </div>
    </main>
  );
}