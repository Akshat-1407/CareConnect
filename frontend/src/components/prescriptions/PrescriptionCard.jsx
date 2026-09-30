"use client";

import { FileText, Stethoscope, Calendar, ArrowRight, Pill } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PrescriptionCard({ prescription, onViewDetails }) {
  const dateFormatted = prescription.created_at
    ? new Date(prescription.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  const medCount = prescription.medications?.length || 0;

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Stethoscope className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                {prescription.doctor?.name || "Doctor"}
              </CardTitle>
              <p className="text-[11px] text-slate-500">
                {prescription.doctor?.specialization || "Telemedicine Specialist"}
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-600">
            Rx #{prescription.id}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Diagnosis */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Diagnosis
            </span>
            <p className="text-xs font-semibold text-slate-800 line-clamp-2">
              {prescription.diagnosis}
            </p>
          </div>

          {/* Date & Med Count */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              <span>{dateFormatted}</span>
            </div>
            <div className="flex items-center gap-1 text-teal-700 font-medium">
              <Pill className="h-3 w-3 text-teal-600" />
              <span>{medCount} {medCount === 1 ? "Medicine" : "Medicines"}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <Button
            onClick={() => onViewDetails(prescription)}
            variant="outline"
            size="sm"
            className="w-full text-xs font-semibold text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800 gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> View Prescription Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
