const express = require("express");
const router = express.Router();
const {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  forgotPassword,
  verifyForgotPasswordOtp,
} = require("../controllers/authController");

// @route   POST /api/dating/auth/register
// @desc    Register new user and send OTP
// @access  Public
router.post("/register", registerUser);

// @route   POST /api/dating/auth/verify-otp
// @desc    Verify OTP and activate account
// @access  Public
router.post("/verify-otp", verifyOtp);

// @route   POST /api/dating/auth/resend-otp
// @desc    Resend OTP to user
// @access  Public
router.post("/resend-otp", resendOtp);

// @route   POST /api/dating/auth/login
// @desc    Login verified user
// @access  Public
router.post("/login", loginUser);

// @route   POST /api/dating/auth/forgot-password
// @desc    Request password reset and send OTP
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   POST /api/dating/auth/verify-forgot-password
// @desc    Verify OTP and reset password
// @access  Public
router.post("/verify-forgot-password", verifyForgotPasswordOtp);

module.exports = router;
