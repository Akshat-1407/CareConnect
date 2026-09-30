"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Stethoscope, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const DASHBOARD_ROUTES = {
  patient: "/patient/dashboard",
  doctor: "/doctor/dashboard",
  admin: "/admin/dashboard",
};

export default function Navbar() {
  const { user, isAuthenticated, role, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/internal/admin")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white backdrop-blur">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Care<span className="text-teal-600">Connect</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          {loading ? (
            <div className="h-8 w-32 animate-pulse rounded-md bg-slate-100" />
          ) : isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-slate-600">
                {user?.first_name || user?.username}
              </span>
              <Link href={DASHBOARD_ROUTES[role] ?? "/"}>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-slate-600">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Patient Login</Button>
              </Link>
              <Link href="/doctor/login">
                <Button variant="outline" size="sm">Doctor Portal</Button>
              </Link>
              <Link href="/register">
                <Button variant="default" size="sm">Register</Button>
              </Link>
              {/* Admin login is intentionally NOT linked from here */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
