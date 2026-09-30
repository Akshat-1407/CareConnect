"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/ui/AuthForm";
import { loginPatient } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

const FIELDS = [
  { name: "username", label: "Username", placeholder: "your_username", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "current-password" },
];


export default function PatientLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await loginPatient(values);
    login(data.user);
    router.push("/patient/dashboard");
  };

  return (
    <div className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-[linear-gradient(135deg,_#f8fbfa_0%,_#eef8f5_52%,_#ffffff_100%)] px-4 py-12 sm:px-6">
      <div aria-hidden="true" className="care-float pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-200/35 blur-3xl" />
      <div aria-hidden="true" className="care-float pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-emerald-200/35 blur-3xl [animation-delay:1.5s]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#0f766e_0.7px,transparent_0.7px)] [background-size:24px_24px]" />
      <div className="relative w-full max-w-md">
        <div className="care-enter rounded-3xl border border-white/80 bg-white/90 p-7 shadow-2xl shadow-teal-900/10 backdrop-blur-sm transition-shadow duration-300 hover:shadow-teal-900/15 sm:p-9">
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
                  <Link href="/register" className="font-medium text-teal-600 transition-colors hover:text-teal-700 hover:underline">
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
