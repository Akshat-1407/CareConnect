"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { User, Stethoscope, VideoOff, MicOff, FileText, AlertCircle, Loader2 } from "lucide-react";
import CallControls from "./CallControls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function VideoCall({
  appointmentId,
  role = "patient",
  consultationData,
  localStream,
  remoteStream,
  callStatus,
  remotePeerJoined,
  remotePeerInfo,
  isAudioMuted,
  isVideoOff,
  isRemoteAudioMuted,
  isRemoteVideoOff,
  callDuration,
  error,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const isDoctor = role === "doctor";

  // Bind local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Bind remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      remoteVideoRef.current.play().catch((err) => {
        console.warn("Remote stream play prevented by autoplay policy:", err);
      });
    }
  }, [remoteStream]);

  const counterpartName = isDoctor
    ? consultationData?.patient?.name || "Patient"
    : consultationData?.doctor?.name || "Doctor";

  return (
    <div className="relative w-full h-[85vh] max-h-[850px] min-h-[500px] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800">
      {/* Top Header Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-bold">
            {isDoctor ? <User className="h-5 w-5 text-teal-300" /> : <Stethoscope className="h-5 w-5 text-teal-300" />}
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>{counterpartName}</span>
              <span className="text-xs font-mono text-slate-400">#{appointmentId}</span>
            </h2>
            <p className="text-[11px] text-slate-300">
              {isDoctor ? "Virtual Patient Consultation" : consultationData?.doctor?.specialization || "Telemedicine Specialist"}
            </p>
          </div>
        </div>

        {/* Center: Live Call Status Pill */}
        <div className="flex items-center gap-2">
          {callStatus === "connected" ? (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE {formatDuration(callDuration)}</span>
            </div>
          ) : callStatus === "connecting" ? (
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
              <Loader2 className="h-3 w-3 animate-spin text-amber-400" />
              <span>Connecting...</span>
            </div>
          ) : callStatus === "reconnecting" ? (
            <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span>Reconnecting...</span>
            </div>
          ) : (
            <Badge variant="secondary" className="text-xs bg-slate-800 text-slate-300">
              {callStatus}
            </Badge>
          )}

          {/* Doctor-only Quick Prescription Link */}
          {isDoctor && (
            <Link href={`/doctor/prescriptions/create/${appointmentId}`} target="_blank">
              <Button size="sm" variant="outline" className="hidden sm:flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 h-8">
                <FileText className="h-3.5 w-3.5" /> Prescription
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Center Video Area */}
      <div className="relative w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden">
        {/* Remote Video Stream - always mounted so ref is immediately bound */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${
            remoteStream && !isRemoteVideoOff ? "block" : "hidden"
          }`}
        />

        {(!remoteStream || isRemoteVideoOff) && (
          <div className="flex flex-col items-center justify-center text-center p-8 z-10">
            <div className="h-24 w-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center mb-4 shadow-xl">
              {isDoctor ? (
                <User className="h-12 w-12 text-slate-400" />
              ) : (
                <Stethoscope className="h-12 w-12 text-slate-400" />
              )}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{counterpartName}</h3>
            <p className="text-xs text-slate-400 max-w-xs">
              {callStatus === "connected" && isRemoteVideoOff
                ? "The other participant has paused their camera."
                : remotePeerJoined
                ? "Establishing peer-to-peer WebRTC connection..."
                : "Waiting for the other participant to join the room..."}
            </p>

            {isRemoteAudioMuted && callStatus === "connected" && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                <MicOff className="h-3.5 w-3.5" /> Participant is muted
              </div>
            )}
          </div>
        )}

        {/* Local Inset PIP Video (Bottom-Right) */}
        <div className="absolute bottom-20 sm:bottom-6 right-4 sm:right-6 w-32 sm:w-48 aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700/80 z-20 transition-all hover:scale-105">
          {localStream && !isVideoOff ? (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-2 text-center">
              <VideoOff className="h-6 w-6 text-slate-500 mb-1" />
              <span className="text-[10px] font-medium text-slate-400">Camera Off</span>
            </div>
          )}

          {/* Local Label Badge */}
          <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
            <span>You</span>
            {isAudioMuted && <MicOff className="h-2.5 w-2.5 text-rose-400" />}
          </div>
        </div>

        {/* Error Alert Overlay */}
        {error && (
          <div className="absolute top-20 inset-x-4 max-w-md mx-auto z-30 bg-rose-600/90 backdrop-blur-md text-white text-xs p-3 rounded-xl shadow-xl flex items-center gap-2 border border-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Floating Bottom Call Controls */}
      <div className="absolute bottom-5 inset-x-0 z-20 flex justify-center px-4">
        <CallControls
          isAudioMuted={isAudioMuted}
          isVideoOff={isVideoOff}
          onToggleAudio={onToggleAudio}
          onToggleVideo={onToggleVideo}
          onEndCall={onEndCall}
        />
      </div>
    </div>
  );
}
