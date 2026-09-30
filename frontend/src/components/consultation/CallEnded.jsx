"use client";

import Link from "next/link";
import { PhoneOff, Calendar, FileText, ArrowRight, Home } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function CallEnded({ appointmentId, role = "patient", duration = 0 }) {
  const isDoctor = role === "doctor";

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <Card className="border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 text-white p-8">
          <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
            <PhoneOff className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Consultation Ended</h2>
          <p className="text-slate-400 text-xs mt-1">
            The video consultation session has finished.
          </p>
          <div className="mt-4 inline-block bg-slate-800 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300">
            Duration: {formatDuration(duration)}
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          {isDoctor ? (
            <div className="space-y-3">
              <Link href={`/doctor/prescriptions/create/${appointmentId}`}>
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2 font-semibold">
                  <FileText className="h-4 w-4" /> Write Prescription
                </Button>
              </Link>
              <Link href="/doctor/appointments">
                <Button variant="outline" className="w-full gap-2">
                  <Calendar className="h-4 w-4" /> Assigned Appointments
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/patient/prescriptions">
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2 font-semibold">
                  <FileText className="h-4 w-4" /> View My Prescriptions
                </Button>
              </Link>
              <Link href="/patient/appointments">
                <Button variant="outline" className="w-full gap-2">
                  <Calendar className="h-4 w-4" /> My Appointments
                </Button>
              </Link>
            </div>
          )}

          <Link href={isDoctor ? "/doctor/dashboard" : "/patient/dashboard"}>
            <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-slate-700 gap-1.5 mt-2 text-xs">
              <Home className="h-3.5 w-3.5" /> Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
