// const express = require("express");
// const router = express.Router();
// const {
//   login,
//   getDashboardStats,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   getRecentUsers,
// } = require("../controllers/adminController");
// const { protect } = require("../middleware/adminAuth");

// // @route   POST /api/admin/login
// // @desc    Admin login
// // @access  Public
// router.post("/login", login);

// // @route   GET /api/admin/stats
// // @desc    Get dashboard statistics
// // @access  Private (Admin only)
// router.get("/stats", protect, getDashboardStats);

// // @route   GET /api/admin/users
// // @desc    Get all users with pagination and filters
// // @access  Private (Admin only)
// router.get("/users", protect, getAllUsers);

// // @route   GET /api/admin/users/recent
// // @desc    Get recent users
// // @access  Private (Admin only)
// router.get("/users/recent", protect, getRecentUsers);

// // @route   GET /api/admin/users/:id
// // @desc    Get single user by ID
// // @access  Private (Admin only)
// router.get("/users/:id", protect, getUserById);

// // @route   PUT /api/admin/users/:id
// // @desc    Update user
// // @access  Private (Admin only)
// router.put("/users/:id", protect, updateUser);

// // @route   DELETE /api/admin/users/:id
// // @desc    Delete user
// // @access  Private (Admin only)
// router.delete("/users/:id", protect, deleteUser);

// module.exports = router;

// new2
// routes/admin.js - ENHANCED VERSION
const express = require("express");
const router = express.Router();
const {
  login,
  getDashboardStats,
  getAllUsers,
  getUserById,
  updateUser,
  blockUser,
  deleteUser,
  getRecentUsers,
  getLiveStats,
  getWalletStats,
  getReports,
  updateReportStatus,
  exportUsers,
  getAnalytics,
} = require("../controllers/adminController");
const { protect } = require("../middleware/adminAuth");

// ==================== AUTHENTICATION ====================
// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post("/login", login);

// ==================== DASHBOARD STATS ====================
// @route   GET /api/admin/stats
// @desc    Get comprehensive dashboard statistics
// @access  Private (Admin only)
router.get("/stats", protect, getDashboardStats);

// ==================== LIVE MONITORING ====================
// @route   GET /api/admin/live-stats
// @desc    Get real-time monitoring data (online users, active calls, online hosts)
// @access  Private (Admin only)
router.get("/live-stats", protect, getLiveStats);

// ==================== USER MANAGEMENT ====================
// @route   GET /api/admin/users
// @desc    Get all users with advanced filters and pagination
// @access  Private (Admin only)
router.get("/users", protect, getAllUsers);

// @route   GET /api/admin/users/recent
// @desc    Get recent users
// @access  Private (Admin only)
router.get("/users/recent", protect, getRecentUsers);

// @route   GET /api/admin/users/:id
// @desc    Get single user with detailed info (calls, transactions, stats)
// @access  Private (Admin only)
router.get("/users/:id", protect, getUserById);

// @route   PUT /api/admin/users/:id
// @desc    Update user details (name, gender, verification, wallet)
// @access  Private (Admin only)
router.put("/users/:id", protect, updateUser);

// @route   PUT /api/admin/users/:userId/block
// @desc    Block or unblock a user
// @access  Private (Admin only)
router.put("/users/:userId/block", protect, blockUser);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user permanently
// @access  Private (Admin only)
router.delete("/users/:id", protect, deleteUser);

// @route   GET /api/admin/users/export
// @desc    Export all users data as CSV
// @access  Private (Admin only)
router.get("/users/export", protect, exportUsers);

// ==================== WALLET & EARNINGS ====================
// @route   GET /api/admin/wallet-stats
// @desc    Get wallet and earnings statistics
// @access  Private (Admin only)
router.get("/wallet-stats", protect, getWalletStats);

// ==================== REPORTS & COMPLAINTS ====================
// @route   GET /api/admin/reports
// @desc    Get all user reports with filters
// @access  Private (Admin only)
router.get("/reports", protect, getReports);

// @route   PUT /api/admin/reports/:reportId
// @desc    Update report status (resolve, warn, block user)
// @access  Private (Admin only)
router.put("/reports/:reportId", protect, updateReportStatus);

// ==================== ANALYTICS ====================
// @route   GET /api/admin/analytics
// @desc    Get advanced analytics data
// @access  Private (Admin only)
router.get("/analytics", protect, getAnalytics);

module.exports = router;
