"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Calendar, Loader2 } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { getConsultationDetails } from "@/services/consultations";
import { useWebRTC } from "@/hooks/useWebRTC";
import WaitingRoom from "@/components/consultation/WaitingRoom";
import VideoCall from "@/components/consultation/VideoCall";
import CallEnded from "@/components/consultation/CallEnded";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PatientConsultationPage() {
  const { user, loading: authLoading } = useRequireAuth("patient", "/login");
  const params = useParams();
  const router = useRouter();
  const appointmentId = params?.appointmentId;

  const [consultationData, setConsultationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [hasJoined, setHasJoined] = useState(false);

  // Initialize WebRTC hook
  const webrtc = useWebRTC({
    appointmentId,
    role: "patient",
    iceServers: consultationData?.ice_servers,
    onCallEnded: () => {
      // Clean up UI state
    },
  });

  // Fetch consultation details and verify access
  useEffect(() => {
    if (!appointmentId || authLoading) return;

    async function loadData() {
      try {
        setLoading(true);
        setLoadError("");
        const data = await getConsultationDetails(appointmentId);
        setConsultationData(data);
      } catch (err) {
        console.error("Failed to load consultation details:", err);
        setLoadError(
          err?.data?.detail || "You do not have access to this consultation or the appointment was not found."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [appointmentId, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <span className="text-sm font-medium">Verifying consultation access...</span>
      </div>
    );
  }

  // Error / Unauthorized screen
  if (loadError || !consultationData) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Card className="border-rose-200">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
            <p className="text-xs text-slate-500">{loadError || "Consultation is unavailable."}</p>
            <Link href="/patient/appointments">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2">
                Back to My Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not confirmed status check
  if (!consultationData.is_eligible) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <Card className="border-amber-200">
          <CardContent className="pt-8 pb-6 space-y-4">
            <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Calendar className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Consultation Not Available</h2>
            <p className="text-xs text-slate-500">
              Appointment #{appointmentId} is currently{" "}
              <span className="font-semibold text-slate-800">{consultationData.status}</span>. Video
              consultation is only available for confirmed appointments.
            </p>
            <Link href="/patient/appointments">
              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-2">
                View Appointments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Call Ended screen
  if (webrtc.callStatus === "ended") {
    return (
      <CallEnded
        appointmentId={appointmentId}
        role="patient"
        duration={webrtc.callDuration}
      />
    );
  }

  // Main In-Call Screen
  if (hasJoined) {
    return (
      <div className="container mx-auto max-w-6xl px-2 sm:px-4 py-4">
        <VideoCall
          appointmentId={appointmentId}
          role="patient"
          consultationData={consultationData}
          localStream={webrtc.localStream}
          remoteStream={webrtc.remoteStream}
          callStatus={webrtc.callStatus}
          remotePeerJoined={webrtc.remotePeerJoined}
          remotePeerInfo={webrtc.remotePeerInfo}
          isAudioMuted={webrtc.isAudioMuted}
          isVideoOff={webrtc.isVideoOff}
          isRemoteAudioMuted={webrtc.isRemoteAudioMuted}
          isRemoteVideoOff={webrtc.isRemoteVideoOff}
          callDuration={webrtc.callDuration}
          error={webrtc.error}
          onToggleAudio={webrtc.toggleAudio}
          onToggleVideo={webrtc.toggleVideo}
          onEndCall={webrtc.endCall}
        />
      </div>
    );
  }

  // Pre-join Waiting Room
  return (
    <WaitingRoom
      consultationData={consultationData}
      role="patient"
      localStream={webrtc.localStream}
      isAudioMuted={webrtc.isAudioMuted}
      isVideoOff={webrtc.isVideoOff}
      onToggleAudio={webrtc.toggleAudio}
      onToggleVideo={webrtc.toggleVideo}
      onInitMedia={webrtc.initializeLocalMedia}
      onJoin={async () => {
        await webrtc.joinCall();
        setHasJoined(true);
      }}
    />
  );
}
