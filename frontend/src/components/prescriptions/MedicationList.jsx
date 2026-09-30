"use client";

import { Pill, Clock, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MedicationList({ medications = [] }) {
  if (!medications || medications.length === 0) {
    return (
      <div className="text-center py-6 text-slate-400 text-xs">
        No medications listed.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {medications.map((med, idx) => (
        <div key={med.id || idx} className="p-4 hover:bg-slate-50/50 transition">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Pill className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{med.medicine_name}</span>
                  <Badge variant="outline" className="text-[11px] font-medium border-teal-200 text-teal-700 bg-teal-50/50">
                    {med.dosage}
                  </Badge>
                </h4>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 sm:justify-end">
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                <Clock className="h-3 w-3 text-slate-500" />
                {med.frequency}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                <Calendar className="h-3 w-3 text-slate-500" />
                {med.duration}
              </span>
            </div>
          </div>

          {med.notes && (
            <p className="text-xs text-slate-500 mt-2 pl-10 italic">
              Instructions: {med.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
