import { CreditCard, CheckCircle2, AlertCircle, Clock, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaymentCard({ payment }) {
  const isSuccess = payment.status === "SUCCESS";
  const isPending = payment.status === "PENDING";

  return (
    <Card className="border-slate-200 hover:shadow-sm transition-shadow">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
              isSuccess ? "bg-emerald-50 text-emerald-600" : isPending ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"
            }`}>
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                ₹{payment.amount}
              </CardTitle>
              <p className="text-xs text-slate-500 font-medium">
                {payment.doctor_name || "Doctor Consultation"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSuccess ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Paid
              </Badge>
            ) : isPending ? (
              <Badge variant="warning" className="gap-1">
                <Clock className="h-3 w-3" /> Pending
              </Badge>
            ) : (
              <Badge variant="danger" className="gap-1">
                <AlertCircle className="h-3 w-3" /> Failed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3 space-y-2 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Appointment ID:</span>
          <span className="font-semibold text-slate-800">#{payment.appointment_id}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Order ID:</span>
          <span className="font-mono text-slate-700 text-[11px]">{payment.razorpay_order_id}</span>
        </div>
        {payment.razorpay_payment_id && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Payment ID:</span>
            <span className="font-mono text-slate-700 text-[11px]">{payment.razorpay_payment_id}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(payment.created_at).toLocaleString()}
          </span>
          <span className="font-medium text-slate-500">{payment.currency}</span>
        </div>
      </CardContent>
    </Card>
  );
}
