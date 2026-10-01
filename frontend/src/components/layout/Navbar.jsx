"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Stethoscope,
  LogOut,
  LayoutDashboard,
  Calendar,
  FileText,
  User,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    router.push("/login");
  };

  // Strictly hide Navbar on internal admin portal routes (placed AFTER all hooks)
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/internal/admin")) {
    return null;
  }

  return (
    <header
      className={`sticky z-50 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        scrolled
          ? "top-3 sm:top-5 px-4 sm:px-6 lg:px-8 pointer-events-none"
          : "top-0 px-0 bg-white/85 backdrop-blur-md border-b border-slate-200/80 pointer-events-auto shadow-2xs"
      }`}
    >
      {/* ========================================================= */}
      {/* NAVBAR CONTAINER (Smooth morph from Flush to Floating)    */}
      {/* ========================================================= */}
      <div
        className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "pointer-events-auto mx-auto max-w-7xl rounded-full border border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(15,23,42,0.15),0_8px_20px_rgba(15,23,42,0.08)] px-6 sm:px-8 ring-1 ring-slate-900/10"
            : "w-full px-6 sm:px-10 lg:px-12 shadow-none"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            scrolled ? "h-18 sm:h-20" : "h-22 sm:h-24"
          }`}
        >
          {/* ======================================================= */}
          {/* 1. LEFT: BRAND LOGO                                     */}
          {/* ======================================================= */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div
              className={`flex items-center justify-center rounded-2xl bg-linear-to-tr from-teal-600 via-teal-500 to-emerald-500 text-white shadow-md shadow-teal-500/25 group-hover:scale-105 group-hover:shadow-teal-500/35 transition-all duration-300 ${
                scrolled ? "h-11 w-11" : "h-13 w-13"
              }`}
            >
              <Stethoscope className={`${scrolled ? "h-5.5 w-5.5" : "h-6.5 w-6.5"}`} />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-black tracking-tight text-slate-900 leading-none transition-all duration-300 ${
                  scrolled ? "text-xl sm:text-2xl" : "text-2xl sm:text-[1.7rem]"
                }`}
              >
                Care<span className="text-teal-600">Connect</span>
              </span>
              <span className="text-[11px] font-extrabold text-teal-700/80 tracking-wider uppercase mt-1">
                VirtualCare Telemedicine
              </span>
            </div>
          </Link>

          {/* ======================================================= */}
          {/* 2. CENTER: HORIZONTAL NAVIGATION LINKS                  */}
          {/* ======================================================= */}
          <nav className="hidden xl:flex items-center gap-2 lg:gap-3">
            {/* Authenticated Patient Links */}
            {isAuthenticated && role === "patient" && (
              <>
                <Link
                  href="/patient/doctors"
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    pathname === "/patient/doctors"
                      ? "bg-teal-50 text-teal-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  Find Doctors
                </Link>
                <Link
                  href="/patient/appointments"
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    pathname === "/patient/appointments"
                      ? "bg-teal-50 text-teal-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  Appointments
                </Link>
                <Link
                  href="/patient/prescriptions"
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    pathname === "/patient/prescriptions"
                      ? "bg-teal-50 text-teal-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  Prescriptions
                </Link>
              </>
            )}

            {/* Authenticated Doctor Links */}
            {isAuthenticated && role === "doctor" && (
              <>
                <Link
                  href="/doctor/availability"
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    pathname === "/doctor/availability"
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  Manage Schedule
                </Link>
                <Link
                  href="/doctor/appointments"
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    pathname === "/doctor/appointments"
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  Appointments
                </Link>
                <Link
                  href="/doctor/prescriptions"
                  className={`px-4.5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                    pathname?.startsWith("/doctor/prescriptions")
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  Prescriptions
                </Link>
              </>
            )}

            {/* Public Unauthenticated Links */}
            {!isAuthenticated && (
              <>
                <Link
                  href="/patient/doctors"
                  className="px-4.5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
                >
                  Find Specialists
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-4.5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all duration-200"
                >
                  How It Works
                </Link>
              </>
            )}
          </nav>

          {/* ======================================================= */}
          {/* 3. RIGHT: CTA PILL BUTTONS & USER STATUS                */}
          {/* ======================================================= */}
          <div className="hidden xl:flex items-center gap-3">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-full bg-slate-100" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Pill */}
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100/90 border border-slate-200 shadow-2xs">
                  <div className="h-7 w-7 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-black text-slate-900 max-w-32.5 truncate">
                    {user?.first_name ? `${user.first_name}` : user?.username}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-2 py-0.5 uppercase font-black rounded-full ${
                      role === "doctor"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-teal-50 text-teal-700 border-teal-200"
                    }`}
                  >
                    {role}
                  </Badge>
                </div>

                {/* Dashboard CTA Pill */}
                <Link href={DASHBOARD_ROUTES[role] ?? "/"}>
                  <Button
                    size="sm"
                    className="h-10 sm:h-11 rounded-full px-5.5 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/20 hover:shadow-md transition-all gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                {/* Sign Out Icon Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-10 w-10 p-0 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 sm:h-11 rounded-full px-4.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    Patient Login
                  </Button>
                </Link>
                <Link href="/doctor/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-10 sm:h-11 rounded-full px-4.5 text-xs font-bold border-slate-300 text-slate-800 hover:bg-slate-50 transition-all shadow-2xs"
                  >
                    Doctor Portal
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="h-10 sm:h-11 rounded-full px-6 text-xs font-black bg-teal-600 hover:bg-teal-700 text-white shadow-sm shadow-teal-600/25 hover:shadow-md transition-all"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* 4. MOBILE: HAMBURGER TOGGLE BUTTON                      */}
          {/* ======================================================= */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-11 w-11 items-center justify-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. MOBILE DROPDOWN CARD                                   */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto mx-auto mt-2.5 max-w-7xl rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-5 shadow-2xl shadow-slate-900/10 xl:hidden animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          {isAuthenticated ? (
            <div className="space-y-3">
              {/* Mobile User Header */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="h-11 w-11 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user?.first_name?.[0] || user?.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">
                    {user?.first_name ? `${user.first_name} ${user.last_name || ""}` : user?.username}
                  </span>
                  <span className="text-xs text-slate-500 capitalize">{role} Account</span>
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link
                  href={DASHBOARD_ROUTES[role] ?? "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4 text-teal-600" />
                    <span>Dashboard</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                {role === "patient" && (
                  <>
                    <Link
                      href="/patient/doctors"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Stethoscope className="h-4 w-4 text-teal-600" />
                        <span>Find Doctors</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/patient/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-teal-600" />
                        <span>My Appointments</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/patient/prescriptions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-teal-600" />
                        <span>My Prescriptions</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </>
                )}

                {role === "doctor" && (
                  <>
                    <Link
                      href="/doctor/availability"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Manage Schedule</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/doctor/appointments"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span>Doctor Appointments</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                    <Link
                      href="/doctor/prescriptions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span>Prescriptions Hub</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </Link>
                  </>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full justify-center gap-2 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 h-11 rounded-2xl transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/patient/doctors"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                <span>Browse Specialists</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-slate-800 hover:bg-slate-50 transition"
              >
                <span>How It Works</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full text-xs font-bold h-11 rounded-2xl">
                    Patient Login
                  </Button>
                </Link>
                <Link href="/doctor/login" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="outline" className="w-full text-xs font-bold h-11 rounded-2xl">
                    Doctor Portal Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-xs h-11 rounded-2xl shadow-xs">
                    Register New Account
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
