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

  // ✅ NEW FIELDS
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
    sparse: true, // Allows null values while maintaining uniqueness for non-null values
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

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
