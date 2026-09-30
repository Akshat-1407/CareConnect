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
  ArrowRight,
  ArrowUpRight,
  Clock3,
  HeartPulse,
  LockKeyhole,
  Sparkles,
  Users,
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
    <div className="overflow-hidden bg-[#f7faf9] text-slate-900">
      <section className="relative border-b border-teal-100 bg-[#e9f5f2]">
        <div className="absolute right-[-8rem] top-[-7rem] h-80 w-80 rounded-full border-[3rem] border-white/50" />
        <div className="absolute bottom-[-9rem] left-[-7rem] h-72 w-72 rounded-full bg-[#d6eee8]/70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-7 flex flex-wrap items-center gap-2">
              <Badge variant="default" className="border border-teal-200 bg-white/70 py-1.5 px-3 text-[11px] uppercase tracking-[0.16em]">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Care, connected
              </Badge>
            {backendStatus.loading ? (
              <Badge variant="secondary" className="bg-white/70 text-xs">
                Checking Backend API...
              </Badge>
            ) : backendStatus.connected ? (
              <Badge variant="success" className="flex items-center gap-1 bg-white/70 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> API Connected (v1)
              </Badge>
            ) : (
              <Badge variant="danger" className="flex items-center gap-1 bg-white/70 text-xs">
                <AlertCircle className="w-3 h-3 text-rose-600" /> Backend Offline
              </Badge>
            )}
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
              Better care, <span className="text-teal-600">closer</span> to home.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              From your first appointment to your next prescription, CareConnect makes every step of your care feel simple, personal, and secure.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg" className="h-12 gap-2 rounded-full px-6 shadow-lg shadow-teal-600/20">
                  Find a doctor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/doctor/login">
                <Button variant="outline" size="lg" className="h-12 rounded-full border-teal-200 bg-white/60 px-6">
                  Doctor portal
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Verified specialists</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-600" /> Secure consultations</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mr-0">
            <div className="absolute -left-7 top-12 z-10 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-xl shadow-slate-900/10 sm:-left-12">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><HeartPulse className="h-5 w-5" /></div>
              <div><p className="text-xs font-medium text-slate-500">Care status</p><p className="text-sm font-semibold text-slate-900">You are in good hands</p></div>
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-white p-3 shadow-2xl shadow-teal-900/10">
              <div className="rounded-[1.5rem] bg-slate-900 p-5 text-white sm:p-7">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs text-slate-400">Your care dashboard</p><p className="mt-1 text-lg font-semibold">Good morning, Aisha</p></div>
                  <div className="rounded-full bg-white/10 p-2.5"><HeartPulse className="h-5 w-5 text-teal-300" /></div>
                </div>
                <div className="mt-7 rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between"><span className="text-sm text-slate-300">Next appointment</span><span className="rounded-full bg-teal-300/15 px-2.5 py-1 text-[11px] font-semibold text-teal-200">Confirmed</span></div>
                  <div className="mt-5 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-500 text-white"><Stethoscope className="h-5 w-5" /></div><div><p className="font-semibold">Dr. Meera Shah</p><p className="text-xs text-slate-400">General Physician</p></div></div>
                  <div className="mt-5 flex items-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-300"><span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-teal-300" /> Today, 10:30 AM</span><span className="flex items-center gap-1.5"><Video className="h-3.5 w-3.5 text-teal-300" /> Video call</span></div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/10 p-4"><Users className="h-4 w-4 text-teal-300" /><p className="mt-4 text-xl font-semibold">120+</p><p className="text-xs text-slate-400">Care providers</p></div><div className="rounded-2xl bg-white/10 p-4"><Clock3 className="h-4 w-4 text-teal-300" /><p className="mt-4 text-xl font-semibold">24/7</p><p className="text-xs text-slate-400">Access to care</p></div></div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-4 flex items-center gap-2 rounded-2xl border border-teal-100 bg-white px-4 py-3 shadow-lg sm:-right-8"><LockKeyhole className="h-4 w-4 text-teal-600" /><span className="text-xs font-semibold text-slate-700">Private by design</span></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">How it works</p><h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Everything you need for a healthier day.</h2></div>
          <p className="max-w-sm text-sm leading-6 text-slate-500">One calm, connected experience for finding care, meeting your doctor, and keeping your health records close.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[{ icon: Stethoscope, number: "01", title: "Find your specialist", text: "Browse verified doctors by specialty, availability, or name.", tone: "bg-teal-50 text-teal-700" }, { icon: Calendar, number: "02", title: "Choose your time", text: "Book a slot that fits your day and confirm securely.", tone: "bg-sky-50 text-sky-700" }, { icon: Video, number: "03", title: "Meet face to face", text: "Join a private video consultation from your browser.", tone: "bg-emerald-50 text-emerald-700" }, { icon: FileText, number: "04", title: "Keep moving forward", text: "Get clear digital prescriptions and care summaries.", tone: "bg-amber-50 text-amber-700" }].map(({ icon: Icon, number, title, text, tone }) => (
            <Card key={number} className="group rounded-2xl border-slate-200/80 bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5">
              <CardHeader className="p-6 sm:p-7"><div className="flex items-start justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" /></div><span className="text-sm font-semibold text-slate-300">{number}</span></div><CardTitle className="mt-8 text-lg">{title}</CardTitle><CardDescription className="mt-2 leading-6">{text}</CardDescription><ArrowUpRight className="mt-6 h-4 w-4 text-slate-300 transition-colors group-hover:text-teal-600" /></CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex max-w-2xl items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600"><ShieldCheck className="h-6 w-6" /></div><div><h4 className="font-semibold text-slate-900">Your health information stays yours.</h4><p className="mt-1 text-sm leading-6 text-slate-500">Private consultations, role-governed access, and secure authentication are built into every interaction.</p></div></div>
          <Link href="/register" className="shrink-0"><Button size="lg" className="h-11 gap-2 rounded-full px-5">Create your account <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>
    </div>
  );
}
