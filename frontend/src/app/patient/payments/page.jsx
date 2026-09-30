"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CreditCard, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getPaymentsHistory } from "@/services/payments";
import PaymentCard from "@/components/payments/PaymentCard";
import { Button } from "@/components/ui/button";

export default function PatientPaymentsPage() {
  const { user, loading: authLoading } = useRequireAuth("patient", "/login");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      getPaymentsHistory()
        .then((data) => setPayments(data || []))
        .catch((err) => console.error("Error loading payments:", err))
        .finally(() => setLoading(false));
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/patient/dashboard">
              <Button variant="ghost" size="sm" className="gap-1.5 text-slate-600 -ml-2 h-7 px-2">
                <ArrowLeft className="h-4 w-4" /> Dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Payment History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review all transaction receipts and consultation charges processed via Razorpay.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
          <ShieldCheck className="h-4 w-4 text-teal-600" />
          <span>Razorpay Verified</span>
        </div>
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
          <span className="text-sm">Loading payment records...</span>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <CreditCard className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No payment records found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            You have not made any consultation payments yet.
          </p>
          <Link href="/patient/doctors">
            <Button variant="default" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
              Find a Doctor
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {payments.map((p) => (
            <PaymentCard key={p.id} payment={p} />
          ))}
        </div>
      )}
    </div>
  );
}
