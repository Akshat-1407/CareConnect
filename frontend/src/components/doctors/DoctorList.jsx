import DoctorCard from "./DoctorCard";
import { Stethoscope, Loader2 } from "lucide-react";

export default function DoctorList({ doctors, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm">Loading verified doctors...</p>
      </div>
    );
  }

  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto">
        <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No doctors found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Try adjusting your search query or selecting a different medical specialization.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
