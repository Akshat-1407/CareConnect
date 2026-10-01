"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2, User, Calendar, Clock, FileText, LogOut, Stethoscope } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const { user, loading } = useRequireAuth("doctor", "/doctor/login");
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/doctor/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const quickLinks = [
    { href: "/doctor/availability", icon: Clock, label: "Manage Availability", desc: "Set your available time slots", color: "blue" },
    { href: "/doctor/appointments", icon: Calendar, label: "My Appointments", desc: "View upcoming patient appointments", color: "teal" },
    { href: "/doctor/prescriptions", icon: FileText, label: "Prescriptions", desc: "View records & write prescriptions", color: "emerald" },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    teal: "bg-teal-50 text-teal-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dr. {user?.last_name || user?.username}&apos;s Dashboard
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage your schedule, patients, and prescriptions.
          </p>
        </div>
      </div>

      {/* Profile card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 mb-8 flex items-center gap-4 shadow-sm">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
          <Stethoscope className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold text-slate-900">
            Dr. {user?.first_name} {user?.last_name}
          </p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
        <span className="ml-auto text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Doctor
        </span>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map(({ href, icon: Icon, label, desc, color }) => (
          <Link key={href} href={href}>
            <Card className="hover:shadow-md transition-all cursor-pointer group border-slate-200 h-full">
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[color]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base group-hover:text-blue-600 transition-colors">
                  {label}
                </CardTitle>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
