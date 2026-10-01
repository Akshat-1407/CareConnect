"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthRedirectLoader from "@/components/auth/AuthRedirectLoader";

export default function AdminLoginAliasPage() {
  const router = useRouter();
  const { isAuthenticated, role, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated) {
      // Handled by AuthRedirectLoader
      return;
    }
    router.replace("/internal/admin/login");
  }, [isAuthenticated, loading, router]);

  if (isAuthenticated) {
    return <AuthRedirectLoader currentRole={role} />;
  }

  return <AuthRedirectLoader currentRole="admin" />;
}
