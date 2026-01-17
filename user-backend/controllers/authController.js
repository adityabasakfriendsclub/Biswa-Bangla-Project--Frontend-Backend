// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const {
//   generateOtp,
//   getOtpExpiry,
//   isOtpExpired,
// } = require("../utils/generateOtp");
// const { sendOtpSms, sendPasswordResetOtp } = require("../utils/twilioService");

// // ================= REGISTER =================
// exports.registerUser = async (req, res) => {
//   try {
//     const { firstName, lastName, phone, gender, password, confirmPassword } =
//       req.body;

//     console.log("📝 Registration request:", {
//       firstName,
//       lastName,
//       phone,
//       gender,
//     });

//     if (
//       !firstName ||
//       !lastName ||
//       !phone ||
//       !gender ||
//       !password ||
//       !confirmPassword
//     ) {
//       return res
//         .status(400)
//         .json({ success: false, message: "All fields required" });
//     }

//     if (password !== confirmPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Passwords do not match" });
//     }

//     const existingUser = await User.findOne({ phone });
//     if (existingUser) {
//       return res
//         .status(409)
//         .json({ success: false, message: "Phone already registered" });
//     }

//     const otp = generateOtp();
//     const hashedOtp = await bcrypt.hash(otp, 10);
//     const otpExpires = getOtpExpiry(10); // ✅ 10 MINUTES

//     console.log("💾 Creating user with OTP expiry:", new Date(otpExpires));

//     const user = await User.create({
//       firstName,
//       lastName,
//       phone,
//       gender,
//       password,
//       otp: hashedOtp,
//       otpExpires: otpExpires,
//       isVerified: false,
//     });

//     // Send OTP via SMS
//     await sendOtpSms(phone, otp);

//     console.log("✅ User created successfully, OTP sent");

//     res.status(201).json({
//       success: true,
//       message: "Registered successfully. OTP sent.",
//       data: {
//         userId: user._id,
//         phone: user.phone,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Registration error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= VERIFY OTP =================
// exports.verifyOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body; // ✅ Changed to use phone instead of userId

//     console.log("🔍 Verify OTP request:", { phone, otp });

//     if (!phone || !otp) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Phone and OTP required" });
//     }

//     if (!/^\d{6}$/.test(otp)) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid OTP format" });
//     }

//     const user = await User.findOne({ phone }).select("+otp +otpExpires");

//     if (!user) {
//       console.log("❌ User not found");
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     console.log("📅 Checking OTP expiry:");
//     console.log("  Current time:", new Date());
//     console.log("  Expiry time:", new Date(user.otpExpires));
//     console.log("  Is expired?", isOtpExpired(user.otpExpires));

//     if (isOtpExpired(user.otpExpires)) {
//       console.log("❌ OTP expired");
//       return res.status(400).json({ success: false, message: "OTP expired" });
//     }

//     const valid = await bcrypt.compare(otp, user.otp);
//     if (!valid) {
//       console.log("❌ Invalid OTP");
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     await user.save();

//     console.log("✅ OTP verified successfully");

//     res.json({
//       success: true,
//       message: "Account verified successfully",
//       data: {
//         userId: user._id,
//         phone: user.phone,
//         isVerified: true,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Verify OTP error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= RESEND OTP =================
// exports.resendOtp = async (req, res) => {
//   try {
//     const { phone } = req.body; // ✅ Changed to use phone instead of userId

//     console.log("🔄 Resend OTP request for:", phone);

//     const user = await User.findOne({ phone });

//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     if (user.isVerified) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User already verified" });
//     }

//     const otp = generateOtp();
//     user.otp = await bcrypt.hash(otp, 10);
//     user.otpExpires = getOtpExpiry(10); // ✅ 10 MINUTES
//     await user.save();

//     await sendOtpSms(user.phone, otp);

//     console.log("✅ New OTP sent");

//     res.json({
//       success: true,
//       message: "New OTP sent successfully",
//     });
//   } catch (error) {
//     console.error("❌ Resend OTP error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= LOGIN =================
// exports.loginUser = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     console.log("🔐 Login request for:", phone);

//     const user = await User.findOne({ phone }).select("+password");

//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     if (!user.isVerified) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Account not verified" });
//     }

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });
//     }

//     console.log("✅ Login successful");

//     res.json({
//       success: true,
//       message: "Login successful",
//       data: {
//         token: "dummy-token-" + user._id, // Replace with real JWT token
//         user: {
//           id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           phone: user.phone,
//           gender: user.gender,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Login error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= FORGOT PASSWORD =================
// exports.forgotPassword = async (req, res) => {
//   try {
//     const { phone, newPassword, confirmPassword } = req.body;

//     if (newPassword !== confirmPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Passwords do not match" });
//     }

//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }

//     const otp = generateOtp();
//     user.otp = await bcrypt.hash(otp, 10);
//     user.otpExpires = getOtpExpiry(10); // ✅ 10 MINUTES
//     user.tempPassword = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     await sendPasswordResetOtp(phone, otp);

//     res.json({
//       success: true,
//       message: "Password reset OTP sent",
//       data: { phone: user.phone },
//     });
//   } catch (error) {
//     console.error("❌ Forgot password error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // ================= VERIFY FORGOT OTP =================
// exports.verifyForgotPasswordOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body;

//     const user = await User.findOne({ phone }).select(
//       "+otp +otpExpires +tempPassword"
//     );

//     if (!user || isOtpExpired(user.otpExpires)) {
//       return res.status(400).json({ success: false, message: "OTP expired" });
//     }

//     const valid = await bcrypt.compare(otp, user.otp);
//     if (!valid) {
//       return res.status(400).json({ success: false, message: "Invalid OTP" });
//     }

//     user.password = user.tempPassword;
//     user.otp = undefined;
//     user.otpExpires = undefined;
//     user.tempPassword = undefined;
//     await user.save();

//     res.json({ success: true, message: "Password reset successful" });
//   } catch (error) {
//     console.error("❌ Verify forgot password error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// new 2

// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateOtp,
  getOtpExpiry,
  isOtpExpired,
} = require("../utils/generateOtp");
const { sendOtpSms, sendPasswordResetOtp } = require("../utils/twilioService");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, password, confirmPassword } =
      req.body;

    console.log("📝 Registration request:", {
      firstName,
      lastName,
      phone,
      gender,
    });

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Phone already registered" });
    }

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = getOtpExpiry(10); // 10 minutes

    const user = await User.create({
      firstName,
      lastName,
      phone,
      gender,
      password,
      otp: hashedOtp,
      otpExpires,
      isVerified: false,
    });

    await sendOtpSms(phone, otp);
    console.log("✅ User created and OTP sent");

    res.status(201).json({
      success: true,
      message: "Registered successfully. OTP sent.",
      data: { userId: user._id, phone: user.phone },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and OTP required" });
    }

    const user = await User.findOne({ phone }).select("+otp +otpExpires");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (isOtpExpired(user.otpExpires)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const valid = await bcrypt.compare(otp, user.otp);
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Account verified successfully",
      data: { userId: user._id, phone: user.phone, isVerified: true },
    });
  } catch (error) {
    console.error("❌ Verify OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= RESEND OTP =================
exports.resendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isVerified)
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });

    const otp = generateOtp();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = getOtpExpiry(10);
    await user.save();

    await sendOtpSms(phone, otp);
    res.json({ success: true, message: "New OTP sent successfully" });
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN (JWT VERSION) =================
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("🔐 Login request for:", phone);

    const user = await User.findOne({ phone }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(401)
        .json({ success: false, message: "Account not verified" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    console.log("✅ Login successful");

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          gender: user.gender,
          walletBalance: user.walletBalance,
        },
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
  try {
    const { phone, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({ phone });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = generateOtp();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = getOtpExpiry(10);
    user.tempPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    await sendPasswordResetOtp(phone, otp);
    res.json({
      success: true,
      message: "Password reset OTP sent",
      data: { phone },
    });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= VERIFY FORGOT PASSWORD OTP =================
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const user = await User.findOne({ phone }).select(
      "+otp +otpExpires +tempPassword"
    );

    if (!user || isOtpExpired(user.otpExpires)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const valid = await bcrypt.compare(otp, user.otp);
    if (!valid)
      return res.status(400).json({ success: false, message: "Invalid OTP" });

    user.password = user.tempPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.tempPassword = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Verify forgot password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
