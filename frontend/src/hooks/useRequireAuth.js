"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ROLE_REDIRECTS = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

/**
 * Hook to protect a page. Redirects to `redirectTo` if user is not
 * authenticated or does not have the required `role`.
 *
 * @param {string|null} role - required role ('patient' | 'doctor' | 'admin' | null for any)
 * @param {string} redirectTo - where to redirect if unauthenticated
 */
export function useRequireAuth(role = null, redirectTo = "/login") {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAuthorized = Boolean(isAuthenticated && (!role || user?.role === role));

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (role && user?.role !== role) {
      // Redirect to the user's appropriate portal
      const destination = ROLE_REDIRECTS[user.role] || "/";
      router.replace(destination);
    }
  }, [loading, isAuthenticated, user, role, router, redirectTo]);

  return {
    user,
    // Keep loading true while redirecting unauthorized users so they don't fire 403 API calls
    loading: loading || !isAuthorized,
    isAuthenticated,
    isAuthorized,
  };
}
