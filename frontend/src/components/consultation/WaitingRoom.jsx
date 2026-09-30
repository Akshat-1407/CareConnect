"use client";

import { useEffect, useRef } from "react";
import { Video, Mic, MicOff, VideoOff, Stethoscope, User, Calendar, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function formatTimeString(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

export default function WaitingRoom({
  consultationData,
  role = "patient",
  localStream,
  isAudioMuted,
  isVideoOff,
  onToggleAudio,
  onToggleVideo,
  onJoin,
  onInitMedia,
}) {
  const videoRef = useRef(null);
  const isDoctor = role === "doctor";

  useEffect(() => {
    if (!localStream && onInitMedia) {
      onInitMedia().catch(() => {});
    }
  }, [localStream, onInitMedia]);

  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const doctorName = consultationData?.doctor?.name || "Doctor";
  const patientName = consultationData?.patient?.name || "Patient";
  const slot = consultationData?.slot;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <Badge variant="secondary" className="mb-2 bg-teal-50 text-teal-700 border-teal-200">
          Ready to Connect
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Virtual Consultation Room
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Check your camera and microphone preview before joining the secure call.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Camera Mirror Preview */}
        <div className="md:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700 flex items-center justify-center">
            {localStream && !isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <VideoOff className="h-8 w-8 text-slate-500" />
                </div>
                <p className="text-sm font-medium">Camera is turned off</p>
                <p className="text-xs text-slate-500 mt-1">Turn on camera to preview video</p>
              </div>
            )}

            {/* Quick Mute/Camera Overlay Buttons */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-950/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={onToggleAudio}
                className={`p-2.5 rounded-full transition ${
                  isAudioMuted ? "bg-rose-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                }`}
                title={isAudioMuted ? "Unmute" : "Mute"}
              >
                {isAudioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              <button
                type="button"
                onClick={onToggleVideo}
                className={`p-2.5 rounded-full transition ${
                  isVideoOff ? "bg-rose-500 text-white" : "bg-white/20 text-white hover:bg-white/30"
                }`}
                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
              >
                {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            End-to-end peer-to-peer encrypted video call
          </p>
        </div>

        {/* Right Column: Appointment Details & Join Action */}
        <div className="md:col-span-5 space-y-5">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900">
                  Appointment Details
                </CardTitle>
                <Badge variant="success" className="text-[10px]">
                  Confirmed
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                  {isDoctor ? <User className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">
                    {isDoctor ? "Patient" : "Doctor"}
                  </span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {isDoctor ? patientName : doctorName}
                  </span>
                </div>
              </div>

              {slot && (
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-teal-600" />
                    <span>{slot.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-teal-600" />
                    <span>
                      {formatTimeString(slot.start_time)} – {formatTimeString(slot.end_time)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            onClick={onJoin}
            size="lg"
            className="w-full py-4 text-base font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/30 gap-2"
          >
            <Video className="h-5 w-5" /> Join Consultation Now
          </Button>
        </div>
      </div>
    </div>
  );
}
