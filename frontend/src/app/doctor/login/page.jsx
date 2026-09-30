"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import { loginDoctor } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

const FIELDS = [
  { name: "username", label: "Username", placeholder: "doctor_username", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "current-password" },
];

export default function DoctorLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await loginDoctor(values);
    login(data.user);
    router.push("/doctor/dashboard");
  };

  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,_#f8fbff_0%,_#eef8f5_52%,_#ffffff_100%)] px-4 py-12">
      <div aria-hidden="true" className="care-float pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-200/35 blur-3xl" />
      <div aria-hidden="true" className="care-float pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-blue-200/35 blur-3xl [animation-delay:1.5s]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#0f766e_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
      <div className="relative w-full max-w-md">

        <div className="care-enter rounded-3xl border border-white/80 bg-white/90 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-sm transition-shadow duration-300 hover:shadow-blue-900/15">
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
                <Link href="/login" className="font-medium text-blue-600 hover:underline">
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
