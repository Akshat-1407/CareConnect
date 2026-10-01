"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "@/services/api";
import HeroSection from "@/components/home/HeroSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeatureShowcaseSection from "@/components/home/FeatureShowcaseSection";
import TrustSecuritySection from "@/components/home/TrustSecuritySection";
import CtaBanner from "@/components/home/CtaBanner";

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
      .catch(() => {
        setBackendStatus({ loading: false, connected: false, data: null });
      });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* 1. Hero Section with Live Clinical Dashboard Preview */}
      <HeroSection backendStatus={backendStatus} />

      {/* 2. Step-by-Step Progressive Timeline */}
      <HowItWorksSection />

      {/* 3. Dual-Sided Feature Deep Dives (Patients & Doctors) */}
      <FeatureShowcaseSection />

      {/* 4. Privacy, Security & Technical Architecture */}
      <TrustSecuritySection />

      {/* 5. Closing High-Contrast Action Banner */}
      <CtaBanner />
    </div>
  );
}
