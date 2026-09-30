/**
 * Default WebRTC STUN servers for NAT traversal.
 */
export const DEFAULT_ICE_SERVERS = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

/**
 * Builds the WebSocket URL for consultation signaling.
 * Uses NEXT_PUBLIC_WS_URL or defaults to current host with ws/wss protocol.
 * @param {number|string} appointmentId
 */
export function getSignalingWebSocketUrl(appointmentId) {
  const envWs = process.env.NEXT_PUBLIC_WS_URL;
  if (envWs) {
    const base = envWs.endsWith("/") ? envWs.slice(0, -1) : envWs;
    return `${base}/consultations/${appointmentId}/`;
  }

  if (typeof window !== "undefined") {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.hostname;
    // Default backend port is 8000
    const port = process.env.NODE_ENV === "production" ? window.location.port : "8000";
    const portSuffix = port ? `:${port}` : "";
    return `${protocol}//${host}${portSuffix}/ws/consultations/${appointmentId}/`;
  }

  return `ws://localhost:8000/ws/consultations/${appointmentId}/`;
}

/**
 * Creates RTCPeerConnection with specified or default ICE servers.
 * @param {Array} iceServers
 */
export function createPeerConnection(iceServers = DEFAULT_ICE_SERVERS) {
  const config = {
    iceServers: iceServers && iceServers.length > 0 ? iceServers : DEFAULT_ICE_SERVERS,
    iceCandidatePoolSize: 10,
  };
  return new RTCPeerConnection(config);
}
