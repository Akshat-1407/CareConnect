"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

import AuthForm from "@/components/ui/AuthForm";
import { loginAdmin } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import AuthRedirectLoader from "@/components/auth/AuthRedirectLoader";

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
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Page heading */}
          <div className="mb-7 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm">
                <ShieldCheck className="h-6 w-6" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              CareConnect Admin
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access the administration dashboard
            </p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-md sm:p-8">
            <AuthForm
              title="Administrator Access"
              subtitle="Enter your admin credentials to continue."
              fields={FIELDS}
              submitLabel="Sign In"
              accentColor="slate"
              onSubmit={handleSubmit}
            />
          </div>

          {/* Security note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5" />

            <span>
              Restricted to authorised administrators
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}