import { useState, useMemo } from "react";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  });
}

export default function SlotPicker({ slots, selectedSlot, onSelectSlot }) {
  // Filter out slots whose start_time has already passed, then group by date
  const slotsByDate = useMemo(() => {
    const now = new Date();
    const map = {};
    (slots || []).forEach((slot) => {
      // Build a proper Date object from the slot's date + start_time
      const slotDateTime = new Date(`${slot.date}T${slot.start_time}`);
      if (slotDateTime <= now) return; // Skip past slots

      if (!map[slot.date]) {
        map[slot.date] = [];
      }
      map[slot.date].push(slot);
    });
    return map;
  }, [slots]);

  const dates = Object.keys(slotsByDate).sort();
  const [activeDate, setActiveDate] = useState(dates[0] || "");

  // Update active date when dates change if current active is invalid
  if (dates.length > 0 && !dates.includes(activeDate)) {
    setActiveDate(dates[0]);
  }

  const currentSlots = slotsByDate[activeDate] || [];

  // Total count of available (non-past) slots
  const totalAvailable = Object.values(slotsByDate).reduce((sum, arr) => sum + arr.length, 0);

  if (totalAvailable === 0) {
    return (
      <Card className="border-slate-200">
        <CardContent className="py-12 text-center">
          <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-700">No appointment slots available</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            This doctor has no available upcoming slots at the moment. Please check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            <CardTitle className="text-base font-semibold text-slate-900">
              Select Appointment Slot
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
            {totalAvailable} available {totalAvailable === 1 ? "slot" : "slots"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Date Selector Pills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Available Dates
          </label>
          <div className="flex flex-wrap gap-2">
            {dates.map((d) => {
              const isSelected = d === activeDate;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setActiveDate(d)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {formatDateString(d)}
                  <span className="block text-[10px] opacity-80 mt-0.5">
                    {slotsByDate[d].length} slots
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots for Selected Date */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Available Time Slots ({formatDateString(activeDate)})
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {currentSlots.map((slot) => {
              const isSelected = selectedSlot && selectedSlot.id === slot.id;
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-teal-50 border-teal-600 ring-2 ring-teal-600/20 text-teal-900 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className={`h-4 w-4 ${isSelected ? "text-teal-600" : "text-slate-400"}`} />
                    <span className="text-xs font-semibold">
                      {formatTimeString(slot.start_time)}
                    </span>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  ) : (
                    <span className="text-[10px] text-slate-400">
                      to {formatTimeString(slot.end_time)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
