"use client";

import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CallControls({
  isAudioMuted,
  isVideoOff,
  onToggleAudio,
  onToggleVideo,
  onEndCall,
}) {
  return (
    <div className="flex items-center justify-center gap-4 bg-slate-900/85 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-slate-700/60">
      {/* Microphone Toggle Button */}
      <button
        type="button"
        onClick={onToggleAudio}
        title={isAudioMuted ? "Unmute Microphone" : "Mute Microphone"}
        className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
          isAudioMuted
            ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30"
            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
        }`}
      >
        {isAudioMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </button>

      {/* Camera Toggle Button */}
      <button
        type="button"
        onClick={onToggleVideo}
        title={isVideoOff ? "Turn Camera On" : "Turn Camera Off"}
        className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
          isVideoOff
            ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30"
            : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-600"
        }`}
      >
        {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
      </button>

      {/* End Call Button */}
      <button
        type="button"
        onClick={onEndCall}
        title="Leave / End Consultation"
        className="h-12 w-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all hover:scale-105"
      >
        <PhoneOff className="h-5 w-5" />
      </button>
    </div>
  );
}
