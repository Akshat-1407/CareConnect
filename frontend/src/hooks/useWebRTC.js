"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getSignalingWebSocketUrl, createPeerConnection, DEFAULT_ICE_SERVERS } from "@/lib/webrtc";
import { endConsultation } from "@/services/consultations";

export function useWebRTC({
  appointmentId,
  role = "patient",
  iceServers = DEFAULT_ICE_SERVERS,
  autoJoin = false,
  onCallEnded,
}) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callStatus, setCallStatus] = useState("idle"); // 'idle' | 'waiting_permission' | 'connecting' | 'connected' | 'reconnecting' | 'ended' | 'failed'
  const [remotePeerJoined, setRemotePeerJoined] = useState(false);
  const [remotePeerInfo, setRemotePeerInfo] = useState(null);

  // Audio / Video control states
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isRemoteAudioMuted, setIsRemoteAudioMuted] = useState(false);
  const [isRemoteVideoOff, setIsRemoteVideoOff] = useState(false);

  // Call duration
  const [callDuration, setCallDuration] = useState(0);
  const [error, setError] = useState(null);

  // Internal refs
  const pcRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const iceCandidateQueue = useRef([]);
  const durationTimerRef = useRef(null);
  const isJoinedRef = useRef(false);

  // Perfect negotiation pattern state refs
  // Patient is polite peer in collision resolution
  const isPolite = role === "patient";
  const makingOfferRef = useRef(false);
  const ignoreOfferRef = useRef(false);

  // Send message over WebSocket
  const sendSignal = useCallback((data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    }
  }, []);

  // Request user camera and microphone
  const initializeLocalMedia = useCallback(async (audioOnly = false) => {
    try {
      setCallStatus("waiting_permission");
      const constraints = {
        audio: true,
        video: !audioOnly ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Failed to access camera/microphone:", err);
      setError("Camera/microphone permission denied. Please allow camera and microphone access.");
      setCallStatus("failed");
      throw err;
    }
  }, []);

  // Initiate an offer
  const startNegotiation = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc) return;

    try {
      makingOfferRef.current = true;
      if (pc.signalingState === "have-local-offer") {
        await pc.setLocalDescription({ type: "rollback" });
      }
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      if (pc.signalingState !== "stable") return;
      await pc.setLocalDescription(offer);
      sendSignal({
        type: "offer",
        sdp: pc.localDescription,
      });
    } catch (err) {
      console.error("Error creating WebRTC offer:", err);
    } finally {
      makingOfferRef.current = false;
    }
  }, [sendSignal]);

  // Set up RTCPeerConnection and track listeners
  const setupPeerConnection = useCallback((stream) => {
    if (pcRef.current) {
      pcRef.current.close();
    }

    const pc = createPeerConnection(iceServers);
    pcRef.current = pc;

    // Add local tracks to peer connection
    if (stream) {
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
      });
    }

    // Handle remote track received
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      } else {
        setRemoteStream((prev) => {
          const s = prev || new MediaStream();
          s.addTrack(event.track);
          return s;
        });
      }
      setCallStatus("connected");
    };

    // Handle local ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "ice-candidate",
          candidate: event.candidate,
        });
      }
    };

    // Connection state changes
    const handleStateChange = () => {
      const state = pc.connectionState;
      const iceState = pc.iceConnectionState;

      if (state === "connected" || iceState === "connected" || iceState === "completed") {
        setCallStatus("connected");
      } else if (state === "connecting" || iceState === "checking") {
        setCallStatus((prev) => (prev === "connected" ? prev : "connecting"));
      } else if (state === "disconnected" || iceState === "disconnected") {
        setCallStatus("reconnecting");
      } else if (state === "failed" || iceState === "failed") {
        setCallStatus("failed");
        setError("WebRTC connection failed. Please check network connection.");
      }
    };

    pc.onconnectionstatechange = handleStateChange;
    pc.oniceconnectionstatechange = handleStateChange;

    return pc;
  }, [iceServers, sendSignal]);

  // Clean up WebRTC and local tracks
  const cleanupCall = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setRemoteStream(null);
    setRemotePeerJoined(false);
    iceCandidateQueue.current = [];
    isJoinedRef.current = false;
  }, []);

  // Handle incoming signaling messages from other peer
  const handleSignalingMessage = useCallback(async (data) => {
    const pc = pcRef.current;
    if (!pc) return;

    try {
      if (data.type === "peer_joined") {
        setRemotePeerJoined(true);
        setRemotePeerInfo({
          role: data.role,
          name: data.user_name,
          id: data.user_id,
        });

        // Broadcast current local media mute state
        sendSignal({
          type: "media-state",
          isAudioMuted: isAudioMuted,
          isVideoOff: isVideoOff,
        });

        // The doctor initiates the offer when a peer joins
        if (role === "doctor") {
          await startNegotiation();
        }
      } else if (data.type === "peer_left") {
        setRemotePeerJoined(false);
        setRemoteStream(null);
        if (callStatus === "connected") {
          setCallStatus("connecting");
        }
      } else if (data.type === "offer") {
        const offerCollision = makingOfferRef.current || pc.signalingState !== "stable";
        ignoreOfferRef.current = !isPolite && offerCollision;
        if (ignoreOfferRef.current) {
          return;
        }

        // Polite peer rolls back if there is collision
        if (offerCollision) {
          try {
            await pc.setLocalDescription({ type: "rollback" });
          } catch (e) {
            console.warn("Rollback warning:", e);
          }
        }

        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        // Drain queued ICE candidates
        while (iceCandidateQueue.current.length > 0) {
          const candidate = iceCandidateQueue.current.shift();
          try {
            await pc.addIceCandidate(candidate);
          } catch (e) {
            console.error("Error adding queued ICE candidate:", e);
          }
        }

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendSignal({
          type: "answer",
          sdp: pc.localDescription,
        });
      } else if (data.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));

        // Drain queued ICE candidates
        while (iceCandidateQueue.current.length > 0) {
          const candidate = iceCandidateQueue.current.shift();
          try {
            await pc.addIceCandidate(candidate);
          } catch (e) {
            console.error("Error adding queued ICE candidate:", e);
          }
        }
      } else if (data.type === "ice-candidate" && data.candidate) {
        const candidate = new RTCIceCandidate(data.candidate);
        if (pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(candidate);
          } catch (e) {
            console.error("Error adding ICE candidate:", e);
          }
        } else {
          iceCandidateQueue.current.push(candidate);
        }
      } else if (data.type === "media-state") {
        if (data.isAudioMuted !== undefined) {
          setIsRemoteAudioMuted(data.isAudioMuted);
        }
        if (data.isVideoOff !== undefined) {
          setIsRemoteVideoOff(data.isVideoOff);
        }
      } else if (data.type === "end-call" || data.type === "end_call") {
        cleanupCall();
        setCallStatus("ended");
        if (onCallEnded) onCallEnded();
      }
    } catch (err) {
      console.error("Error processing signaling message:", err, data);
    }
  }, [isPolite, role, isAudioMuted, isVideoOff, callStatus, onCallEnded, sendSignal, startNegotiation]);

  // Connect to Django Channels WebSocket
  const connectWebSocket = useCallback(() => {
    const wsUrl = getSignalingWebSocketUrl(appointmentId);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setCallStatus((prev) => (prev === "connected" ? prev : "connecting"));
      sendSignal({ type: "join", role });
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connection_established") {
          // If other peers are already present in room
          if (data.existing_peers && data.existing_peers.length > 0) {
            const peer = data.existing_peers[0];
            setRemotePeerJoined(true);
            setRemotePeerInfo({
              role: peer.role,
              name: peer.user_name,
              id: peer.user_id,
            });

            // If patient joins and doctor is already in room, patient initiates offer
            if (role === "patient") {
              await startNegotiation();
            }
          }
        } else {
          handleSignalingMessage(data);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    socket.onerror = (err) => {
      console.error("Signaling WebSocket error:", err);
      setError("Signaling connection error. Please refresh or check connection.");
    };

    socket.onclose = (event) => {
      if (event.code === 4001) {
        setError("Authentication required to join consultation.");
        setCallStatus("failed");
      } else if (event.code === 4002) {
        setError("Appointment is not confirmed or not eligible for consultation.");
        setCallStatus("failed");
      } else if (event.code === 4003) {
        setError("Access denied: You are not assigned to this consultation.");
        setCallStatus("failed");
      } else if (event.code === 4004) {
        setError("Appointment not found.");
        setCallStatus("failed");
      }
    };

    return socket;
  }, [appointmentId, role, sendSignal, handleSignalingMessage, startNegotiation]);

  // Join Call action
  const joinCall = useCallback(async () => {
    if (isJoinedRef.current) return;
    isJoinedRef.current = true;
    setError(null);

    try {
      const stream = localStreamRef.current || (await initializeLocalMedia());
      setupPeerConnection(stream);
      connectWebSocket();
    } catch (err) {
      isJoinedRef.current = false;
      console.error("Failed to join call:", err);
    }
  }, [initializeLocalMedia, setupPeerConnection, connectWebSocket]);


  // End Call action
  const endCall = useCallback(async () => {
    sendSignal({ type: "end-call" });
    cleanupCall();
    setCallStatus("ended");

    try {
      await endConsultation(appointmentId);
    } catch (err) {
      console.error("Failed to mark consultation ended on backend:", err);
    }

    if (onCallEnded) onCallEnded();
  }, [sendSignal, cleanupCall, appointmentId, onCallEnded]);

  // Toggle Microphone Mute
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newMuted = !audioTrack.enabled;
        setIsAudioMuted(newMuted);
        sendSignal({
          type: "media-state",
          isAudioMuted: newMuted,
        });
      }
    }
  }, [sendSignal]);

  // Toggle Camera Off/On
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newOff = !videoTrack.enabled;
        setIsVideoOff(newOff);
        sendSignal({
          type: "media-state",
          isVideoOff: newOff,
        });
      }
    }
  }, [sendSignal]);

  // Call duration counter
  useEffect(() => {
    if (callStatus === "connected") {
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    }
    return () => {
      if (durationTimerRef.current) clearInterval(durationTimerRef.current);
    };
  }, [callStatus]);

  // Optional autoJoin
  useEffect(() => {
    if (autoJoin) {
      joinCall();
    }
    return () => {
      cleanupCall();
    };
  }, [autoJoin]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
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
    joinCall,
    endCall,
    toggleAudio,
    toggleVideo,
    initializeLocalMedia,
  };
}
