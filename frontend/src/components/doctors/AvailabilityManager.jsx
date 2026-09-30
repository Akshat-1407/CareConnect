"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Calendar, Clock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getDoctorAvailability,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
} from "@/services/doctors";

function formatTimeString(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatDateString(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTodayString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getTomorrowString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const dd = String(tomorrow.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingOnly, setUpcomingOnly] = useState(false);

  // Form State
  const [date, setDate] = useState(getTomorrowString());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:30");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Deleting State
  const [deletingId, setDeletingId] = useState(null);

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDoctorAvailability({ upcoming: upcomingOnly });
      setSlots(data || []);
    } catch (err) {
      console.error("Failed to load availability slots:", err);
    } finally {
      setLoading(false);
    }
  }, [upcomingOnly]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Set quick duration
  const setQuickDuration = (minutes) => {
    if (!startTime) return;
    const [h, m] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(h, m, 0, 0);
    const endDate = new Date(startDate.getTime() + minutes * 60000);
    const endH = String(endDate.getHours()).padStart(2, "0");
    const endM = String(endDate.getMinutes()).padStart(2, "0");
    setEndTime(`${endH}:${endM}`);
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!date || !startTime || !endTime) {
      setFormError("Please fill out date, start time, and end time.");
      return;
    }

    if (startTime >= endTime) {
      setFormError("End time must be later than start time.");
      return;
    }

    try {
      setFormSubmitting(true);
      await createAvailabilitySlot({
        date,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
      });

      setFormSuccess("Appointment slot added successfully!");
      fetchSlots();

      // Automatically advance start/end time by 30 mins for convenience
      const [h, m] = endTime.split(":").map(Number);
      const nextStart = new Date();
      nextStart.setHours(h, m, 0, 0);
      const nextEnd = new Date(nextStart.getTime() + 30 * 60000);
      const nextStartH = String(nextStart.getHours()).padStart(2, "0");
      const nextStartM = String(nextStart.getMinutes()).padStart(2, "0");
      const nextEndH = String(nextEnd.getHours()).padStart(2, "0");
      const nextEndM = String(nextEnd.getMinutes()).padStart(2, "0");
      setStartTime(`${nextStartH}:${nextStartM}`);
      setEndTime(`${nextEndH}:${nextEndM}`);
    } catch (err) {
      const msg =
        err?.data?.non_field_errors?.[0] ||
        err?.data?.detail ||
        err?.data?.date?.[0] ||
        err?.data?.start_time?.[0] ||
        err?.data?.end_time?.[0] ||
        "Failed to add slot. Please check your inputs.";
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm("Are you sure you want to remove this available slot?")) {
      return;
    }

    try {
      setDeletingId(slotId);
      await deleteAvailabilitySlot(slotId);
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err) {
      alert(err?.data?.detail || "Failed to remove slot.");
    } finally {
      setDeletingId(null);
    }
  };

  const isPastSlot = (slot) => {
    const todayStr = getTodayString();
    if (slot.date < todayStr) return true;
    if (slot.date === todayStr) {
      const now = new Date();
      const currentH = String(now.getHours()).padStart(2, "0");
      const currentM = String(now.getMinutes()).padStart(2, "0");
      return slot.start_time <= `${currentH}:${currentM}:00`;
    }
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Add Slot Form Card */}
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2 text-blue-600">
            <Plus className="h-5 w-5" />
            <CardTitle className="text-lg">Add Appointment Slot</CardTitle>
          </div>
          <CardDescription>
            Create future time slots when patients can book virtual video consultations with you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  min={getTodayString()}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Quick Durations */}
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium">Quick duration:</span>
              <button
                type="button"
                onClick={() => setQuickDuration(30)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                30 mins
              </button>
              <button
                type="button"
                onClick={() => setQuickDuration(45)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                45 mins
              </button>
              <button
                type="button"
                onClick={() => setQuickDuration(60)}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              >
                60 mins
              </button>
            </div>

            {formError && (
              <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={formSubmitting}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {formSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Adding Slot...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Add Slot
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Slots List Card */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Your Availability Schedule</CardTitle>
              <CardDescription>
                Review all created slots. You can remove unbooked future slots anytime.
              </CardDescription>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start">
              <button
                onClick={() => setUpcomingOnly(false)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  !upcomingOnly ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Slots
              </button>
              <button
                onClick={() => setUpcomingOnly(true)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                  upcomingOnly ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upcoming Only
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-600" />
              <span className="text-sm">Loading slots...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No availability slots found</p>
              <p className="text-xs text-slate-400 mt-1">
                Add your first available slot using the form above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {slots.map((slot) => {
                const past = isPastSlot(slot);
                const canDelete = !slot.is_booked && !past;

                return (
                  <div
                    key={slot.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900">
                            {formatDateString(slot.date)}
                          </span>
                          {slot.is_booked ? (
                            <Badge variant="default" className="text-[10px] bg-slate-900">
                              Booked
                            </Badge>
                          ) : past ? (
                            <Badge variant="secondary" className="text-[10px]">
                              Passed
                            </Badge>
                          ) : (
                            <Badge variant="success" className="text-[10px]">
                              Available
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatTimeString(slot.start_time)} – {formatTimeString(slot.end_time)}
                        </p>
                      </div>
                    </div>

                    <div>
                      {canDelete ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === slot.id}
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 h-8 px-2.5 text-xs"
                        >
                          {deletingId === slot.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Remove Slot
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          {slot.is_booked ? "Cannot remove (Booked)" : "Passed slot"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
