"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to protect a page. Redirects to `redirectTo` if user is not
 * authenticated or does not have the required `role`.
 *
 * @param {string|null} role - required role ('patient' | 'doctor' | 'admin' | null for any)
 * @param {string} redirectTo - where to redirect if check fails
 */
export function useRequireAuth(role = null, redirectTo = "/login") {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (role && user?.role !== role) {
      // Redirect to the correct portal
      const roleRedirects = {
        patient: "/patient/dashboard",
        doctor: "/doctor/dashboard",
        admin: "/admin/dashboard",
      };
      router.replace(roleRedirects[user.role] ?? "/");
    }
  }, [loading, isAuthenticated, user, role, router, redirectTo]);

  return { user, loading };
}
