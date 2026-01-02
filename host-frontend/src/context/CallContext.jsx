// import React, { createContext, useContext, useState, useEffect } from "react";
// import { socket } from "../services/socket";
// import { useAuth } from "./AuthContext";

// const CallContext = createContext(null);

// export const CallProvider = ({ children }) => {
//   const { user } = useAuth();
//   const [currentCall, setCurrentCall] = useState(null);
//   const [incomingCall, setIncomingCall] = useState(null);
//   const [callStatus, setCallStatus] = useState("idle"); // idle, ringing, active, ended

//   useEffect(() => {
//     if (!user) return;

//     // Listen for incoming video calls (hosts only)
//     socket.on("incoming-video-call", (data) => {
//       console.log("📞 Incoming video call:", data);
//       setIncomingCall(data);
//       setCallStatus("ringing");
//     });

//     // Call accepted by host
//     socket.on("video-call-started", (data) => {
//       console.log("✅ Call started:", data);
//       if (currentCall?.callId === data.callId) {
//         setCallStatus("active");
//       }
//     });

//     // Call rejected by host
//     socket.on("video-call-rejected", (data) => {
//       console.log("❌ Call rejected:", data);
//       if (currentCall?.callId === data.callId) {
//         setCallStatus("ended");
//         setCurrentCall(null);
//         alert(`Call rejected: ${data.reason}`);
//       }
//     });

//     // Call ended
//     socket.on("video-call-ended", (data) => {
//       console.log("🔴 Call ended:", data);
//       if (currentCall?.callId === data.callId) {
//         setCallStatus("ended");
//         setCurrentCall(null);
//         setIncomingCall(null);
//       }
//     });

//     // Call failed
//     socket.on("call-failed", (data) => {
//       console.log("❌ Call failed:", data);
//       setCallStatus("idle");
//       setCurrentCall(null);
//       alert(`Call failed: ${data.reason}`);
//     });

//     return () => {
//       socket.off("incoming-video-call");
//       socket.off("video-call-started");
//       socket.off("video-call-rejected");
//       socket.off("video-call-ended");
//       socket.off("call-failed");
//     };
//   }, [user, currentCall]);

//   const initiateCall = (callData) => {
//     setCurrentCall(callData);
//     setCallStatus("ringing");

//     // Emit socket event
//     socket.emit("video-call-request", {
//       callId: callData.callId,
//       hostId: callData.host.id,
//       caller: {
//         id: user.id,
//         name: `${user.firstName} ${user.lastName}`,
//         profilePicture: user.profilePicture,
//       },
//     });
//   };

//   const acceptCall = (callData) => {
//     setCurrentCall({
//       ...incomingCall,
//       ...callData,
//     });
//     setCallStatus("active");
//     setIncomingCall(null);

//     // Emit socket event
//     socket.emit("video-call-accepted", {
//       callId: incomingCall.callId,
//       userId: incomingCall.caller.id,
//       hostId: user.id,
//     });
//   };

//   const rejectCall = (reason = "Call rejected") => {
//     if (incomingCall) {
//       socket.emit("video-call-rejected", {
//         callId: incomingCall.callId,
//         userId: incomingCall.caller.id,
//         hostId: user.id,
//         reason,
//       });
//     }

//     setIncomingCall(null);
//     setCallStatus("idle");
//   };

//   const endCall = (reason = "Call ended") => {
//     if (currentCall) {
//       socket.emit("video-call-ended", {
//         callId: currentCall.callId,
//         endedBy: user.id,
//         reason,
//       });
//     }

//     setCurrentCall(null);
//     setIncomingCall(null);
//     setCallStatus("idle");
//   };

//   const value = {
//     currentCall,
//     incomingCall,
//     callStatus,
//     initiateCall,
//     acceptCall,
//     rejectCall,
//     endCall,
//   };

//   return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
// };

// export const useCall = () => {
//   const context = useContext(CallContext);
//   if (!context) {
//     throw new Error("useCall must be used within CallProvider");
//   }
//   return context;
// };

// export default CallContext;

// new2
// FILE: frontend/src/context/CallContext.jsx
// ✅ FIXED: Safe socket handling with null checks

import React, { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../services/socket";
import { useAuth } from "./AuthContext";

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentCall, setCurrentCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callStatus, setCallStatus] = useState("idle");

  useEffect(() => {
    // ✅ FIX: Check if user exists and socket is available
    if (!user || !socket) {
      console.log("⚠️ User or socket not available yet");
      return;
    }

    console.log("🔌 Setting up call socket listeners for user:", user.id);

    // ✅ FIX: Safely set up event listeners
    const handleIncomingCall = (data) => {
      console.log("📞 Incoming video call:", data);
      setIncomingCall(data);
      setCallStatus("ringing");
    };

    const handleCallStarted = (data) => {
      console.log("✅ Call started:", data);
      if (currentCall?.callId === data.callId) {
        setCallStatus("active");
      }
    };

    const handleCallRejected = (data) => {
      console.log("❌ Call rejected:", data);
      if (currentCall?.callId === data.callId) {
        setCallStatus("ended");
        setCurrentCall(null);
        alert(`Call rejected: ${data.reason}`);
      }
    };

    const handleCallEnded = (data) => {
      console.log("🔴 Call ended:", data);
      if (currentCall?.callId === data.callId) {
        setCallStatus("ended");
        setCurrentCall(null);
        setIncomingCall(null);
      }
    };

    const handleCallFailed = (data) => {
      console.log("❌ Call failed:", data);
      setCallStatus("idle");
      setCurrentCall(null);
      alert(`Call failed: ${data.reason}`);
    };

    // Register listeners
    socket.on("incoming-video-call", handleIncomingCall);
    socket.on("video-call-started", handleCallStarted);
    socket.on("video-call-rejected", handleCallRejected);
    socket.on("video-call-ended", handleCallEnded);
    socket.on("call-failed", handleCallFailed);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up call socket listeners");
      socket.off("incoming-video-call", handleIncomingCall);
      socket.off("video-call-started", handleCallStarted);
      socket.off("video-call-rejected", handleCallRejected);
      socket.off("video-call-ended", handleCallEnded);
      socket.off("call-failed", handleCallFailed);
    };
  }, [user, currentCall]);

  const initiateCall = (callData) => {
    if (!socket) {
      console.error("❌ Socket not available");
      alert("Connection error. Please refresh the page.");
      return;
    }

    setCurrentCall(callData);
    setCallStatus("ringing");

    socket.emit("video-call-request", {
      callId: callData.callId,
      hostId: callData.host.id,
      caller: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        profilePicture: user.profilePicture,
      },
    });

    console.log("📞 Call initiated:", callData.callId);
  };

  const acceptCall = (callData) => {
    if (!socket || !incomingCall) {
      console.error("❌ Cannot accept call: socket or incomingCall missing");
      return;
    }

    setCurrentCall({
      ...incomingCall,
      ...callData,
    });
    setCallStatus("active");
    setIncomingCall(null);

    socket.emit("video-call-accepted", {
      callId: incomingCall.callId,
      userId: incomingCall.caller.id,
      hostId: user.id,
    });

    console.log("✅ Call accepted:", incomingCall.callId);
  };

  const rejectCall = (reason = "Call rejected") => {
    if (!socket || !incomingCall) {
      console.error("❌ Cannot reject call: socket or incomingCall missing");
      return;
    }

    socket.emit("video-call-rejected", {
      callId: incomingCall.callId,
      userId: incomingCall.caller.id,
      hostId: user.id,
      reason,
    });

    setIncomingCall(null);
    setCallStatus("idle");

    console.log("❌ Call rejected:", incomingCall.callId);
  };

  const endCall = (reason = "Call ended") => {
    if (!socket || !currentCall) {
      console.error("❌ Cannot end call: socket or currentCall missing");
      return;
    }

    socket.emit("video-call-ended", {
      callId: currentCall.callId,
      endedBy: user.id,
      reason,
    });

    setCurrentCall(null);
    setIncomingCall(null);
    setCallStatus("idle");

    console.log("🔴 Call ended:", currentCall.callId);
  };

  const value = {
    currentCall,
    incomingCall,
    callStatus,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};

export default CallContext;
