"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Care<span className="text-teal-600">Connect</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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
                <Link href="/register" className="font-medium text-teal-600 hover:underline">
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
