"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import AuthForm from "@/components/ui/AuthForm";
import { loginAdmin } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";

const FIELDS = [
  { name: "username", label: "Admin Username", placeholder: "admin_username", autoComplete: "username" },
  { name: "password", label: "Password", type: "password", placeholder: "••••••••", autoComplete: "current-password" },
];

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (values) => {
    const data = await loginAdmin(values);
    login(data.user);
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-slate-700 flex items-center justify-center text-white shadow">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              CareConnect <span className="text-slate-500 font-normal text-base">Admin</span>
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <AuthForm
            title="Administrator Access"
            subtitle="This portal is restricted to authorised administrators only."
            fields={FIELDS}
            submitLabel="Sign In"
            accentColor="slate"
            onSubmit={handleSubmit}
          />
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Restricted access. Unauthorised attempts are logged.
        </p>
      </div>
    </div>
  );
}
