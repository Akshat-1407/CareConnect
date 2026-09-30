"use client";

import { useState, useEffect } from "react";
import { Users, Search, Mail, Shield, User, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminUsers } from "@/services/admin";
import AdminNav from "@/components/admin/AdminNav";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const ROLES = [
  { label: "All Users", value: "" },
  { label: "Patients", value: "patient" },
  { label: "Doctors", value: "doctor" },
  { label: "Admins", value: "admin" },
];

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useRequireAuth("admin", "/internal/admin/login");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers({
        role: roleFilter || undefined,
        search: searchTerm || undefined,
      });
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadUsers();
  }, [authLoading, roleFilter, searchTerm]);

  const getRoleBadge = (role) => {
    switch (role) {
      case "patient":
        return <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200 text-[10px]">Patient</Badge>;
      case "doctor":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">Doctor</Badge>;
      case "admin":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">Admin</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">{role}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <AdminNav />

      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-1.5 bg-teal-50 text-teal-700 border-teal-200">
              User Management
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Users & Accounts
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Review all registered accounts, user roles, email addresses, and join dates.
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {ROLES.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setRoleFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  roleFilter === tab.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-white"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
            <span className="text-sm">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No users found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? "No users matched your search criteria." : "No accounts match this filter."}
            </p>
          </div>
        ) : (
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">User</th>
                    <th className="py-3.5 px-4">Email</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                            {u.first_name?.[0] || u.username[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {u.first_name || u.last_name ? `${u.first_name} ${u.last_name}` : u.username}
                            </span>
                            <span className="text-[11px] text-slate-400 block font-mono">@{u.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4">
                        {getRoleBadge(u.role)}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={u.is_active ? "success" : "secondary"} className="text-[10px]">
                          {u.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
