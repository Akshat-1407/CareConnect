"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Stethoscope } from "lucide-react";
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
            title="Create Patient Account"
            subtitle="Register for free to connect with doctors and book consultations."
            fields={FIELDS}
            submitLabel="Create Account"
            accentColor="teal"
            onSubmit={handleSubmit}
            footer={
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-teal-600 hover:underline">
                  Sign in
                </Link>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}
