"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShieldCheck, Stethoscope } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import { registerPatient } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

const FIELDS = [
  { name: "first_name", label: "First Name", placeholder: "John", autoComplete: "given-name" },
  { name: "last_name", label: "Last Name", placeholder: "Doe", autoComplete: "family-name" },
  { name: "username", label: "Username", placeholder: "johndoe", autoComplete: "username" },
  { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com", autoComplete: "email" },
  { name: "phone", label: "Phone Number", placeholder: "+91 98765 43210", required: false },
  { name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters", autoComplete: "new-password" },
  { name: "password2", label: "Confirm Password", type: "password", placeholder: "Repeat password", autoComplete: "new-password" },
];

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await registerPatient(values);
    login(data.user);
    router.push("/patient/dashboard");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dff5ef_0,_transparent_38%),linear-gradient(135deg,_#f8fbfa_0%,_#eef8f5_48%,_#ffffff_100%)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
        <div className="hidden lg:block">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5" /> Trusted virtual care
          </div>
          <h1 className="max-w-md text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950">Start your healthier routine today.</h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-600">Create one secure account to find doctors, book consultations, and keep your care journey organized.</p>
          <div className="mt-8 space-y-4 text-sm text-slate-600">
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-teal-600" /> Verified healthcare professionals</div>
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-teal-600" /> Private video consultations</div>
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-teal-600" /> Prescriptions available anytime</div>
          </div>
        </div>

        <div className="w-full max-w-xl justify-self-center">
          <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-2xl shadow-teal-900/10 backdrop-blur sm:p-7 mt-7">

            <AuthForm
              title="Create Patient Account"
              subtitle="Register for free to connect with doctors and book consultations."
              fields={FIELDS}
              submitLabel="Create Account"
              accentColor="teal"
              compact
              onSubmit={handleSubmit}
              footer={
                <>
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline">
                    Sign in
                  </Link>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
