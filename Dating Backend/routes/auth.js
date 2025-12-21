const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// ================= USER AUTH ROUTES =================
router.post("/register", authController.registerUser);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/login", authController.loginUser);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyForgotPasswordOtp); // ✅ ADD THIS ROUTE

module.exports = router;
