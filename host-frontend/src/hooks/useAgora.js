// FILE: frontend/src/hooks/useAgora.js
// ✅ Custom hook for Agora video calling

import { useState, useEffect, useRef } from "react";
import agoraService from "../services/agoraService";

export const useAgora = () => {
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState({});
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  const updateTimerRef = useRef(null);

  /**
   * Join call
   */
  const joinCall = async (appId, channel, token, uid) => {
    try {
      setError(null);

      // Initialize and join
      await agoraService.join(appId, channel, token, uid);

      // Create and publish tracks
      const tracks = await agoraService.createAndPublishTracks(true, true);

      setLocalVideoTrack(tracks.videoTrack);
      setJoined(true);

      // Start update loop for remote users
      updateTimerRef.current = setInterval(() => {
        setRemoteUsers({ ...agoraService.getRemoteUsers() });
      }, 1000);

      return true;
    } catch (err) {
      console.error("❌ Join call error:", err);
      setError(err.message);
      return false;
    }
  };

  /**
   * Leave call
   */
  const leaveCall = async () => {
    try {
      await agoraService.leave();

      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }

      setLocalVideoTrack(null);
      setRemoteUsers({});
      setJoined(false);
      setMicEnabled(true);
      setCameraEnabled(true);
    } catch (err) {
      console.error("❌ Leave call error:", err);
    }
  };

  /**
   * Toggle microphone
   */
  const toggleMic = async () => {
    try {
      const enabled = await agoraService.toggleMic();
      setMicEnabled(enabled);
      return enabled;
    } catch (err) {
      console.error("❌ Toggle mic error:", err);
      return micEnabled;
    }
  };

  /**
   * Toggle camera
   */
  const toggleCamera = async () => {
    try {
      const enabled = await agoraService.toggleCamera();
      setCameraEnabled(enabled);
      return enabled;
    } catch (err) {
      console.error("❌ Toggle camera error:", err);
      return cameraEnabled;
    }
  };

  /**
   * Switch camera (front/back)
   */
  const switchCamera = async () => {
    try {
      await agoraService.switchCamera();
      return true;
    } catch (err) {
      console.error("❌ Switch camera error:", err);
      return false;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (joined) {
        leaveCall();
      }
      if (updateTimerRef.current) {
        clearInterval(updateTimerRef.current);
      }
    };
  }, [joined]);

  return {
    joined,
    localVideoTrack,
    remoteUsers,
    micEnabled,
    cameraEnabled,
    error,
    joinCall,
    leaveCall,
    toggleMic,
    toggleCamera,
    switchCamera,
  };
};
