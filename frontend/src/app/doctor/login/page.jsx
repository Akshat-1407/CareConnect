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
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Care<span className="text-blue-600">Connect</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
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
