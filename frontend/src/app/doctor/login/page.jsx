"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import { loginDoctor } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import AuthRedirectLoader from "@/components/auth/AuthRedirectLoader";

const FIELDS = [
  { name: "username", label: "Username", placeholder: "doctor_username", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "current-password" },
];

export default function DoctorLoginPage() {
  const { login } = useAuth();
  const { isAuthenticated, role, loading } = useGuestOnly();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await loginDoctor(values);
    login(data.user);
    router.push("/doctor/dashboard");
  };

  // If user is already authenticated with ANY role, show the dynamic redirect loader
  if (isAuthenticated) {
    return <AuthRedirectLoader currentRole={role} />;
  }

  // Session verification on initial mount
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,_#f8fbff_0%,_#eef8f5_52%,_#ffffff_100%)] px-4 py-12 sm:px-6">
      {/* ========================================================= */}
      {/* 1. DOTTED PATTERN BACKGROUND WITH RADIAL MASK FADE        */}
      {/* ========================================================= */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.45] [background-image:radial-gradient(#2563eb_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_50%,#000_55%,transparent_100%)]"
      />

      {/* Floating ambient glow orbs */}
      <div
        aria-hidden="true"
        className="care-float pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-teal-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="care-float pointer-events-none absolute -right-28 bottom-0 h-88 w-88 rounded-full bg-blue-200/40 blur-3xl [animation-delay:1.5s]"
      />

      {/* ========================================================= */}
      {/* 2. DOCTOR LOGIN CARD                                      */}
      {/* ========================================================= */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-400">
        <div className="rounded-3xl border border-white/90 bg-white/95 p-7 sm:p-9 shadow-2xl shadow-slate-900/10 backdrop-blur-sm transition-all duration-300 hover:shadow-blue-900/15">
          <AuthForm
            title="Doctor Portal"
            subtitle="Access your appointments, availability, and patient consultations."
            fields={FIELDS}
            submitLabel="Sign In to Doctor Portal"
            accentColor="blue"
            onSubmit={handleSubmit}
            footer={
              <>
                Patient?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                >
                  Sign in here
                </Link>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
