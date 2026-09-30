"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  Users,
  Calendar,
  CreditCard,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Overview & metrics" },
  { href: "/admin/doctors", label: "Doctors", icon: UserCheck, desc: "Providers & slots" },
  { href: "/admin/users", label: "Users", icon: Users, desc: "Patients & accounts" },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar, desc: "Booking records" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, desc: "Razorpay history" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/internal/admin/login");
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP LEFT SIDEBAR (Fixed left side, full height)    */}
      {/* ========================================================= */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-50 bg-slate-900 border-r border-slate-800 text-slate-300">
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="h-10 w-10 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold shadow-sm shadow-teal-500/10 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-white leading-none">
              CareConnect
            </span>
            <span className="text-[11px] font-bold text-teal-400 tracking-wider uppercase mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-6 space-y-6">
          <div className="space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Platform Management
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-teal-500/15 text-teal-300 border border-teal-500/30 shadow-sm shadow-teal-500/10"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Sign Out Footer */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <div className="h-9 w-9 rounded-lg bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-xs border border-teal-500/30 shrink-0">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-slate-100 block truncate">
                  {user?.username || "Administrator"}
                </span>
                <span className="text-[10px] text-teal-400/90 font-medium block">
                  Root Admin
                </span>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full justify-center gap-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/20 hover:bg-rose-950/40 border-rose-900/40 h-9 rounded-xl transition"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE TOP BAR (Visible on screens < lg)               */}
      {/* ========================================================= */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-teal-500/20 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white">CareConnect</span>
              <span className="ml-1 text-[10px] font-bold text-teal-400 uppercase">Admin</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="pt-4 pb-2 space-y-2 border-t border-slate-800 mt-3 animate-in slide-in-from-top-2 duration-150">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
                    isActive
                      ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-mono">@{user?.username}</span>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="ghost"
                className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 h-8 gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
