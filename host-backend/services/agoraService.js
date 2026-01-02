// FILE: backend/services/agoraService.js
// ✅ Agora RTC Token Generation Service

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const { v4: uuidv4 } = require("uuid");

class AgoraService {
  constructor() {
    this.appId = process.env.AGORA_APP_ID;
    this.appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!this.appId || !this.appCertificate) {
      console.error("❌ Agora credentials missing in .env");
      throw new Error("AGORA_APP_ID and AGORA_APP_CERTIFICATE are required");
    }

    console.log("✅ Agora Service initialized");
    console.log("   App ID:", this.appId.substring(0, 8) + "...");
  }

  /**
   * Generate unique channel name for a call
   * Format: userId_hostId_timestamp
   */
  generateChannelName(userId, hostId) {
    const timestamp = Date.now();
    return `call_${userId}_${hostId}_${timestamp}`;
  }

  /**
   * Generate random UID for Agora
   */
  generateUID() {
    return Math.floor(Math.random() * 100000) + 1;
  }

  /**
   * Generate Agora RTC Token
   * @param {string} channelName - Channel name
   * @param {number} uid - User ID (0 for wildcard)
   * @param {string} role - 'publisher' or 'subscriber'
   * @param {number} expirationTime - Token expiration in seconds (default: 3600 = 1 hour)
   */
  generateToken(
    channelName,
    uid = 0,
    role = "publisher",
    expirationTime = 3600
  ) {
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      const privilegeExpireTime = currentTimestamp + expirationTime;

      // Determine role
      const agoraRole =
        role === "publisher" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

      // Generate token
      const token = RtcTokenBuilder.buildTokenWithUid(
        this.appId,
        this.appCertificate,
        channelName,
        uid,
        agoraRole,
        privilegeExpireTime
      );

      console.log("✅ Agora token generated:");
      console.log(`   Channel: ${channelName}`);
      console.log(`   UID: ${uid}`);
      console.log(`   Role: ${role}`);
      console.log(`   Expires in: ${expirationTime}s`);

      return {
        token,
        channelName,
        uid,
        appId: this.appId,
        expiresAt: privilegeExpireTime,
      };
    } catch (error) {
      console.error("❌ Token generation error:", error);
      throw new Error("Failed to generate Agora token");
    }
  }

  /**
   * Generate token for user (caller)
   */
  generateUserToken(userId, hostId) {
    const channelName = this.generateChannelName(userId, hostId);
    const uid = this.generateUID();

    return this.generateToken(channelName, uid, "publisher", 3600);
  }

  /**
   * Generate token for host (receiver)
   */
  generateHostToken(channelName, uid) {
    return this.generateToken(channelName, uid, "publisher", 3600);
  }

  /**
   * Validate token expiration
   */
  isTokenExpired(expiresAt) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= expiresAt;
  }

  /**
   * Get Agora App ID (for frontend)
   */
  getAppId() {
    return this.appId;
  }
}

// Export singleton instance
module.exports = new AgoraService();
