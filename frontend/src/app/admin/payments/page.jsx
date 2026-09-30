"use client";

import { useState, useEffect } from "react";
import { CreditCard, Search, CheckCircle2, Clock, XCircle, Loader2, Trash2, AlertCircle } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getAdminPayments, deleteAdminPayment } from "@/services/admin";
import AdminNav from "@/components/admin/AdminNav";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUS_FILTERS = [
  { label: "All Payments", value: "" },
  { label: "Success", value: "SUCCESS" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

export default function AdminPaymentsPage() {
  const { user, loading: authLoading } = useRequireAuth("admin", "/internal/admin/login");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await getAdminPayments({
        status: statusFilter || undefined,
      });
      setPayments(data || []);
    } catch (err) {
      console.error("Failed to load admin payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;
    try {
      setIsDeleting(true);
      const res = await deleteAdminPayment(paymentToDelete.id);
      setFeedback({ type: "success", text: res?.message || `Payment #${paymentToDelete.id} deleted successfully.` });
      setPaymentToDelete(null);
      loadPayments();
      setTimeout(() => setFeedback({ type: "", text: "" }), 5000);
    } catch (err) {
      console.error("Failed to delete payment:", err);
      setFeedback({ type: "error", text: err?.data?.detail || "Failed to delete payment." });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    loadPayments();
  }, [authLoading, statusFilter]);

  const filteredPayments = payments.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.id.toString().includes(term) ||
      p.appointment_id?.toString().includes(term) ||
      p.razorpay_order_id?.toLowerCase().includes(term) ||
      p.razorpay_payment_id?.toLowerCase().includes(term) ||
      p.patient?.name?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "SUCCESS":
        return <Badge variant="success" className="text-[10px]">Success</Badge>;
      case "PENDING":
        return <Badge variant="warning" className="text-[10px]">Pending</Badge>;
      case "FAILED":
        return <Badge variant="danger" className="text-[10px]">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Badge variant="outline" className="mb-1.5 bg-amber-50 text-amber-700 border-amber-200">
              Financial Records
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Razorpay Transactions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify payment order IDs, signatures, amounts, and transaction status logs.
            </p>
          </div>
        </div>

        {/* Notification Banner */}
        {feedback.text && (
          <div className={`p-4 rounded-xl text-xs flex items-center gap-2.5 border ${
            feedback.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}>
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span className="font-semibold">{feedback.text}</span>
          </div>
        )}

        {/* Filter Tabs & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  statusFilter === tab.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search payment ID, order ID, patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs bg-white"
            />
          </div>
        </div>

        {/* Payments Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600 mb-2" />
            <span className="text-sm">Loading transactions log...</span>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No payment records found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchTerm ? "No payments match your search." : "No transactions match the selected filter."}
            </p>
          </div>
        ) : (
          <Card className="border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Payment #</th>
                    <th className="py-3.5 px-4">Appt #</th>
                    <th className="py-3.5 px-4">Patient</th>
                    <th className="py-3.5 px-4">Doctor</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Razorpay Reference</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        #{p.id}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        #{p.appointment_id}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-900 block">{p.patient?.name}</span>
                        <span className="text-[11px] text-slate-400 block">{p.patient?.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {p.doctor?.name}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ₹{p.amount}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(p.status)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase mr-1">Order:</span>
                          <span className="text-slate-700">{p.razorpay_order_id}</span>
                        </div>
                        {p.razorpay_payment_id && (
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase mr-1">Payment:</span>
                            <span className="text-slate-700">{p.razorpay_payment_id}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPaymentToDelete(p)}
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title={`Delete Payment #${p.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <DeleteConfirmModal
          isOpen={Boolean(paymentToDelete)}
          onClose={() => setPaymentToDelete(null)}
          onConfirm={handleDeletePayment}
          loading={isDeleting}
          title="Delete Payment Record"
          description="Are you sure you want to delete this payment transaction record? This will permanently remove the payment history entry."
          itemTitle={paymentToDelete ? `Payment #${paymentToDelete.id} (Appt #${paymentToDelete.appointment_id} • ₹${paymentToDelete.amount} • ${paymentToDelete.status})` : ""}
        />
    </div>
  );
}
