// // models/User.js - UPDATED VERSION
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     nickname: {
//       type: String,
//       trim: true,
//       default: "",
//     },
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     gender: {
//       type: String,
//       required: true,
//       enum: ["Male", "Female", "Others"],
//     },
//     dateOfBirth: {
//       type: Date,
//       default: null,
//     },
//     profileImage: {
//       type: String,
//       default: null,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//     },
//     walletBalance: {
//       type: Number,
//       default: 0,
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     otp: {
//       type: String,
//       select: false,
//     },
//     otpExpires: {
//       type: Number,
//     },
//     tempPassword: {
//       type: String,
//       select: false,
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;

//   if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$")) {
//     return;
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Compare password
// userSchema.methods.comparePassword = async function (plainPassword) {
//   return bcrypt.compare(plainPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);

// new2
// models/User.js - Add these fields to your existing schema
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
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
    nickname: {
      type: String,
      trim: true,
      default: "",
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
      enum: ["Male", "Female", "Others"],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // ✅ NEW FIELDS - Add these
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastActive: {
      type: Date,
      default: null,
    },
    totalCalls: {
      type: Number,
      default: 0,
    },
    totalMinutes: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    deviceInfo: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    // END NEW FIELDS
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Number,
    },
    tempPassword: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for age
userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
