"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  onSubmit,
  footer,
  accentColor = "teal",
  compact = false,
}) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [showPasswords, setShowPasswords] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const msg =
        err?.data?.detail ||
        err?.data?.non_field_errors?.[0] ||
        err?.data?.username?.[0] ||
        err?.data?.password?.[0] ||
        err?.data?.email?.[0] ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const accent = {
    teal: "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    slate: "bg-slate-700 hover:bg-slate-800 focus:ring-slate-500",
  }[accentColor] ?? "bg-teal-600 hover:bg-teal-700";

  return (
    <div className="w-full mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {subtitle && <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className={cn(compact ? "grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" : "space-y-5")}>
        {fields.map((field) => {
          const isPassword = field.type === "password";
          const shown = showPasswords[field.name];

          return (
            <div key={field.name} className={compact ? "min-w-0" : undefined}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  id={field.name}
                  name={field.name}
                  type={isPassword ? (shown ? "text" : "password") : (field.type ?? "text")}
                  placeholder={field.placeholder ?? ""}
                  required={field.required !== false}
                  autoComplete={field.autoComplete}
                  value={values[field.name]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={cn(
                    "h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-sm text-slate-900 shadow-sm",
                    "placeholder:text-slate-400 transition-all duration-200",
                    "hover:border-slate-300 hover:bg-white focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10",
                    isPassword && "pr-10"
                  )}
                />
                {isPassword && (
                  <button
                    type="button"
                    aria-label={shown ? `Hide ${field.label}` : `Show ${field.label}`}
                    aria-pressed={shown}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    onClick={() =>
                      setShowPasswords((p) => ({ ...p, [field.name]: !p[field.name] }))
                    }
                  >
                    {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {error && (
          <div id="auth-form-error" role="alert" className={cn("flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-5 text-rose-700", compact && "sm:col-span-2")}>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-md transition-all duration-200",
            "hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md mt-8",
            compact && "sm:col-span-2",
            accent
          )}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Please wait…" : submitLabel}
        </button>
      </form>

      {footer && <div className={cn("mt-6 text-center text-sm text-slate-500", compact && "sm:col-span-2")}>{footer}</div>}
    </div>
  );
}
