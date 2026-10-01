"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, HeartPulse, User } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import { loginPatient } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import AuthRedirectLoader from "@/components/auth/AuthRedirectLoader";

const FIELDS = [
  { name: "username", label: "Username", placeholder: "your_username", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "current-password" },
];

export default function PatientLoginPage() {
  const { login } = useAuth();
  const { isAuthenticated, role, loading } = useGuestOnly();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await loginPatient(values);
    login(data.user);
    router.push("/patient/dashboard");
  };

  // If user is already authenticated with ANY role, show the dynamic redirect loader
  if (isAuthenticated) {
    return <AuthRedirectLoader currentRole={role} />;
  }

  // Session verification on initial mount
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,_#f8fbfa_0%,_#eef8f5_52%,_#ffffff_100%)] px-4 py-12 sm:px-6">
      {/* ========================================================= */}
      {/* 1. DOTTED PATTERN BACKGROUND WITH RADIAL MASK FADE        */}
      {/* ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(#0d9488_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_55%,transparent_100%)]"
      />

      {/* Floating ambient glow orbs */}
      <div
        aria-hidden="true"
        className="care-float pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="care-float pointer-events-none absolute -right-28 bottom-0 h-88 w-88 rounded-full bg-emerald-200/40 blur-3xl [animation-delay:1.5s]"
      />

      {/* ========================================================= */}
      {/* 2. PATIENT LOGIN CARD                                     */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-400">
        <div className="rounded-3xl border border-white/90 bg-white/95 p-7 sm:p-9 shadow-2xl shadow-teal-900/10 backdrop-blur-md transition-all duration-300 hover:shadow-teal-900/15">
          <AuthForm
            title="Patient Sign In"
            subtitle="Welcome back. Access your appointments and consultations."
            fields={FIELDS}
            submitLabel="Sign In"
            accentColor="teal"
            onSubmit={handleSubmit}
            footer={
              <>
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-teal-600 transition-colors hover:text-teal-700 hover:underline"
                >
                  Register here
                </Link>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
