// FILE: backend/models/Call.js
// ✅ Call model for tracking video calls and earnings

const mongoose = require("mongoose");

const callSchema = new mongoose.Schema(
  {
    // Call Participants
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
      index: true,
    },
    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Host",
      required: true,
      index: true,
    },

    // Call Details
    channelName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    agoraToken: {
      type: String,
      required: true,
    },
    agoraUid: {
      type: Number,
      required: true,
    },

    // Call Status
    status: {
      type: String,
      enum: [
        "pending",
        "ringing",
        "active",
        "completed",
        "rejected",
        "missed",
        "failed",
      ],
      default: "pending",
      index: true,
    },

    // Timing
    callInitiatedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    callStartedAt: {
      type: Date,
      default: null,
    },
    callEndedAt: {
      type: Date,
      default: null,
    },

    // Duration (in seconds)
    totalDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Earnings
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
    amountEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    // End Reason
    endedBy: {
      type: String,
      enum: ["user", "host", "system", "timeout"],
      default: null,
    },
    endReason: {
      type: String,
      default: null,
    },

    // Metadata
    userDeviceInfo: {
      type: String,
      default: null,
    },
    hostDeviceInfo: {
      type: String,
      default: null,
    },
    callQuality: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==================== INDEXES ====================
callSchema.index({ userId: 1, createdAt: -1 });
callSchema.index({ hostId: 1, createdAt: -1 });
callSchema.index({ status: 1, createdAt: -1 });
callSchema.index({ channelName: 1 }, { unique: true });

// ==================== VIRTUAL: Duration in Minutes ====================
callSchema.virtual("durationInMinutes").get(function () {
  return Math.floor(this.totalDuration / 60);
});

// ==================== METHOD: Calculate Earnings ====================
callSchema.methods.calculateEarnings = function () {
  // 1 point per minute (round down)
  const minutes = Math.floor(this.totalDuration / 60);
  this.pointsEarned = minutes;

  // 1 point = ₹8
  this.amountEarned = minutes * 8;

  return {
    points: this.pointsEarned,
    amount: this.amountEarned,
    minutes: minutes,
  };
};

// ==================== METHOD: Start Call ====================
callSchema.methods.startCall = function () {
  this.status = "active";
  this.callStartedAt = new Date();
  return this.save();
};

// ==================== METHOD: End Call ====================
callSchema.methods.endCall = async function (endedBy, endReason) {
  this.status = "completed";
  this.callEndedAt = new Date();
  this.endedBy = endedBy;
  this.endReason = endReason;

  // Calculate duration
  if (this.callStartedAt) {
    const durationMs = this.callEndedAt - this.callStartedAt;
    this.totalDuration = Math.floor(durationMs / 1000); // Convert to seconds
  }

  // Calculate earnings
  this.calculateEarnings();

  await this.save();

  // Update host's earnings
  const Host = mongoose.model("Host");
  await Host.findByIdAndUpdate(this.hostId, {
    $inc: {
      earningPoints: this.pointsEarned,
      walletBalance: this.amountEarned,
    },
  });

  return this;
};

// ==================== STATIC: Get Host Stats ====================
callSchema.statics.getHostStats = async function (hostId) {
  const stats = await this.aggregate([
    {
      $match: {
        hostId: mongoose.Types.ObjectId(hostId),
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalCalls: { $sum: 1 },
        totalMinutes: { $sum: { $divide: ["$totalDuration", 60] } },
        totalPoints: { $sum: "$pointsEarned" },
        totalEarnings: { $sum: "$amountEarned" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalCalls: 0,
      totalMinutes: 0,
      totalPoints: 0,
      totalEarnings: 0,
    }
  );
};

// ==================== STATIC: Get Active Call for Host ====================
callSchema.statics.getActiveCallForHost = function (hostId) {
  return this.findOne({
    hostId,
    status: { $in: ["pending", "ringing", "active"] },
  });
};

// ==================== STATIC: Get Recent Calls ====================
callSchema.statics.getRecentCalls = function (userId, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("hostId", "firstName lastName profilePicture")
    .lean();
};

module.exports = mongoose.model("Call", callSchema);
