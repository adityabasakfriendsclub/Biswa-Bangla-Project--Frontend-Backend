// routes/userProfile.js - NEW FILE
const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
} = require("../controllers/userController");
const { protect } = require("../middleware/userAuth");

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", protect, getProfile);

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", protect, updateProfile);

// @route   POST /api/user/upload-image
// @desc    Upload profile image
// @access  Private
router.post("/upload-image", protect, uploadProfileImage);

module.exports = router;
