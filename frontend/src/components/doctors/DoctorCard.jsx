import Link from "next/link";
import { Stethoscope, Award, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DoctorCard({ doctor }) {
  return (
    <Card className="flex flex-col justify-between border-slate-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
              {doctor.first_name ? doctor.first_name[0] : "D"}
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {doctor.full_name}
              </CardTitle>
              <p className="text-xs text-slate-500 font-medium">
                {doctor.qualification || "Certified Specialist"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
            {doctor.specialization}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 py-2 flex-grow">
        {doctor.bio && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-teal-600" />
            <span>{doctor.experience_years} years exp.</span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 justify-end">
            <span>₹{doctor.consultation_fee}</span>
            <span className="text-slate-400 font-normal">/ visit</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-slate-100">
        <Link href={`/patient/book/${doctor.id}`} className="w-full">
          <Button className="w-full gap-2 bg-teal-600 hover:bg-teal-700 text-white">
            Book Appointment <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
