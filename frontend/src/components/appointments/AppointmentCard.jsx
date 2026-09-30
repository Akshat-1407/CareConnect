import Link from "next/link";
import { Calendar, Clock, Video, XCircle, CreditCard, Stethoscope, User, AlertCircle, FileText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export default function AppointmentCard({
  appointment,
  role = "patient",
  onCancel,
  cancellingId,
}) {
  const isDoctor = role === "doctor";
  const slot = appointment.slot;
  const status = appointment.status;

  const getStatusBadge = () => {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success">Confirmed</Badge>;
      case "PENDING_PAYMENT":
        return <Badge variant="warning">Pending Payment</Badge>;
      case "COMPLETED":
        return <Badge variant="default" className="bg-slate-700">Completed</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const consultationHref = isDoctor
    ? `/doctor/consultation/${appointment.id}`
    : `/patient/consultation/${appointment.id}`;

  const canCancel = (status === "CONFIRMED" || status === "PENDING_PAYMENT") && onCancel;

  return (
    <Card className="border-slate-200 hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              {isDoctor ? <User className="h-5 w-5" /> : <Stethoscope className="h-5 w-5" />}
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                {isDoctor ? appointment.patient_name : appointment.doctor?.full_name}
              </CardTitle>
              <p className="text-xs text-slate-500 font-medium">
                {isDoctor
                  ? appointment.patient_email
                  : appointment.doctor?.specialization || "Specialist"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">#{appointment.id}</span>
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-600" />
            <span className="font-semibold">{formatDateString(slot?.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-600" />
            <span>
              {formatTimeString(slot?.start_time)} – {formatTimeString(slot?.end_time)}
            </span>
          </div>
        </div>

        {appointment.notes && (
          <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-600">
            <span className="font-medium text-slate-700">Notes: </span>
            {appointment.notes}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-slate-800">
            <CreditCard className="h-3.5 w-3.5 text-teal-600" /> Fee: ₹{appointment.amount}
          </span>
          <span className="text-[11px] text-slate-400">
            Booked: {new Date(appointment.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {status === "CONFIRMED" ? (
          <Link href={consultationHref} className="flex-1 min-w-[140px]">
            <Button size="sm" className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white">
              <Video className="h-4 w-4" /> Consultation Room
            </Button>
          </Link>
        ) : (
          <div className="flex-1 text-xs text-slate-400 italic">
            {status === "PENDING_PAYMENT"
              ? "Awaiting payment verification"
              : status === "CANCELLED"
              ? "Appointment cancelled"
              : "Consultation ended"}
          </div>
        )}

        {isDoctor && (status === "CONFIRMED" || status === "COMPLETED") && (
          <Link href={`/doctor/prescriptions/create/${appointment.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs text-teal-700 border-teal-200 hover:bg-teal-50">
              <FileText className="h-3.5 w-3.5" /> Prescription
            </Button>
          </Link>
        )}

        {!isDoctor && status === "COMPLETED" && (
          <Link href="/patient/prescriptions">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs text-teal-700 border-teal-200 hover:bg-teal-50">
              <FileText className="h-3.5 w-3.5" /> View Rx
            </Button>
          </Link>
        )}

        {canCancel && (
          <Button
            variant="ghost"
            size="sm"
            disabled={cancellingId === appointment.id}
            onClick={() => onCancel(appointment.id)}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 text-xs h-8"
          >
            <XCircle className="h-3.5 w-3.5" /> Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
