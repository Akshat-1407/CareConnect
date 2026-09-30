"use client";

import { useState, useEffect } from "react";
import { UserCheck, UserPlus, Search, Stethoscope, Calendar, Clock, Loader2, CheckCircle2, Trash2, AlertCircle } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminDoctors, deleteAdminDoctor } from "@/services/admin";
import AdminNav from "@/components/admin/AdminNav";
import CreateDoctorModal from "@/components/admin/CreateDoctorModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminDoctorsPage() {
  const { user, loading: authLoading } = useRequireAuth("admin", "/internal/admin/login");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await getAdminDoctors();
      setDoctors(data || []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadDoctors();
  }, [authLoading]);

  const handleDoctorCreated = (newDoctor) => {
    setFeedback({ type: "success", text: `Doctor account for ${newDoctor.name} created successfully!` });
    loadDoctors();
    setTimeout(() => setFeedback({ type: "", text: "" }), 5000);
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteAdminDoctor(doctorToDelete.id);
      setFeedback({ type: "success", text: res?.message || `${doctorToDelete.name} deleted successfully.` });
      setDoctorToDelete(null);
      loadDoctors();
      setTimeout(() => setFeedback({ type: "", text: "" }), 5000);
    } catch (err) {
      console.error("Failed to delete doctor:", err);
      setFeedback({ type: "error", text: err?.data?.detail || "Failed to delete doctor account." });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredDoctors = doctors.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.name?.toLowerCase().includes(term) ||
      d.specialization?.toLowerCase().includes(term) ||
      d.username?.toLowerCase().includes(term) ||
      d.email?.toLowerCase().includes(term)
    );
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-1.5 bg-blue-50 text-blue-700 border-blue-200">
              Provider Management
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Doctors Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage doctor credentials, view availability slot counts, and onboard specialists.
            </p>
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold shadow-sm"
          >
            <UserPlus className="h-4 w-4" /> Add New Doctor
          </Button>
        </div>

        {/* Feedback Alert */}
        {feedback.text && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            feedback.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, specialization, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-xs bg-white"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total: {filteredDoctors.length} {filteredDoctors.length === 1 ? "Doctor" : "Doctors"}
          </span>
        </div>

        {/* Doctors Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
            <span className="text-sm">Loading doctors directory...</span>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <UserCheck className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No doctors found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? "No doctors matched your search." : "No doctors are registered yet."}
            </p>
          </div>
        ) : (
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Doctor</th>
                    <th className="py-3.5 px-4">Specialization</th>
                    <th className="py-3.5 px-4">Fee</th>
                    <th className="py-3.5 px-4">Availability Slots</th>
                    <th className="py-3.5 px-4">Appointments</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Joined</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {doc.first_name?.[0] || doc.username[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{doc.name}</span>
                            <span className="text-[11px] text-slate-400 block">{doc.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50/50 text-[11px]">
                          {doc.specialization}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        ₹{doc.consultation_fee}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                          <Clock className="h-3 w-3 text-slate-500" />
                          {doc.slots_count} slots
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          {doc.appointments_count} bookings
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={doc.is_active ? "success" : "secondary"} className="text-[10px]">
                          {doc.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {doc.date_joined ? new Date(doc.date_joined).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDoctorToDelete(doc)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title={`Delete ${doc.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <CreateDoctorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleDoctorCreated}
        />

        <DeleteConfirmModal
          isOpen={Boolean(doctorToDelete)}
          onClose={() => setDoctorToDelete(null)}
          onConfirm={handleDeleteDoctor}
          loading={isDeleting}
          title="Delete Doctor Account"
          description="Are you sure you want to delete this doctor? Their profile, credentials, availability slots, and appointment records will be permanently removed."
          itemTitle={doctorToDelete ? `${doctorToDelete.name} (${doctorToDelete.specialization} • ${doctorToDelete.email})` : ""}
        />
    </div>
  );
}
