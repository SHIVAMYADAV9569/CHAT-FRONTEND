import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "./SocketContext.jsx";
import { useAuth } from "./AuthProvider.jsx";

const iceServers = {
  iceServers: [
    { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
  ],
};

export default function useCallManager() {
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callPeerId, setCallPeerId] = useState(null);
  const peerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const cleanup = () => {
      socket.off("incomingCall", handleIncomingCall);
      socket.off("callAnswered", handleCallAnswered);
      socket.off("iceCandidate", handleIceCandidate);
      socket.off("callEnded", handleCallEnded);
    };

    const handleIncomingCall = (data) => {
      console.log("Incoming call received:", data);
      setIncomingCall(data);
      setCallType(data.callType);
      setCallPeerId(data.from);
    };

    const handleCallAnswered = async ({ signal }) => {
      console.log("Call answered, setting remote description");
      if (peerRef.current && signal) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        setCallActive(true);
      }
    };

    const handleIceCandidate = async ({ candidate }) => {
      console.log("ICE candidate received");
      if (candidate && peerRef.current) {
        try {
          await peerRef.current.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding ICE candidate", error);
        }
      }
    };

    const handleCallEnded = () => {
      console.log("Call ended by remote user");
      endCall();
    };

    socket.on("incomingCall", handleIncomingCall);
    socket.on("callAnswered", handleCallAnswered);
    socket.on("iceCandidate", handleIceCandidate);
    socket.on("callEnded", handleCallEnded);

    return cleanup;
  }, [socket]);

  const closeStreams = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    setCallActive(false);
    setCallType(null);
    setCallPeerId(null);
    setIncomingCall(null);
  };

  const preparePeer = (targetId) => {
    const pc = new RTCPeerConnection(iceServers);
    peerRef.current = pc;

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("iceCandidate", {
          to: targetId,
          candidate: event.candidate,
        });
      }
    };

    return pc;
  };

  const callUser = async (targetId, type) => {
    if (!socket || !authUser?.user?._id || !targetId) {
      console.error("Missing socket, authUser, or targetId");
      alert("Connection error. Please try again.");
      return;
    }

    try {
      const constraints = type === "video" ? { audio: true, video: true } : { audio: true, video: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      const pc = preparePeer(targetId);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("callUser", {
        userToCall: targetId,
        signalData: offer,
        from: authUser.user._id,
        name: authUser.user.name,
        callType: type,
      });

      console.log("Call initiated to:", targetId, "Type:", type);
      setCallType(type);
      setCallPeerId(targetId);
    } catch (error) {
      console.error("Error initiating call:", error);
      alert("Could not access microphone/camera. Please check permissions.");
      closeStreams();
    }
  };

  const answerCall = async () => {
    if (!incomingCall || !socket) {
      console.error("No incoming call or socket not available");
      return;
    }

    try {
      const constraints = incomingCall.callType === "video" ? { audio: true, video: true } : { audio: true, video: false };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);

      const pc = preparePeer(incomingCall.from);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.signal));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("answerCall", {
        to: incomingCall.from,
        signalData: answer,
      });

      console.log("Call answered");
      setCallActive(true);
      setCallPeerId(incomingCall.from);
      setIncomingCall(null);
    } catch (error) {
      console.error("Error answering call:", error);
      alert("Could not access microphone/camera. Please check permissions.");
      closeStreams();
    }
  };

  const declineCall = () => {
    if (incomingCall && socket) {
      socket.emit("endCall", { to: incomingCall.from });
    }
    closeStreams();
  };

  const endCall = () => {
    if (socket && callPeerId) {
      socket.emit("endCall", { to: callPeerId });
    }
    closeStreams();
  };

  return {
    incomingCall,
    callActive,
    callType,
    localStream,
    remoteStream,
    callUser,
    answerCall,
    declineCall,
    endCall,
  };
}
