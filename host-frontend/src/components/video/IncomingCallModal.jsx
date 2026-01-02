import React, { useState } from "react";
import { Phone, PhoneOff, User } from "lucide-react";
import { callAPI } from "../../services/callService";
import { useCall } from "../../context/CallContext";

const IncomingCallModal = () => {
  const { incomingCall, acceptCall, rejectCall } = useCall();
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  if (!incomingCall) return null;

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const response = await callAPI.acceptCall(incomingCall.callId);

      if (response.success) {
        acceptCall(response.data);
      }
    } catch (error) {
      console.error("❌ Accept call error:", error);
      alert("Failed to accept call: " + error.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await callAPI.rejectCall(incomingCall.callId, "Host declined");
      rejectCall();
    } catch (error) {
      console.error("❌ Reject call error:", error);
    } finally {
      setRejecting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-pulse-slow">
        {/* Caller Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full bg-white p-1">
              {incomingCall.caller?.profilePicture ? (
                <img
                  src={`${
                    import.meta.env.VITE_API_URL || "http://localhost:3000"
                  }${incomingCall.caller.profilePicture}`}
                  alt={incomingCall.caller.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-600" />
                </div>
              )}
            </div>

            {/* Ringing Animation */}
            <div className="absolute -inset-4 rounded-full border-4 border-white animate-ping opacity-75"></div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            {incomingCall.caller?.name || "Unknown Caller"}
          </h2>
          <p className="text-white/80 text-lg mb-1">Incoming Video Call</p>
          <p className="text-white/60 text-sm">Tap to accept or decline</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-8">
          {/* Reject Button */}
          <button
            onClick={handleReject}
            disabled={rejecting || accepting}
            className="flex flex-col items-center gap-2 group disabled:opacity-50"
          >
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl group-hover:bg-red-600 group-hover:scale-110 transition-all duration-200">
              <PhoneOff className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">Decline</span>
          </button>

          {/* Accept Button */}
          <button
            onClick={handleAccept}
            disabled={accepting || rejecting}
            className="flex flex-col items-center gap-2 group disabled:opacity-50"
          >
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-xl group-hover:bg-green-600 group-hover:scale-110 transition-all duration-200 animate-bounce-slow">
              <Phone className="w-10 h-10 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">
              {accepting ? "Connecting..." : "Accept"}
            </span>
          </button>
        </div>

        {/* Earnings Info */}
        <div className="mt-6 p-4 bg-white/20 rounded-xl backdrop-blur-sm">
          <p className="text-center text-white text-sm">
            💰 Earn 1 point per minute • ₹8 per point
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
