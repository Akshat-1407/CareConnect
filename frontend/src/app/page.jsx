"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Stethoscope, 
  Calendar, 
  Video, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { checkBackendHealth } from "@/services/api";

export default function HomePage() {
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    data: null,
  });

  useEffect(() => {
    checkBackendHealth()
      .then((data) => {
        setBackendStatus({ loading: false, connected: true, data });
      })
      .catch((err) => {
        setBackendStatus({ loading: false, connected: false, data: null });
      });
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-teal-50/50 to-white py-16 sm:py-24 border-b border-slate-100">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="default" className="text-sm py-1 px-3">
              CareConnect Telemedicine MVP
            </Badge>
            {backendStatus.loading ? (
              <Badge variant="secondary" className="text-xs">
                Checking Backend API...
              </Badge>
            ) : backendStatus.connected ? (
              <Badge variant="success" className="text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> API Connected (v1)
              </Badge>
            ) : (
              <Badge variant="danger" className="text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-rose-600" /> Backend Offline
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Virtual Care at Your <span className="text-teal-600">Fingertips</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed">
            Connect with verified doctors, book appointments effortlessly, join secure real-time video consultations, and receive digital prescriptions—all in one unified platform.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Find a Doctor <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/doctor/login">
              <Button variant="outline" size="lg">
                Doctor Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Simple & Seamless Patient Journey
          </h2>
          <p className="mt-2 text-slate-600">
            Engineered around the core 5-step telemedicine consultation flow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
                <Stethoscope className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">1. Browse Doctors</CardTitle>
              <CardDescription>
                Search verified practitioners by name or medical specialization.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">2. Book & Pay</CardTitle>
              <CardDescription>
                Select convenient slots and confirm bookings securely via Razorpay.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Video className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">3. Video Call</CardTitle>
              <CardDescription>
                Join high-quality WebRTC audio/video consultations directly from your browser.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-slate-200">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">4. Prescriptions</CardTitle>
              <CardDescription>
                Access structured digital medication and diagnosis summaries anytime.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Security & Reliability Banner */}
      <section className="w-full bg-slate-100/70 border-t border-slate-200 py-10">
        <div className="container mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm text-teal-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Secure & Role-Governed Access</h4>
              <p className="text-xs text-slate-500">
                HttpOnly cookies, JWT authentication, and strict backend permission enforcement.
              </p>
            </div>
          </div>
          <Link href="/register">
            <Button variant="default" size="sm">
              Create Patient Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
