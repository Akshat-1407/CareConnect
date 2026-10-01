"use client";

import { useAuth } from "@/context/AuthContext";

/**
 * Hook to protect guest/unauthenticated pages (like Login & Register).
 * Returns authentication status and user details to conditionally render
 * the AuthRedirectLoader if an active session is detected.
 */
export function useGuestOnly() {
  const { user, loading, isAuthenticated, role, logout } = useAuth();

  return {
    user,
    loading,
    isAuthenticated,
    role,
    logout,
  };
}
