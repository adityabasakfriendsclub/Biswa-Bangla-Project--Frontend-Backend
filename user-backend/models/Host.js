const mongoose = require("mongoose");

// Host Schema
const hostSchema = new mongoose.Schema(
  {
    // ==================== BASIC INFO ====================
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "others"],
    },
    dateOfBirth: {
      type: Date,
    },

    // ==================== PROFILE ====================
    bio: {
      type: String,
      default: "",
    },
    interests: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      default: "",
    },

    // ==================== MEDIA ====================
    profilePicture: {
      type: String,
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    videos: {
      type: [String],
      default: [],
    },

    // ==================== HOST STATUS ====================
    isHost: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastOnline: {
      type: Date,
      default: null,
    },

    // ⭐ STATUS FIELD - IMPORTANT
    status: {
      type: String,
      enum: ["online", "offline", "busy"],
      default: "offline",
    },

    // ==================== STATS ====================
    totalCalls: {
      type: Number,
      default: 0,
    },
    totalMinutes: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // ==================== WALLET ====================
    earningPoints: {
      type: Number,
      default: 0,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "hosts",
  }
);

// ==================== METHODS ====================
hostSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.bankDetails;
  delete obj.kyc;
  delete obj.__v;
  return obj;
};

// Export schema only
module.exports = hostSchema;
