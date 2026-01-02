// FILE: backend/services/callService.js
// ✅ Call Management Service

const Call = require("../models/Call");
const Host = require("../models/Host");
const agoraService = require("./agoraService");

class CallService {
  /**
   * Initiate a call from user to host
   */
  async initiateCall(userId, hostId, userDeviceInfo = null) {
    try {
      console.log(`📞 Initiating call: User ${userId} -> Host ${hostId}`);

      // ✅ Validate: User exists and is NOT a host
      const user = await Host.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.isHost) {
        throw new Error("❌ SECURITY VIOLATION: Hosts cannot initiate calls");
      }

      // ✅ Validate: Host exists and IS a host
      const host = await Host.findById(hostId);
      if (!host) {
        throw new Error("Host not found");
      }
      if (!host.isHost) {
        throw new Error("Target user is not a host");
      }
      if (!host.isActive) {
        throw new Error("Host account is not active");
      }
      if (!host.isOnline) {
        throw new Error("Host is currently offline");
      }

      // ✅ Check: Host is not already in a call
      const existingCall = await Call.getActiveCallForHost(hostId);
      if (existingCall) {
        throw new Error("Host is currently busy with another call");
      }

      // ✅ Generate Agora credentials
      const agoraCredentials = agoraService.generateUserToken(userId, hostId);

      // ✅ Create call record
      const call = new Call({
        userId,
        hostId,
        channelName: agoraCredentials.channelName,
        agoraToken: agoraCredentials.token,
        agoraUid: agoraCredentials.uid,
        status: "ringing",
        userDeviceInfo,
      });

      await call.save();

      console.log(`✅ Call created: ${call._id}`);
      console.log(`   Channel: ${call.channelName}`);

      return {
        callId: call._id,
        channelName: call.channelName,
        token: call.agoraToken,
        uid: call.agoraUid,
        appId: agoraCredentials.appId,
        host: {
          id: host._id,
          name: `${host.firstName} ${host.lastName}`,
          profilePicture: host.profilePicture,
        },
      };
    } catch (error) {
      console.error("❌ Initiate call error:", error.message);
      throw error;
    }
  }

  /**
   * Host accepts incoming call
   */
  async acceptCall(callId, hostId, hostDeviceInfo = null) {
    try {
      console.log(`✅ Host ${hostId} accepting call ${callId}`);

      const call = await Call.findById(callId);
      if (!call) {
        throw new Error("Call not found");
      }

      // Validate: This host is the receiver
      if (call.hostId.toString() !== hostId.toString()) {
        throw new Error("❌ SECURITY: Not authorized to accept this call");
      }

      // Validate: Call is in ringing state
      if (call.status !== "ringing" && call.status !== "pending") {
        throw new Error(`Cannot accept call in ${call.status} state`);
      }

      // Update call status
      call.hostDeviceInfo = hostDeviceInfo;
      await call.startCall();

      // Generate host token with same channel
      const hostToken = agoraService.generateHostToken(
        call.channelName,
        agoraService.generateUID()
      );

      console.log(`✅ Call accepted and started`);

      return {
        callId: call._id,
        channelName: call.channelName,
        token: hostToken.token,
        uid: hostToken.uid,
        appId: hostToken.appId,
      };
    } catch (error) {
      console.error("❌ Accept call error:", error.message);
      throw error;
    }
  }

  /**
   * Reject incoming call
   */
  async rejectCall(callId, hostId, reason = "rejected by host") {
    try {
      console.log(`❌ Host ${hostId} rejecting call ${callId}`);

      const call = await Call.findById(callId);
      if (!call) {
        throw new Error("Call not found");
      }

      // Validate: This host is the receiver
      if (call.hostId.toString() !== hostId.toString()) {
        throw new Error("❌ SECURITY: Not authorized to reject this call");
      }

      call.status = "rejected";
      call.callEndedAt = new Date();
      call.endedBy = "host";
      call.endReason = reason;
      await call.save();

      console.log(`✅ Call rejected`);

      return { success: true, message: "Call rejected" };
    } catch (error) {
      console.error("❌ Reject call error:", error.message);
      throw error;
    }
  }

  /**
   * End active call
   */
  async endCall(callId, endedBy, reason = "call ended") {
    try {
      console.log(`🔴 Ending call ${callId} by ${endedBy}`);

      const call = await Call.findById(callId);
      if (!call) {
        throw new Error("Call not found");
      }

      // Only end if active
      if (call.status !== "active") {
        throw new Error(`Cannot end call in ${call.status} state`);
      }

      await call.endCall(endedBy, reason);

      console.log(`✅ Call ended:`);
      console.log(
        `   Duration: ${call.totalDuration}s (${call.durationInMinutes} min)`
      );
      console.log(`   Points earned: ${call.pointsEarned}`);
      console.log(`   Amount earned: ₹${call.amountEarned}`);

      return {
        callId: call._id,
        duration: call.totalDuration,
        minutes: call.durationInMinutes,
        pointsEarned: call.pointsEarned,
        amountEarned: call.amountEarned,
      };
    } catch (error) {
      console.error("❌ End call error:", error.message);
      throw error;
    }
  }

  /**
   * Get call details
   */
  async getCallDetails(callId) {
    try {
      const call = await Call.findById(callId)
        .populate("userId", "firstName lastName profilePicture phone")
        .populate("hostId", "firstName lastName profilePicture phone");

      if (!call) {
        throw new Error("Call not found");
      }

      return call;
    } catch (error) {
      console.error("❌ Get call details error:", error.message);
      throw error;
    }
  }

  /**
   * Get host call history
   */
  async getHostCallHistory(hostId, limit = 20) {
    try {
      const calls = await Call.find({ hostId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate("userId", "firstName lastName profilePicture")
        .lean();

      return calls;
    } catch (error) {
      console.error("❌ Get history error:", error.message);
      throw error;
    }
  }

  /**
   * Get host earnings summary
   */
  async getHostEarningsSummary(hostId) {
    try {
      const stats = await Call.getHostStats(hostId);
      return stats;
    } catch (error) {
      console.error("❌ Get earnings error:", error.message);
      throw error;
    }
  }

  /**
   * Check if host is available for calls
   */
  async isHostAvailable(hostId) {
    try {
      const host = await Host.findById(hostId);
      if (!host || !host.isHost || !host.isActive || !host.isOnline) {
        return false;
      }

      // Check for active calls
      const activeCall = await Call.getActiveCallForHost(hostId);
      return !activeCall;
    } catch (error) {
      return false;
    }
  }
}

module.exports = new CallService();
