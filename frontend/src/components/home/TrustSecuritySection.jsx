"use client";

const PILLARS = [
  {
    title: "HttpOnly Security",
    desc: "JWT access tokens are stored in secure HttpOnly cookies, completely isolated from client-side scripts to prevent vulnerabilities.",
  },
  {
    title: "WebRTC Encryption",
    desc: "Consultations utilize peer-to-peer WebRTC technology, ensuring your video and audio streams remain encrypted and private.",
  },
  {
    title: "Strict Authorization",
    desc: "Role-based access control is enforced rigidly at the API layer. Patients, doctors, and admins are completely isolated.",
  },
  {
    title: "Atomic Transactions",
    desc: "Payments are verified server-side. Appointments are only confirmed upon successful cryptographic signature validation.",
  },
];

export default function TrustSecuritySection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20">
          <h2 className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-6">Architecture</h2>
          <p className="text-3xl sm:text-4xl font-medium text-slate-900 max-w-2xl tracking-tight">Engineered for privacy and compliance.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-16">
          {PILLARS.map((pillar, idx) => (
            <div key={idx} className="relative pl-6 border-l border-slate-200">
              <h3 className="text-lg font-medium text-slate-900 mb-4">{pillar.title}</h3>
              <p className="text-base text-slate-600 font-light leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
