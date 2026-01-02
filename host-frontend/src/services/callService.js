// FILE: frontend/src/services/callService.js
// ✅ Video Call API Service

import api from "./api";

export const callAPI = {
  /**
   * Initiate call to host
   */
  initiateCall: async (hostId, deviceInfo = null) => {
    try {
      const response = await api.post("/calls/initiate", {
        hostId,
        deviceInfo: deviceInfo || navigator.userAgent,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Initiate call error:", error);
      throw error;
    }
  },

  /**
   * Accept incoming call (host only)
   */
  acceptCall: async (callId, deviceInfo = null) => {
    try {
      const response = await api.post(`/calls/calls/${callId}/accept`, {
        deviceInfo: deviceInfo || navigator.userAgent,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Accept call error:", error);
      throw error;
    }
  },

  /**
   * Reject incoming call (host only)
   */
  rejectCall: async (callId, reason = null) => {
    try {
      const response = await api.post(`/calls/calls/${callId}/reject`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Reject call error:", error);
      throw error;
    }
  },

  /**
   * End active call
   */
  endCall: async (callId, reason = null) => {
    try {
      const response = await api.post(`/calls/calls/${callId}/end`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error("❌ End call error:", error);
      throw error;
    }
  },

  /**
   * Get call details
   */
  getCallDetails: async (callId) => {
    try {
      const response = await api.get(`/calls/calls/${callId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Get call details error:", error);
      throw error;
    }
  },

  /**
   * Check host availability
   */
  checkHostAvailability: async (hostId) => {
    try {
      const response = await api.get(`/calls/host/${hostId}/availability`);
      return response.data;
    } catch (error) {
      console.error("❌ Check availability error:", error);
      throw error;
    }
  },

  /**
   * Get host call history (host only)
   */
  getHostCallHistory: async (limit = 20) => {
    try {
      const response = await api.get(`/calls/host/history`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Get history error:", error);
      throw error;
    }
  },

  /**
   * Get host earnings summary (host only)
   */
  getHostEarnings: async () => {
    try {
      const response = await api.get(`/calls/host/earnings`);
      return response.data;
    } catch (error) {
      console.error("❌ Get earnings error:", error);
      throw error;
    }
  },

  /**
   * Get Agora config
   */
  getAgoraConfig: async () => {
    try {
      const response = await api.get(`/calls/agora/config`);
      return response.data;
    } catch (error) {
      console.error("❌ Get Agora config error:", error);
      throw error;
    }
  },
};

export default callAPI;
