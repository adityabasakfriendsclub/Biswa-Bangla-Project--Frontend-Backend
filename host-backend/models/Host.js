// FILE: backend/models/Host.js
// ✅ UPDATED with videos field

const mongoose = require("mongoose");

const HostSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  gender: {
    type: String,
    required: [true, "Gender is required"],
    enum: ["male", "female", "others"],
  },

  // NEW FIELDS
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  isHost: {
    type: Boolean,
    default: false,
  },
  isHostPremium: {
    type: Boolean,
    default: false,
  },
  interAgencyCode: {
    type: String,
    default: null,
    uppercase: true,
    sparse: true,
    unique: true,
  },

  agencyCode: {
    type: String,
    default: null,
  },
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
  profilePicture: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },

  // HOST HOME FIELDS
  isOnline: {
    type: Boolean,
    default: false,
  },
  lastOnline: {
    type: Date,
    default: null,
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // ✅ IMAGES (up to 5)
  images: {
    type: [String],
    default: [],
    validate: [imagesLimit, "{PATH} exceeds the limit of 5"],
  },

  // ✅ VIDEOS (up to 10)
  videos: {
    type: [String],
    default: [],
    validate: [videosLimit, "{PATH} exceeds the limit of 10"],
  },

  // KYC Documents
  kyc: {
    aadhaarFront: String,
    aadhaarBack: String,
    voterFront: String,
    voterBack: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    verifiedAt: Date,
    rejectionReason: String,
  },

  // Audition Video
  auditionVideo: {
    url: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    uploadedAt: Date,
    rejectionReason: String,
  },

  // Bank Details
  bankDetails: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    accountType: {
      type: String,
      enum: ["savings", "current"],
    },
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
  },

  // Earnings & Wallet
  earningPoints: {
    type: Number,
    default: 0,
  },

  // Withdrawals
  withdrawals: [
    {
      amount: Number,
      points: Number,
      upiId: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      requestedAt: { type: Date, default: Date.now },
      completedAt: Date,
      failureReason: String,
      transactionId: String,
    },
  ],
});

// ✅ Validator for images array (max 5)
function imagesLimit(val) {
  return val.length <= 5;
}

// ✅ Validator for videos array (max 10)
function videosLimit(val) {
  return val.length <= 10;
}

// Update the updatedAt field before saving
HostSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Remove password from JSON responses
HostSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Host", HostSchema);
