"use client";

const STEPS = [
  {
    num: "01",
    title: "Select your specialist",
    desc: "Browse our directory of verified physicians. Filter by specialty, read their credentials, and review consultation fees.",
  },
  {
    num: "02",
    title: "Schedule a time",
    desc: "Choose an available slot that works for you. Secure your booking seamlessly with our integrated payment system.",
  },
  {
    num: "03",
    title: "Attend the consultation",
    desc: "Join your secure, high-definition video call directly from your browser. No extra software required.",
  },
  {
    num: "04",
    title: "Receive your prescription",
    desc: "Access your digital prescription and medical notes instantly after the session, securely permanently stored.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-900 tracking-tight">The Process</h2>
          <p className="mt-5 text-lg text-slate-600 font-light">A transparent, straightforward path to your consultation.</p>
        </div>

        <div className="mt-20 border-t border-slate-200">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="group relative flex flex-col lg:flex-row gap-6 lg:gap-16 py-12 border-b border-slate-200 transition-colors hover:bg-slate-50/50">
              <div className="lg:w-1/4 flex items-start">
                <span className="text-sm font-medium text-slate-400 font-mono tracking-widest">{step.num}</span>
              </div>
              <div className="lg:w-1/3">
                <h3 className="text-xl font-medium text-slate-900">{step.title}</h3>
              </div>
              <div className="lg:w-5/12">
                <p className="text-base text-slate-600 font-light leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
