"use client";

import { useState } from "react";
import { X, UserPlus, AlertCircle, Loader2 } from "lucide-react";
import { createDoctor } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateDoctorModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    specialization: "",
    consultation_fee: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Username, email, and password are required.");
      return;
    }

    if (!formData.specialization.trim() || !formData.consultation_fee) {
      setError("Specialization and consultation fee are required.");
      return;
    }

    try {
      setLoading(true);
      const res = await createDoctor(formData);
      onSuccess(res.doctor);
      onClose();
    } catch (err) {
      console.error("Failed to create doctor:", err);
      const msg =
        err?.data?.username?.[0] ||
        err?.data?.email?.[0] ||
        err?.data?.password?.[0] ||
        err?.data?.detail ||
        "Failed to create doctor. Please check the inputs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Register New Doctor</h3>
              <p className="text-xs text-slate-400">Create a doctor login and professional profile</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Username *
              </label>
              <Input
                name="username"
                required
                placeholder="e.g. dr_smith"
                value={formData.username}
                onChange={handleChange}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Email Address *
              </label>
              <Input
                name="email"
                type="email"
                required
                placeholder="doctor@example.com"
                value={formData.email}
                onChange={handleChange}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Temporary Password *
            </label>
            <Input
              name="password"
              type="password"
              required
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              className="h-9 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                First Name
              </label>
              <Input
                name="first_name"
                placeholder="Sarah"
                value={formData.first_name}
                onChange={handleChange}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Last Name
              </label>
              <Input
                name="last_name"
                placeholder="Smith"
                value={formData.last_name}
                onChange={handleChange}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Specialization *
              </label>
              <Input
                name="specialization"
                required
                placeholder="e.g. Cardiology, Pediatrics"
                value={formData.specialization}
                onChange={handleChange}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                Consultation Fee (₹) *
              </label>
              <Input
                name="consultation_fee"
                type="number"
                min="0"
                step="50"
                required
                placeholder="500"
                value={formData.consultation_fee}
                onChange={handleChange}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-700 block mb-1">
              Professional Biography
            </label>
            <Textarea
              name="bio"
              rows={2}
              placeholder="Brief overview of credentials, qualifications, and experience..."
              value={formData.bio}
              onChange={handleChange}
              className="text-xs"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <UserPlus className="h-3.5 w-3.5" /> Create Doctor Account
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
