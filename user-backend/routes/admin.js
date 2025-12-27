const express = require("express");
const router = express.Router();
const {
  login,
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getRecentUsers,
} = require("../controllers/adminController");
const { protect } = require("../middleware/adminAuth");

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post("/login", login);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get("/stats", protect, getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filters
// @access  Private (Admin only)
router.get("/users", protect, getAllUsers);

// @route   GET /api/admin/users/recent
// @desc    Get recent users
// @access  Private (Admin only)
router.get("/users/recent", protect, getRecentUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Private (Admin only)
router.get("/users/:id", protect, getUserById);

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private (Admin only)
router.put("/users/:id", protect, updateUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete("/users/:id", protect, deleteUser);

module.exports = router;
