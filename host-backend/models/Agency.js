const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema(
  {
    agencyName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    agencyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "agency",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agency", agencySchema);
