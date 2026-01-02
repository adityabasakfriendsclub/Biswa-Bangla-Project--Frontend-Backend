// FILE: frontend/src/services/agoraService.js
// ✅ Agora RTC Client Service

import AgoraRTC from "agora-rtc-sdk-ng";

class AgoraService {
  constructor() {
    this.client = null;
    this.localAudioTrack = null;
    this.localVideoTrack = null;
    this.remoteUsers = {};
    this.isJoined = false;
  }

  /**
   * Initialize Agora client
   */
  async init() {
    try {
      this.client = AgoraRTC.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      console.log("✅ Agora client initialized");

      // Setup event listeners
      this.setupEventListeners();

      return this.client;
    } catch (error) {
      console.error("❌ Agora init error:", error);
      throw error;
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // User published
    this.client.on("user-published", async (user, mediaType) => {
      console.log("👤 User published:", user.uid, mediaType);

      await this.client.subscribe(user, mediaType);
      console.log("✅ Subscribed to user:", user.uid);

      if (mediaType === "video") {
        this.remoteUsers[user.uid] = user.videoTrack;
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    // User unpublished
    this.client.on("user-unpublished", (user, mediaType) => {
      console.log("👤 User unpublished:", user.uid, mediaType);

      if (mediaType === "video") {
        delete this.remoteUsers[user.uid];
      }
    });

    // User left
    this.client.on("user-left", (user) => {
      console.log("👤 User left:", user.uid);
      delete this.remoteUsers[user.uid];
    });

    // Connection state change
    this.client.on("connection-state-change", (curState, prevState) => {
      console.log(`🔄 Connection state: ${prevState} -> ${curState}`);
    });

    // Network quality
    this.client.on("network-quality", (stats) => {
      console.log("📊 Network quality:", stats);
    });
  }

  /**
   * Join channel
   */
  async join(appId, channel, token, uid) {
    try {
      if (!this.client) {
        await this.init();
      }

      console.log("🔌 Joining channel:", channel);

      await this.client.join(appId, channel, token, uid);
      this.isJoined = true;

      console.log("✅ Joined channel successfully");
      return true;
    } catch (error) {
      console.error("❌ Join channel error:", error);
      throw error;
    }
  }

  /**
   * Create and publish local tracks
   */
  async createAndPublishTracks(audioEnabled = true, videoEnabled = true) {
    try {
      console.log("🎥 Creating local tracks...");

      // Create tracks
      if (audioEnabled) {
        this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        console.log("✅ Audio track created");
      }

      if (videoEnabled) {
        this.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
          encoderConfig: "720p_2",
        });
        console.log("✅ Video track created");
      }

      // Publish tracks
      const tracks = [];
      if (this.localAudioTrack) tracks.push(this.localAudioTrack);
      if (this.localVideoTrack) tracks.push(this.localVideoTrack);

      if (tracks.length > 0) {
        await this.client.publish(tracks);
        console.log("✅ Tracks published");
      }

      return {
        audioTrack: this.localAudioTrack,
        videoTrack: this.localVideoTrack,
      };
    } catch (error) {
      console.error("❌ Create tracks error:", error);
      throw error;
    }
  }

  /**
   * Toggle microphone
   */
  async toggleMic() {
    if (this.localAudioTrack) {
      await this.localAudioTrack.setEnabled(!this.localAudioTrack.enabled);
      return this.localAudioTrack.enabled;
    }
    return false;
  }

  /**
   * Toggle camera
   */
  async toggleCamera() {
    if (this.localVideoTrack) {
      await this.localVideoTrack.setEnabled(!this.localVideoTrack.enabled);
      return this.localVideoTrack.enabled;
    }
    return false;
  }

  /**
   * Switch camera (front/back on mobile)
   */
  async switchCamera() {
    if (this.localVideoTrack) {
      await this.localVideoTrack.switchDevice();
      return true;
    }
    return false;
  }

  /**
   * Get remote users
   */
  getRemoteUsers() {
    return this.remoteUsers;
  }

  /**
   * Get local video track
   */
  getLocalVideoTrack() {
    return this.localVideoTrack;
  }

  /**
   * Leave channel
   */
  async leave() {
    try {
      console.log("🔌 Leaving channel...");

      // Stop and close local tracks
      if (this.localAudioTrack) {
        this.localAudioTrack.stop();
        this.localAudioTrack.close();
        this.localAudioTrack = null;
      }

      if (this.localVideoTrack) {
        this.localVideoTrack.stop();
        this.localVideoTrack.close();
        this.localVideoTrack = null;
      }

      // Leave channel
      if (this.isJoined) {
        await this.client.leave();
        this.isJoined = false;
      }

      // Clear remote users
      this.remoteUsers = {};

      console.log("✅ Left channel successfully");
    } catch (error) {
      console.error("❌ Leave channel error:", error);
      throw error;
    }
  }

  /**
   * Cleanup (destroy client)
   */
  destroy() {
    this.leave();
    this.client = null;
  }
}

// Export singleton instance
export default new AgoraService();
