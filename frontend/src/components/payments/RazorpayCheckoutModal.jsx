"use client";

import { useState } from "react";
import { X, MoreHorizontal, Check, ShieldCheck, Stethoscope } from "lucide-react";

export default function RazorpayCheckoutModal({
  isOpen,
  orderData,
  doctorName,
  user,
  onSuccess,
  onDismiss,
}) {
  const [step, setStep] = useState("contact"); // 'contact' | 'methods'
  const [mobileNumber, setMobileNumber] = useState(user?.phone || "9876543210");
  const [selectedMethod, setSelectedMethod] = useState("cards"); // 'cards' | 'netbanking' | 'wallet' | 'upi'
  const [selectedBank, setSelectedBank] = useState("hdfc");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !orderData) return null;

  const amountInRupees = orderData.amount ? (orderData.amount / 100).toFixed(0) : "500";

  const handlePay = () => {
    setIsProcessing(true);
    const mockPaymentId = `pay_test_${Math.random().toString(36).substring(2, 10)}`;
    const mockSignature = `mock_sig_${Math.random().toString(36).substring(2, 12)}`;

    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        razorpay_order_id: orderData.order_id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: mockSignature,
      });
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in-50 duration-200">
      {/* Red "Test Mode" Ribbon in Top-Right Corner */}
      <div className="fixed top-7 -right-12 z-50 pointer-events-none rotate-45 transform bg-[#e11d48] text-white text-[11px] font-extrabold uppercase tracking-widest py-1 px-14 shadow-lg border border-white/20">
        Test Mode
      </div>

      {/* Main Razorpay Modal Box */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-700/30 text-slate-800 min-h-[440px]">
        {/* LEFT COLUMN: Razorpay Dark Navy Brand Panel */}
        <div className="w-full md:w-5/12 bg-[#0c2340] text-white p-6 flex flex-col justify-between relative overflow-hidden">
          {/* Background subtle glow effect */}
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Merchant Identity */}
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-[#1e3a8a] border border-sky-400/30 flex items-center justify-center text-teal-300 font-bold shadow-sm">
                <Stethoscope className="h-6 w-6 text-teal-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">CareConnect</h3>
                <p className="text-[11px] text-slate-300">Telemedicine Services</p>
              </div>
            </div>

            {/* Price Summary Box */}
            <div className="mt-8 bg-[#18365d] rounded-xl p-4 border border-slate-600/40">
              <span className="text-xs text-slate-300 font-medium block">Price Summary</span>
              <span className="text-3xl font-extrabold text-white mt-1 block">
                ₹{amountInRupees}
              </span>
              <span className="text-[11px] text-teal-300 font-medium mt-1 block">
                {doctorName ? `Consultation with ${doctorName}` : "Virtual Consultation"}
              </span>
            </div>
          </div>

          {/* Bottom Isometric Graphic & Razorpay Watermark */}
          <div className="mt-8 pt-4 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                Secured by <span className="font-bold tracking-wider italic text-sky-400">Razorpay</span>
              </span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Razorpay Payment Options / Contact Form */}
        <div className="w-full md:w-7/12 bg-[#f8fafc] flex flex-col justify-between p-6 relative">
          {/* Top Bar with Options and Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {step === "contact" ? "Contact Details" : "Payment Options"}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 p-1 rounded transition"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onDismiss}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* STEP 1: Contact Details View (Matches Screenshot Overlay Exactly) */}
          {step === "contact" && (
            <div className="my-auto py-6 px-2 space-y-5 animate-in fade-in-50 duration-200">
              <div className="text-center">
                <h4 className="text-lg font-bold text-slate-900">Contact details</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Enter mobile number to continue
                </p>
              </div>

              <div className="max-w-xs mx-auto">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-600/20 transition">
                  <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 text-xs font-semibold text-slate-700 select-none">
                    <span className="text-sm">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Mobile number"
                    maxLength={10}
                    className="w-full pl-3 text-sm text-slate-900 bg-transparent focus:outline-none font-medium placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep("methods")}
                  disabled={!mobileNumber || mobileNumber.length < 5}
                  className="w-full mt-4 py-3 bg-[#0c1e33] hover:bg-[#162e4a] text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50"
                >
                  Continue
                </button>

                <p className="text-center text-[10px] text-slate-400 mt-3">
                  Using Razorpay Test Sandbox
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Payment Methods View (Matches Screenshot Cards/Netbanking/Wallet) */}
          {step === "methods" && (
            <div className="py-4 space-y-4 flex-1 flex flex-col justify-between animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-12 gap-3 text-xs">
                {/* Method Selector Tabs */}
                <div className="col-span-5 border-r border-slate-200 pr-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod("cards")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left font-medium transition ${
                      selectedMethod === "cards"
                        ? "bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Cards</span>
                    <span className="text-[10px] font-mono text-slate-400">VISA/MC</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("upi")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left font-medium transition ${
                      selectedMethod === "upi"
                        ? "bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>UPI / QR</span>
                    <span className="text-[10px] text-teal-600 font-bold">FAST</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("netbanking")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left font-medium transition ${
                      selectedMethod === "netbanking"
                        ? "bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Netbanking</span>
                    <span className="text-[10px] text-slate-400">Banks</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMethod("wallet")}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left font-medium transition ${
                      selectedMethod === "wallet"
                        ? "bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>Wallet</span>
                    <span className="text-[10px] text-slate-400">Airtel/Jio</span>
                  </button>
                </div>

                {/* Sub-form Detail Panel */}
                <div className="col-span-7 pl-1">
                  {selectedMethod === "cards" && (
                    <div className="space-y-3">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Add a new card
                      </p>
                      <div className="space-y-2 border border-slate-300 rounded-xl p-3 bg-white shadow-sm">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Card Number</label>
                          <input
                            type="text"
                            readOnly
                            value="4111 1111 1111 1111"
                            className="w-full font-mono text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">MM / YY</label>
                            <input
                              type="text"
                              readOnly
                              value="12 / 28"
                              className="w-full font-mono text-xs text-slate-800 bg-transparent focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-0.5">CVV</label>
                            <input
                              type="password"
                              readOnly
                              value="123"
                              className="w-full font-mono text-xs text-slate-800 bg-transparent focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="rbi-save"
                          defaultChecked
                          className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                        />
                        <label htmlFor="rbi-save" className="text-[10px] text-slate-500 leading-tight">
                          Save this card as per RBI guidelines
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedMethod === "upi" && (
                    <div className="space-y-3 text-center py-2">
                      <div className="w-24 h-24 mx-auto bg-white border border-slate-300 rounded-xl flex items-center justify-center p-2 shadow-sm">
                        <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center text-white text-[10px] font-mono">
                          UPI QR
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-slate-700">Scan & Pay ₹{amountInRupees}</p>
                      <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm</p>
                    </div>
                  )}

                  {selectedMethod === "netbanking" && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Select Bank
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { id: "hdfc", name: "HDFC Bank" },
                          { id: "icici", name: "ICICI Bank" },
                          { id: "sbi", name: "State Bank of India" },
                          { id: "axis", name: "Axis Bank" },
                        ].map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setSelectedBank(b.id)}
                            className={`p-2 rounded-lg border text-left font-medium transition ${
                              selectedBank === b.id
                                ? "border-sky-600 bg-sky-50 text-sky-900"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMethod === "wallet" && (
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Select Wallet
                      </p>
                      <div className="space-y-1.5 text-xs">
                        <div className="p-2 border rounded-lg bg-white flex items-center justify-between">
                          <span>Airtel Money (Test)</span>
                          <span className="text-teal-600 font-semibold">Available</span>
                        </div>
                        <div className="p-2 border rounded-lg bg-white flex items-center justify-between">
                          <span>MobiKwik (Test)</span>
                          <span className="text-teal-600 font-semibold">Available</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pay Now Button */}
              <div className="pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3 bg-[#0c1e33] hover:bg-[#162e4a] text-white font-bold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  {isProcessing ? "Authorizing Payment..." : `Pay ₹${amountInRupees}`}
                </button>
                <div className="flex items-center justify-between mt-2 px-1">
                  <button
                    type="button"
                    onClick={() => setStep("contact")}
                    className="text-[10px] text-sky-700 hover:underline font-medium"
                  >
                    Change contact details
                  </button>
                  <span className="text-[10px] text-slate-400">
                    256-bit SSL encrypted
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
