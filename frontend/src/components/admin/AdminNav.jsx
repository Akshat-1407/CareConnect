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

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/doctors", label: "Doctors", icon: UserCheck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
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
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-50 bg-slate-950 border-r border-slate-900 selection:bg-teal-500/30">
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-8 border-b border-slate-900 bg-slate-950">
          <div className="h-8 w-8 rounded bg-white text-slate-950 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm text-white tracking-tight leading-none">
              CareConnect
            </span>
            <span className="text-[10px] font-semibold text-slate-500 tracking-widest uppercase mt-1">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto px-4 py-8 space-y-6">
          <div className="space-y-4">
            <div className="px-4 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              Management
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-900 text-white border border-slate-800 shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile & Sign Out Footer */}
          <div className="pt-6 border-t border-slate-900 space-y-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 border border-slate-800/50">
              <div className="h-8 w-8 bg-slate-800 text-slate-300 font-medium flex items-center justify-center text-xs shrink-0 border border-slate-700">
                {user?.username?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-medium text-white block truncate">
                  {user?.username || "Administrator"}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  System Admin
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-400 bg-transparent border border-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-700 h-10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE TOP BAR (Visible on screens < lg)               */}
      {/* ========================================================= */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-950 border-b border-slate-900 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-white text-slate-950 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="font-medium text-sm text-white">CareConnect</span>
              <span className="ml-2 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Admin</span>
            </div>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:bg-slate-900 hover:text-white border border-transparent hover:border-slate-800 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="pt-4 pb-2 space-y-2 border-t border-slate-900 mt-3 animate-in slide-in-from-top-2 duration-150">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-slate-900 text-white border border-slate-800"
                      : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </Link>
              );
            })}

            <div className="pt-4 border-t border-slate-900 flex items-center justify-between px-2">
              <span className="text-xs text-slate-500 font-medium truncate">@{user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
