"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function MedicationRow({
  index,
  medication,
  onChange,
  onRemove,
  canRemove = true,
}) {
  const handleChange = (field, value) => {
    onChange(index, { ...medication, [field]: value });
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative group transition hover:border-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Medication #{index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-7 w-7 p-0 rounded-full"
            title="Remove medication"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Medicine Name */}
        <div className="sm:col-span-2 md:col-span-2">
          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
            Medicine Name *
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. Amoxicillin, Paracetamol"
            value={medication.medicine_name || ""}
            onChange={(e) => handleChange("medicine_name", e.target.value)}
            className="h-9 text-xs bg-white"
          />
        </div>

        {/* Dosage */}
        <div>
          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
            Dosage *
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. 500mg, 1 tablet"
            value={medication.dosage || ""}
            onChange={(e) => handleChange("dosage", e.target.value)}
            className="h-9 text-xs bg-white"
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
            Frequency *
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. Twice daily, 1-0-1"
            value={medication.frequency || ""}
            onChange={(e) => handleChange("frequency", e.target.value)}
            className="h-9 text-xs bg-white"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
            Duration *
          </label>
          <Input
            type="text"
            required
            placeholder="e.g. 5 days, 2 weeks"
            value={medication.duration || ""}
            onChange={(e) => handleChange("duration", e.target.value)}
            className="h-9 text-xs bg-white"
          />
        </div>

        {/* Notes / Instructions */}
        <div className="sm:col-span-2 md:col-span-3">
          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
            Special Notes / Intake Instructions
          </label>
          <Input
            type="text"
            placeholder="e.g. Take after food with warm water"
            value={medication.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="h-9 text-xs bg-white"
          />
        </div>
      </div>
    </div>
  );
}
