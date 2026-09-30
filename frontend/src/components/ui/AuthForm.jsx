"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => {
          const isPassword = field.type === "password";
          const shown = showPasswords[field.name];

          return (
            <div key={field.name}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-slate-700 mb-1"
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
                    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900",
                    "placeholder:text-slate-400 transition",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
                    isPassword && "pr-10"
                  )}
                />
                {isPassword && (
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
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
          <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed",
            accent
          )}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Please wait…" : submitLabel}
        </button>
      </form>

      {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
    </div>
  );
}
