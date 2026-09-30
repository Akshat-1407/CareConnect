import { Search, X } from "lucide-react";

const POPULAR_SPECIALIZATIONS = [
  "All",
  "Cardiology",
  "Dermatology",
  "General Medicine",
];

export default function DoctorSearch({
  searchTerm,
  onSearchChange,
  selectedSpecialization,
  onSpecializationChange,
}) {
  return (
    <div className="space-y-4 mb-8">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search doctor by name or specialization..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm transition"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Specialization Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {POPULAR_SPECIALIZATIONS.map((spec) => {
          const isAll = spec === "All";
          const isActive = isAll ? !selectedSpecialization : selectedSpecialization.toLowerCase() === spec.toLowerCase();

          return (
            <button
              key={spec}
              onClick={() => onSpecializationChange(isAll ? "" : spec)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>
    </div>
  );
}
