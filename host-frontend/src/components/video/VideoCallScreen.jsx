import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  SwitchCamera,
  Maximize2,
} from "lucide-react";
import { useAgora } from "../../hooks/useAgora";
import { useCallTimer } from "../../hooks/useCallTimer";
import { useCall } from "../../context/CallContext";
import { callAPI } from "../../services/callService";

const VideoCallScreen = () => {
  const navigate = useNavigate();
  const { currentCall, endCall } = useCall();
  const {
    joined,
    localVideoTrack,
    remoteUsers,
    micEnabled,
    cameraEnabled,
    joinCall,
    leaveCall,
    toggleMic,
    toggleCamera,
    switchCamera,
  } = useAgora();

  const { formattedTime, pointsEarned } = useCallTimer(joined);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [ending, setEnding] = useState(false);

  // Join call on mount
  useEffect(() => {
    if (currentCall && !joined) {
      const { appId, channelName, token, uid } = currentCall;
      joinCall(appId, channelName, token, uid);
    }
  }, [currentCall, joined]);

  // Play local video
  useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
    }
  }, [localVideoTrack]);

  // Play remote video
  useEffect(() => {
    const remoteUserIds = Object.keys(remoteUsers);
    if (remoteUserIds.length > 0 && remoteVideoRef.current) {
      const firstRemoteUser = remoteUsers[remoteUserIds[0]];
      if (firstRemoteUser) {
        firstRemoteUser.play(remoteVideoRef.current);
      }
    }
  }, [remoteUsers]);

  // Handle end call
  const handleEndCall = async () => {
    if (ending) return;

    setEnding(true);

    try {
      // End call via API
      if (currentCall?.callId) {
        await callAPI.endCall(currentCall.callId, "User ended call");
      }

      // Leave Agora channel
      await leaveCall();

      // Update context
      endCall();

      // Navigate back
      navigate(-1);
    } catch (error) {
      console.error("❌ End call error:", error);
    } finally {
      setEnding(false);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (!currentCall) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl">No active call</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 flex flex-col">
      {/* Remote Video (Full Screen) */}
      <div className="flex-1 relative bg-black">
        <div
          ref={remoteVideoRef}
          className="w-full h-full"
          style={{ objectFit: "cover" }}
        />

        {/* No Remote Video Placeholder */}
        {Object.keys(remoteUsers).length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="w-12 h-12" />
              </div>
              <p className="text-lg">
                Waiting for {currentCall.host?.name || "host"}...
              </p>
            </div>
          </div>
        )}

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-4 right-4 w-32 h-40 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20">
          <div
            ref={localVideoRef}
            className="w-full h-full"
            style={{ objectFit: "cover" }}
          />
          {!cameraEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <VideoOff className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Top Bar - Call Info */}
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div>
              <p className="text-lg font-semibold">{currentCall.host?.name}</p>
              <p className="text-sm text-gray-300">Connected</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-mono">{formattedTime}</p>
              <p className="text-sm text-green-400">+{pointsEarned} points</p>
            </div>
          </div>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 left-4 p-2 bg-black/40 rounded-lg text-white hover:bg-black/60 transition"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800 p-6">
        <div className="max-w-md mx-auto flex items-center justify-center gap-4">
          {/* Toggle Mic */}
          <button
            onClick={toggleMic}
            className={`p-4 rounded-full transition ${
              micEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {micEnabled ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          {/* Toggle Camera */}
          <button
            onClick={toggleCamera}
            className={`p-4 rounded-full transition ${
              cameraEnabled
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {cameraEnabled ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            disabled={ending}
            className="p-4 bg-red-600 hover:bg-red-700 rounded-full transition disabled:opacity-50"
          >
            <PhoneOff className="w-6 h-6 text-white" />
          </button>

          {/* Switch Camera */}
          <button
            onClick={switchCamera}
            className="p-4 bg-gray-700 hover:bg-gray-600 rounded-full text-white transition"
          >
            <SwitchCamera className="w-6 h-6" />
          </button>
        </div>

        {/* Earnings Info */}
        <div className="mt-4 text-center text-white">
          <p className="text-sm text-gray-400">
            Earning 1 point per minute • ₹8 per point
          </p>
          <p className="text-lg font-semibold text-green-400 mt-1">
            Current Earnings: ₹{pointsEarned * 8}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCallScreen;
