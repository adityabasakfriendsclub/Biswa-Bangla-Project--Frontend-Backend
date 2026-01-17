// // controllers/adminController.js - UPDATED TO SHOW ONLY REAL DATA
// const Admin = require("../models/Admin");
// const User = require("../models/User");
// const Call = require("../models/Call");
// const Transaction = require("../models/Transaction");
// const Report = require("../models/Report");
// const { generateToken } = require("../middleware/adminAuth");

// // ==================== ADMIN LOGIN ====================
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     console.log("=== ADMIN LOGIN START ===");
//     console.log("Email:", email);

//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide email and password",
//       });
//     }

//     const admin = await Admin.findOne({ email }).select("+password");

//     if (!admin) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     if (!admin.isActive) {
//       return res.status(401).json({
//         success: false,
//         message: "Admin account is deactivated",
//       });
//     }

//     const isPasswordValid = await admin.comparePassword(password);

//     if (!isPasswordValid) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid email or password",
//       });
//     }

//     const token = generateToken(admin._id);

//     console.log("✅ Admin login successful");

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       data: {
//         admin: {
//           id: admin._id,
//           name: admin.name,
//           email: admin.email,
//           role: admin.role,
//         },
//         token,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Admin Login Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error during login",
//     });
//   }
// };

// // ==================== GET DASHBOARD STATS - REAL DATA ONLY ====================
// exports.getDashboardStats = async (req, res) => {
//   try {
//     console.log("📊 Fetching real dashboard stats...");

//     // ✅ Real user counts from database
//     const totalUsers = await User.countDocuments();
//     const verifiedUsers = await User.countDocuments({ isVerified: true });
//     const unverifiedUsers = await User.countDocuments({ isVerified: false });
//     const blockedUsers = await User.countDocuments({ isBlocked: true });

//     // ✅ Real gender distribution
//     const maleUsers = await User.countDocuments({ gender: "Male" });
//     const femaleUsers = await User.countDocuments({ gender: "Female" });
//     const otherUsers = await User.countDocuments({ gender: "Others" });

//     // ✅ Real new users data
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const todayUsers = await User.countDocuments({
//       createdAt: { $gte: today },
//     });

//     const weekAgo = new Date();
//     weekAgo.setDate(weekAgo.getDate() - 7);

//     const weekUsers = await User.countDocuments({
//       createdAt: { $gte: weekAgo },
//     });

//     const monthAgo = new Date();
//     monthAgo.setMonth(monthAgo.getMonth() - 1);

//     const monthUsers = await User.countDocuments({
//       createdAt: { $gte: monthAgo },
//     });

//     // ✅ Real registration trend (last 7 days)
//     const last7Days = [];
//     for (let i = 6; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       date.setHours(0, 0, 0, 0);

//       const nextDate = new Date(date);
//       nextDate.setDate(nextDate.getDate() + 1);

//       const count = await User.countDocuments({
//         createdAt: { $gte: date, $lt: nextDate },
//       });

//       last7Days.push({
//         date: date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//         }),
//         count,
//       });
//     }

//     // ✅ Real call statistics
//     const totalCalls = await Call.countDocuments({ status: "completed" });
//     const ongoingCalls = await Call.countDocuments({ status: "ongoing" });

//     // ✅ Real earnings data
//     const earningsData = await Transaction.aggregate([
//       { $match: { type: "debit", status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const totalEarnings = earningsData.length > 0 ? earningsData[0].total : 0;

//     const monthlyEarningsData = await Transaction.aggregate([
//       {
//         $match: {
//           type: "debit",
//           status: "completed",
//           createdAt: { $gte: monthAgo },
//         },
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const monthlyEarnings =
//       monthlyEarningsData.length > 0 ? monthlyEarningsData[0].total : 0;

//     // ✅ Real pending reports
//     const pendingReports = await Report.countDocuments({ status: "pending" });

//     console.log("✅ Stats fetched successfully");
//     console.log("Total Users:", totalUsers);
//     console.log("Verified Users:", verifiedUsers);
//     console.log("New Today:", todayUsers);

//     return res.status(200).json({
//       success: true,
//       data: {
//         totalUsers,
//         verifiedUsers,
//         unverifiedUsers,
//         blockedUsers,
//         genderDistribution: {
//           male: maleUsers,
//           female: femaleUsers,
//           others: otherUsers,
//         },
//         newUsers: {
//           today: todayUsers,
//           week: weekUsers,
//           month: monthUsers,
//         },
//         registrationTrend: last7Days,
//         calls: {
//           total: totalCalls,
//           ongoing: ongoingCalls,
//         },
//         earnings: {
//           total: totalEarnings,
//           monthly: monthlyEarnings,
//         },
//         reports: {
//           pending: pendingReports,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Stats Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching stats",
//     });
//   }
// };

// // ==================== GET ALL USERS - REAL DATA ====================
// exports.getAllUsers = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       search = "",
//       gender = "",
//       isVerified = "",
//       isBlocked = "",
//       sortBy = "createdAt",
//       order = "desc",
//     } = req.query;

//     const query = {};

//     // Search by name or phone
//     if (search) {
//       query.$or = [
//         { firstName: { $regex: search, $options: "i" } },
//         { lastName: { $regex: search, $options: "i" } },
//         { phone: { $regex: search, $options: "i" } },
//       ];
//     }

//     // Filter by gender
//     if (gender) {
//       query.gender = gender;
//     }

//     // Filter by verification status
//     if (isVerified !== "") {
//       query.isVerified = isVerified === "true";
//     }

//     // Filter by blocked status
//     if (isBlocked !== "") {
//       query.isBlocked = isBlocked === "true";
//     }

//     const sortOrder = order === "asc" ? 1 : -1;
//     const sortOptions = { [sortBy]: sortOrder };

//     const skip = (page - 1) * limit;

//     const users = await User.find(query)
//       .sort(sortOptions)
//       .limit(parseInt(limit))
//       .skip(skip)
//       .select("-otp -otpExpires -tempPassword -password");

//     const totalUsers = await User.countDocuments(query);

//     console.log(`✅ Fetched ${users.length} users from database`);

//     return res.status(200).json({
//       success: true,
//       data: {
//         users,
//         pagination: {
//           currentPage: parseInt(page),
//           totalPages: Math.ceil(totalUsers / limit),
//           totalUsers,
//           perPage: parseInt(limit),
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Users Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching users",
//     });
//   }
// };

// // ==================== GET SINGLE USER - REAL DATA ====================
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select(
//       "-otp -otpExpires -tempPassword -password"
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Get user's real call history
//     const calls = await Call.find({ userId: user._id })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     // Get user's real transaction history
//     const transactions = await Transaction.find({ userId: user._id })
//       .sort({ createdAt: -1 })
//       .limit(10);

//     // Calculate real total spent
//     const totalSpent = await Transaction.aggregate([
//       { $match: { userId: user._id, type: "debit" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Calculate real total minutes
//     const totalMinutes = await Call.aggregate([
//       { $match: { userId: user._id, status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$duration" } } },
//     ]);

//     return res.status(200).json({
//       success: true,
//       data: {
//         user,
//         stats: {
//           totalCalls: calls.length,
//           totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
//           totalMinutes:
//             totalMinutes.length > 0
//               ? Math.floor(totalMinutes[0].total / 60)
//               : 0,
//         },
//         recentCalls: calls,
//         recentTransactions: transactions,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get User Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching user",
//     });
//   }
// };

// // ==================== GET RECENT USERS - REAL DATA ====================
// exports.getRecentUsers = async (req, res) => {
//   try {
//     const limit = parseInt(req.query.limit) || 10;

//     const users = await User.find()
//       .sort({ createdAt: -1 })
//       .limit(limit)
//       .select("-otp -otpExpires -tempPassword -password");

//     console.log(`✅ Fetched ${users.length} recent users`);

//     return res.status(200).json({
//       success: true,
//       data: { users },
//     });
//   } catch (error) {
//     console.error("❌ Get Recent Users Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching recent users",
//     });
//   }
// };

// // ==================== UPDATE USER ====================
// exports.updateUser = async (req, res) => {
//   try {
//     const {
//       isVerified,
//       firstName,
//       lastName,
//       gender,
//       isBlocked,
//       walletBalance,
//     } = req.body;

//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     if (isVerified !== undefined) user.isVerified = isVerified;
//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (gender) user.gender = gender;
//     if (isBlocked !== undefined) user.isBlocked = isBlocked;
//     if (walletBalance !== undefined) user.walletBalance = walletBalance;

//     await user.save();

//     console.log("✅ User updated:", user._id);

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: { user },
//     });
//   } catch (error) {
//     console.error("❌ Update User Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while updating user",
//     });
//   }
// };

// // ==================== BLOCK/UNBLOCK USER ====================
// exports.blockUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const { isBlocked } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     user.isBlocked = isBlocked;
//     await user.save();

//     console.log(`✅ User ${isBlocked ? "blocked" : "unblocked"}:`, userId);

//     return res.status(200).json({
//       success: true,
//       message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
//       data: { user },
//     });
//   } catch (error) {
//     console.error("❌ Block User Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while blocking user",
//     });
//   }
// };

// // ==================== DELETE USER ====================
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     await User.findByIdAndDelete(req.params.id);

//     console.log("✅ User deleted:", req.params.id);

//     return res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("❌ Delete User Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while deleting user",
//     });
//   }
// };

// // ==================== GET LIVE MONITORING DATA - REAL DATA ====================
// exports.getLiveStats = async (req, res) => {
//   try {
//     const hostDBConnection = req.app.get("hostDB");
//     const Host = hostDBConnection.model("Host", require("../models/Host"));

//     // ✅ Real online users count (users active in last 5 minutes)
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
//     const onlineUsers = await User.countDocuments({
//       isOnline: true,
//       lastActive: { $gte: fiveMinutesAgo },
//     });

//     // ✅ Real ongoing calls
//     const activeCalls = await Call.find({ status: "ongoing" })
//       .populate("userId", "firstName lastName phone")
//       .sort({ startTime: -1 });

//     // ✅ Real online hosts
//     const onlineHosts = await Host.find({
//       isOnline: true,
//       isActive: true,
//     }).select("firstName lastName status profilePicture");

//     console.log("✅ Live stats fetched");
//     console.log("Online Users:", onlineUsers);
//     console.log("Active Calls:", activeCalls.length);
//     console.log("Online Hosts:", onlineHosts.length);

//     return res.status(200).json({
//       success: true,
//       data: {
//         onlineUsers,
//         activeCalls: activeCalls.length,
//         activeCallDetails: activeCalls,
//         onlineHosts: onlineHosts.length,
//         onlineHostDetails: onlineHosts,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Live Stats Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching live stats",
//     });
//   }
// };

// // ==================== GET WALLET & EARNINGS - REAL DATA ====================
// exports.getWalletStats = async (req, res) => {
//   try {
//     // ✅ Real total platform earnings
//     const totalEarningsData = await Transaction.aggregate([
//       { $match: { type: "debit", status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const totalEarnings =
//       totalEarningsData.length > 0 ? totalEarningsData[0].total : 0;

//     // ✅ Real monthly earnings
//     const monthAgo = new Date();
//     monthAgo.setMonth(monthAgo.getMonth() - 1);

//     const monthlyEarningsData = await Transaction.aggregate([
//       {
//         $match: {
//           type: "debit",
//           status: "completed",
//           createdAt: { $gte: monthAgo },
//         },
//       },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const monthlyEarnings =
//       monthlyEarningsData.length > 0 ? monthlyEarningsData[0].total : 0;

//     // ✅ Real total user spending
//     const totalSpendingData = await Transaction.aggregate([
//       { $match: { type: "credit", status: "completed" } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);
//     const totalSpending =
//       totalSpendingData.length > 0 ? totalSpendingData[0].total : 0;

//     // ✅ Real active wallets
//     const activeWallets = await User.countDocuments({
//       walletBalance: { $gt: 0 },
//     });

//     // ✅ Real top users by spending
//     const topUsers = await Transaction.aggregate([
//       { $match: { type: "debit" } },
//       { $group: { _id: "$userId", totalSpent: { $sum: "$amount" } } },
//       { $sort: { totalSpent: -1 } },
//       { $limit: 10 },
//     ]);

//     const topUsersDetails = await User.find({
//       _id: { $in: topUsers.map((u) => u._id) },
//     }).select("firstName lastName phone");

//     const topUsersWithDetails = topUsers.map((spending) => {
//       const user = topUsersDetails.find(
//         (u) => u._id.toString() === spending._id.toString()
//       );
//       return {
//         userId: spending._id,
//         name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
//         phone: user ? user.phone : "N/A",
//         totalSpent: spending.totalSpent,
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       data: {
//         totalEarnings,
//         monthlyEarnings,
//         totalSpending,
//         activeWallets,
//         topUsers: topUsersWithDetails,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Wallet Stats Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching wallet stats",
//     });
//   }
// };

// // ==================== GET REPORTS - REAL DATA ====================
// exports.getReports = async (req, res) => {
//   try {
//     const { status = "all", page = 1, limit = 10 } = req.query;

//     const query = {};
//     if (status !== "all") {
//       query.status = status;
//     }

//     const skip = (page - 1) * limit;

//     const reports = await Report.find(query)
//       .populate("userId", "firstName lastName phone")
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip(skip);

//     const totalReports = await Report.countDocuments(query);

//     return res.status(200).json({
//       success: true,
//       data: {
//         reports,
//         pagination: {
//           currentPage: parseInt(page),
//           totalPages: Math.ceil(totalReports / limit),
//           totalReports,
//           perPage: parseInt(limit),
//         },
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Reports Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching reports",
//     });
//   }
// };

// // ==================== UPDATE REPORT STATUS ====================
// exports.updateReportStatus = async (req, res) => {
//   try {
//     const { reportId } = req.params;
//     const { status, action } = req.body;

//     const report = await Report.findById(reportId);

//     if (!report) {
//       return res.status(404).json({
//         success: false,
//         message: "Report not found",
//       });
//     }

//     report.status = status;
//     await report.save();

//     // If action is to block user
//     if (action === "block") {
//       await User.findByIdAndUpdate(report.userId, { isBlocked: true });
//     }

//     console.log("✅ Report updated:", reportId);

//     return res.status(200).json({
//       success: true,
//       message: "Report updated successfully",
//       data: { report },
//     });
//   } catch (error) {
//     console.error("❌ Update Report Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while updating report",
//     });
//   }
// };

// // ==================== EXPORT USERS DATA ====================
// exports.exportUsers = async (req, res) => {
//   try {
//     const users = await User.find()
//       .select(
//         "firstName lastName phone gender isVerified walletBalance createdAt"
//       )
//       .lean();

//     // Convert to CSV format
//     const csvHeader = "Name,Phone,Gender,Verified,Wallet Balance,Registered\n";
//     const csvData = users
//       .map(
//         (u) =>
//           `"${u.firstName} ${u.lastName}","${u.phone}","${u.gender}","${
//             u.isVerified ? "Yes" : "No"
//           }","${u.walletBalance}","${new Date(
//             u.createdAt
//           ).toLocaleDateString()}"`
//       )
//       .join("\n");

//     const csv = csvHeader + csvData;

//     res.setHeader("Content-Type", "text/csv");
//     res.setHeader("Content-Disposition", "attachment; filename=users.csv");
//     return res.status(200).send(csv);
//   } catch (error) {
//     console.error("❌ Export Users Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while exporting users",
//     });
//   }
// };

// // ==================== GET ANALYTICS DATA - REAL DATA ====================
// exports.getAnalytics = async (req, res) => {
//   try {
//     const { period = "7days" } = req.query;

//     let days = 7;
//     if (period === "30days") days = 30;
//     if (period === "90days") days = 90;

//     const dateArray = [];
//     for (let i = days - 1; i >= 0; i--) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       date.setHours(0, 0, 0, 0);
//       dateArray.push(date);
//     }

//     const registrationData = await Promise.all(
//       dateArray.map(async (date) => {
//         const nextDate = new Date(date);
//         nextDate.setDate(nextDate.getDate() + 1);

//         const count = await User.countDocuments({
//           createdAt: { $gte: date, $lt: nextDate },
//         });

//         return {
//           date: date.toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           }),
//           count,
//         };
//       })
//     );

//     return res.status(200).json({
//       success: true,
//       data: {
//         registrationTrend: registrationData,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Get Analytics Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while fetching analytics",
//     });
//   }
// };

// // Export all functions
// module.exports = {
//   login: exports.login,
//   getDashboardStats: exports.getDashboardStats,
//   getAllUsers: exports.getAllUsers,
//   getUserById: exports.getUserById,
//   updateUser: exports.updateUser,
//   blockUser: exports.blockUser,
//   deleteUser: exports.deleteUser,
//   getRecentUsers: exports.getRecentUsers,
//   getLiveStats: exports.getLiveStats,
//   getWalletStats: exports.getWalletStats,
//   getReports: exports.getReports,
//   updateReportStatus: exports.updateReportStatus,
//   exportUsers: exports.exportUsers,
//   getAnalytics: exports.getAnalytics,
// };

// new4
// controllers/adminController.js - UPDATED: REAL DATA + CLEAR DUMMY SECTIONS
// controllers/adminController.js - COMPLETE FIXED VERSION
const Admin = require("../models/Admin");
const User = require("../models/User");
const Call = require("../models/Call");
const Transaction = require("../models/Transaction");
const Report = require("../models/Report");
const { generateToken } = require("../middleware/adminAuth");

// ==================== ADMIN LOGIN ====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("=== ADMIN LOGIN START ===");
    console.log("Email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin._id);
    console.log("✅ Admin login successful");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("❌ Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ==================== 📊 REAL DATA: DASHBOARD STATS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    console.log("📊 Fetching real dashboard stats...");

    // ✅ REAL: User counts from database
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    // ✅ REAL: Gender distribution
    const maleUsers = await User.countDocuments({ gender: "Male" });
    const femaleUsers = await User.countDocuments({ gender: "Female" });
    const otherUsers = await User.countDocuments({ gender: "Others" });

    // ✅ REAL: New users data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today },
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekUsers = await User.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthUsers = await User.countDocuments({
      createdAt: { $gte: monthAgo },
    });

    // ✅ REAL: Registration trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
      });

      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      });
    }

    // ✅ REAL: Call statistics
    const totalCalls = await Call.countDocuments({ status: "completed" });
    const ongoingCalls = await Call.countDocuments({ status: "ongoing" });

    // ✅ REAL: Earnings data
    const earningsData = await Transaction.aggregate([
      { $match: { type: "debit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalEarnings = earningsData.length > 0 ? earningsData[0].total : 0;

    const monthlyEarningsData = await Transaction.aggregate([
      {
        $match: {
          type: "debit",
          status: "completed",
          createdAt: { $gte: monthAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const monthlyEarnings =
      monthlyEarningsData.length > 0 ? monthlyEarningsData[0].total : 0;

    // ✅ REAL: Pending reports
    const pendingReports = await Report.countDocuments({ status: "pending" });

    console.log("✅ Stats fetched successfully");
    console.log("Total Users:", totalUsers);
    console.log("Verified Users:", verifiedUsers);
    console.log("New Today:", todayUsers);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        blockedUsers,
        genderDistribution: {
          male: maleUsers,
          female: femaleUsers,
          others: otherUsers,
        },
        newUsers: {
          today: todayUsers,
          week: weekUsers,
          month: monthUsers,
        },
        registrationTrend: last7Days,
        calls: {
          total: totalCalls,
          ongoing: ongoingCalls,
        },
        earnings: {
          total: totalEarnings,
          monthly: monthlyEarnings,
        },
        reports: {
          pending: pendingReports,
        },
      },
    });
  } catch (error) {
    console.error("❌ Get Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
    });
  }
};

// ==================== GET ALL USERS ====================
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      gender = "",
      isVerified = "",
      isBlocked = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (gender) {
      query.gender = gender;
    }

    if (isVerified !== "") {
      query.isVerified = isVerified === "true";
    }

    if (isBlocked !== "") {
      query.isBlocked = isBlocked === "true";
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .select("-otp -otpExpires -tempPassword -password");

    const totalUsers = await User.countDocuments(query);

    console.log(`✅ Fetched ${users.length} users from database`);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          perPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Get Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// ==================== GET USER BY ID ====================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-otp -otpExpires -tempPassword -password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const calls = await Call.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const transactions = await Transaction.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const totalSpent = await Transaction.aggregate([
      { $match: { userId: user._id, type: "debit" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalMinutes = await Call.aggregate([
      { $match: { userId: user._id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$duration" } } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        user,
        stats: {
          totalCalls: calls.length,
          totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
          totalMinutes:
            totalMinutes.length > 0
              ? Math.floor(totalMinutes[0].total / 60)
              : 0,
        },
        recentCalls: calls,
        recentTransactions: transactions,
      },
    });
  } catch (error) {
    console.error("❌ Get User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// ==================== UPDATE USER ====================
exports.updateUser = async (req, res) => {
  try {
    const {
      isVerified,
      firstName,
      lastName,
      gender,
      isBlocked,
      walletBalance,
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isVerified !== undefined) user.isVerified = isVerified;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    if (walletBalance !== undefined) user.walletBalance = walletBalance;

    await user.save();

    console.log("✅ User updated:", user._id);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("❌ Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};

// ==================== BLOCK/UNBLOCK USER ====================
exports.blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = isBlocked;
    await user.save();

    console.log(`✅ User ${isBlocked ? "blocked" : "unblocked"}:`, userId);

    return res.status(200).json({
      success: true,
      message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
      data: { user },
    });
  } catch (error) {
    console.error("❌ Block User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while blocking user",
    });
  }
};

// ==================== DELETE USER ====================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    console.log("✅ User deleted:", req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

// ==================== GET RECENT USERS ====================
exports.getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-otp -otpExpires -tempPassword -password");

    console.log(`✅ Fetched ${users.length} recent users`);

    return res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("❌ Get Recent Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching recent users",
    });
  }
};

// ==================== 🎭 DEMO: LIVE MONITORING ====================
exports.getLiveStats = async (req, res) => {
  try {
    console.log("🎭 DEMO MODE: Fetching live monitoring data...");

    const onlineUsers = 0; // Demo mode

    const activeCalls = await Call.find({ status: "ongoing" })
      .populate("userId", "firstName lastName phone")
      .sort({ startTime: -1 });

    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", require("../models/Host"));
    const onlineHosts = await Host.find({
      isOnline: true,
      isActive: true,
    }).select("firstName lastName status profilePicture");

    return res.status(200).json({
      success: true,
      demoMode: true,
      data: {
        onlineUsers,
        activeCalls: activeCalls.length,
        activeCallDetails: activeCalls,
        onlineHosts: onlineHosts.length,
        onlineHostDetails: onlineHosts,
      },
    });
  } catch (error) {
    console.error("❌ Get Live Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching live stats",
    });
  }
};

// ==================== 🎭 DEMO: WALLET STATS ====================
exports.getWalletStats = async (req, res) => {
  try {
    const totalEarningsData = await Transaction.aggregate([
      { $match: { type: "debit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalEarnings =
      totalEarningsData.length > 0 ? totalEarningsData[0].total : 0;

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const monthlyEarningsData = await Transaction.aggregate([
      {
        $match: {
          type: "debit",
          status: "completed",
          createdAt: { $gte: monthAgo },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const monthlyEarnings =
      monthlyEarningsData.length > 0 ? monthlyEarningsData[0].total : 0;

    const totalSpendingData = await Transaction.aggregate([
      { $match: { type: "credit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalSpending =
      totalSpendingData.length > 0 ? totalSpendingData[0].total : 0;

    const activeWallets = await User.countDocuments({
      walletBalance: { $gt: 0 },
    });

    const topUsers = await Transaction.aggregate([
      { $match: { type: "debit" } },
      { $group: { _id: "$userId", totalSpent: { $sum: "$amount" } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
    ]);

    const topUsersDetails = await User.find({
      _id: { $in: topUsers.map((u) => u._id) },
    }).select("firstName lastName phone");

    const topUsersWithDetails = topUsers.map((spending) => {
      const user = topUsersDetails.find(
        (u) => u._id.toString() === spending._id.toString()
      );
      return {
        userId: spending._id,
        name: user ? `${user.firstName} ${user.lastName}` : "Unknown",
        phone: user ? user.phone : "N/A",
        totalSpent: spending.totalSpent,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        totalEarnings,
        monthlyEarnings,
        totalSpending,
        activeWallets,
        topUsers: topUsersWithDetails,
      },
    });
  } catch (error) {
    console.error("❌ Get Wallet Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching wallet stats",
    });
  }
};

// ==================== ✅ REAL: REPORTS ====================
exports.getReports = async (req, res) => {
  try {
    const { status = "all", page = 1, limit = 10 } = req.query;

    const query = {};
    if (status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .populate("userId", "firstName lastName phone")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalReports = await Report.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReports / limit),
          totalReports,
          perPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Get Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};

// ==================== UPDATE REPORT STATUS ====================
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, action } = req.body;

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;
    await report.save();

    if (action === "block") {
      await User.findByIdAndUpdate(report.userId, { isBlocked: true });
    }

    console.log("✅ Report updated:", reportId);

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: { report },
    });
  } catch (error) {
    console.error("❌ Update Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating report",
    });
  }
};

// ==================== EXPORT USERS ====================
exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select(
        "firstName lastName phone gender isVerified walletBalance createdAt"
      )
      .lean();

    const csvHeader = "Name,Phone,Gender,Verified,Wallet Balance,Registered\n";
    const csvData = users
      .map(
        (u) =>
          `"${u.firstName} ${u.lastName}","${u.phone}","${u.gender}","${
            u.isVerified ? "Yes" : "No"
          }","${u.walletBalance}","${new Date(
            u.createdAt
          ).toLocaleDateString()}"`
      )
      .join("\n");

    const csv = csvHeader + csvData;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");
    return res.status(200).send(csv);
  } catch (error) {
    console.error("❌ Export Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while exporting users",
    });
  }
};

// ==================== GET ANALYTICS ====================
exports.getAnalytics = async (req, res) => {
  try {
    const { period = "7days" } = req.query;

    let days = 7;
    if (period === "30days") days = 30;
    if (period === "90days") days = 90;

    const dateArray = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      dateArray.push(date);
    }

    const registrationData = await Promise.all(
      dateArray.map(async (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await User.countDocuments({
          createdAt: { $gte: date, $lt: nextDate },
        });

        return {
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          count,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: {
        registrationTrend: registrationData,
      },
    });
  } catch (error) {
    console.error("❌ Get Analytics Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching analytics",
    });
  }
};

// ==================== ✅ FIXED EXPORTS (NO DUPLICATES) ====================
module.exports = {
  login: exports.login,
  getDashboardStats: exports.getDashboardStats,
  getAllUsers: exports.getAllUsers,
  getUserById: exports.getUserById,
  updateUser: exports.updateUser,
  blockUser: exports.blockUser,
  deleteUser: exports.deleteUser,
  getRecentUsers: exports.getRecentUsers,
  getLiveStats: exports.getLiveStats,
  getWalletStats: exports.getWalletStats,
  getReports: exports.getReports,
  updateReportStatus: exports.updateReportStatus,
  exportUsers: exports.exportUsers,
  getAnalytics: exports.getAnalytics,
};
