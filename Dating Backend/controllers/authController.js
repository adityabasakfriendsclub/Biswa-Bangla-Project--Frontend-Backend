const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateOtp, getOtpExpiry } = require("../utils/generateOtp");
const { sendOtpSms, sendPasswordResetOtp } = require("../utils/twilioService");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, password, confirmPassword } =
      req.body;

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

    const user = await User.create({
      firstName,
      lastName,
      phone,
      gender,
      password,
      otp: hashedOtp,
      otpExpires: getOtpExpiry(5),
      isVerified: false,
    });

    await sendOtpSms(phone, otp);

    res.status(201).json({
      success: true,
      message: "Registered successfully. OTP sent.",
      data: { userId: user._id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!/^\d{6}$/.test(otp)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP format" });
    }

    const user = await User.findById(userId).select("+otp +otpExpires");

    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const valid = await user.compareOTP(otp);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Wrong OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Account verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= RESEND OTP =================
exports.resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user || user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const otp = generateOtp();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = getOtpExpiry(5);
    await user.save();

    await sendOtpSms(user.phone, otp);

    res.json({ success: true, message: "OTP resent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).select("+password");
    if (!user || !user.isVerified) {
      return res.status(401).json({ success: false, message: "Invalid login" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid login" });
    }

    res.json({ success: true, message: "Login successful", user });
  } catch (error) {
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
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const otp = generateOtp();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = getOtpExpiry(5);
    user.tempPassword = await bcrypt.hash(newPassword, 10);
    await user.save();

    await sendPasswordResetOtp(phone, otp);

    res.json({
      success: true,
      message: "Password reset OTP sent",
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= VERIFY FORGOT OTP =================
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId).select(
      "+otp +otpExpires +tempPassword"
    );

    if (!user || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const valid = await user.compareOTP(otp);
    if (!valid) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.password = user.tempPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.tempPassword = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
