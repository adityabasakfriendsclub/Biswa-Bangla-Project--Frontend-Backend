// scripts/verifyRealData.js - Verify All Data is Real
const mongoose = require("mongoose");
const User = require("../models/User");
const Call = require("../models/Call");
const Transaction = require("../models/Transaction");
const Report = require("../models/Report");
require("dotenv").config({ path: "./config/config.env" });

const verifyRealData = async () => {
  try {
    console.log("🔍 STARTING REAL DATA VERIFICATION...\n");

    // Connect to database
    await mongoose.connect(process.env.URI);
    console.log("✅ Connected to MongoDB\n");

    // ==================== USER DATA VERIFICATION ====================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 USER DATA VERIFICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    console.log("📈 User Statistics:");
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   ✅ Verified: ${verifiedUsers}`);
    console.log(`   ⏳ Unverified: ${unverifiedUsers}`);
    console.log(`   🚫 Blocked: ${blockedUsers}\n`);

    // Gender distribution
    const maleUsers = await User.countDocuments({ gender: "Male" });
    const femaleUsers = await User.countDocuments({ gender: "Female" });
    const otherUsers = await User.countDocuments({ gender: "Others" });

    console.log("👥 Gender Distribution:");
    console.log(`   Male: ${maleUsers}`);
    console.log(`   Female: ${femaleUsers}`);
    console.log(`   Others: ${otherUsers}\n`);

    // Recent registrations
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

    console.log("📅 New Users:");
    console.log(`   Today: ${todayUsers}`);
    console.log(`   This Week: ${weekUsers}`);
    console.log(`   This Month: ${monthUsers}\n`);

    // List recent 5 users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("firstName lastName phone gender isVerified createdAt");

    console.log("📋 Recent 5 Users:");
    if (recentUsers.length === 0) {
      console.log("   ⚠️  No users found in database!\n");
    } else {
      recentUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`      Phone: ${user.phone}`);
        console.log(`      Gender: ${user.gender}`);
        console.log(`      Verified: ${user.isVerified ? "✅" : "❌"}`);
        console.log(
          `      Registered: ${user.createdAt.toLocaleDateString()}\n`
        );
      });
    }

    // ==================== CALL DATA VERIFICATION ====================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📞 CALL DATA VERIFICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const totalCalls = await Call.countDocuments();
    const completedCalls = await Call.countDocuments({ status: "completed" });
    const ongoingCalls = await Call.countDocuments({ status: "ongoing" });
    const cancelledCalls = await Call.countDocuments({ status: "cancelled" });

    console.log("📊 Call Statistics:");
    console.log(`   Total Calls: ${totalCalls}`);
    console.log(`   ✅ Completed: ${completedCalls}`);
    console.log(`   📞 Ongoing: ${ongoingCalls}`);
    console.log(`   ❌ Cancelled: ${cancelledCalls}\n`);

    if (totalCalls > 0) {
      const recentCalls = await Call.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("userId", "firstName lastName phone");

      console.log("📋 Recent 3 Calls:");
      recentCalls.forEach((call, index) => {
        console.log(`   ${index + 1}. Call ID: ${call.callId}`);
        console.log(
          `      User: ${call.userId?.firstName} ${call.userId?.lastName}`
        );
        console.log(`      Status: ${call.status}`);
        console.log(`      Duration: ${call.duration || 0}s`);
        console.log(`      Cost: ₹${call.cost || 0}\n`);
      });
    } else {
      console.log("   ⚠️  No calls found in database!\n");
    }

    // ==================== TRANSACTION DATA VERIFICATION ====================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💰 TRANSACTION DATA VERIFICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const totalTransactions = await Transaction.countDocuments();
    const creditTransactions = await Transaction.countDocuments({
      type: "credit",
    });
    const debitTransactions = await Transaction.countDocuments({
      type: "debit",
    });

    console.log("📊 Transaction Statistics:");
    console.log(`   Total Transactions: ${totalTransactions}`);
    console.log(`   ➕ Credits (Recharges): ${creditTransactions}`);
    console.log(`   ➖ Debits (Calls): ${debitTransactions}\n`);

    // Calculate total earnings
    const earningsData = await Transaction.aggregate([
      { $match: { type: "debit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalEarnings = earningsData.length > 0 ? earningsData[0].total : 0;

    const rechargesData = await Transaction.aggregate([
      { $match: { type: "credit", status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRecharges =
      rechargesData.length > 0 ? rechargesData[0].total : 0;

    console.log("💵 Financial Summary:");
    console.log(`   Total Recharges: ₹${totalRecharges}`);
    console.log(`   Total Spent on Calls: ₹${totalEarnings}`);
    console.log(`   Platform Earnings: ₹${totalEarnings}\n`);

    if (totalTransactions > 0) {
      const recentTransactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("userId", "firstName lastName");

      console.log("📋 Recent 3 Transactions:");
      recentTransactions.forEach((tx, index) => {
        console.log(
          `   ${index + 1}. ${
            tx.type === "credit" ? "➕" : "➖"
          } ${tx.type.toUpperCase()}`
        );
        console.log(
          `      User: ${tx.userId?.firstName} ${tx.userId?.lastName}`
        );
        console.log(`      Amount: ₹${tx.amount}`);
        console.log(`      Description: ${tx.description}`);
        console.log(`      Status: ${tx.status}\n`);
      });
    } else {
      console.log("   ⚠️  No transactions found in database!\n");
    }

    // ==================== REPORT DATA VERIFICATION ====================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚨 REPORT DATA VERIFICATION");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const reviewedReports = await Report.countDocuments({ status: "reviewed" });
    const resolvedReports = await Report.countDocuments({ status: "resolved" });
    const rejectedReports = await Report.countDocuments({ status: "rejected" });

    console.log("📊 Report Statistics:");
    console.log(`   Total Reports: ${totalReports}`);
    console.log(`   ⏳ Pending: ${pendingReports}`);
    console.log(`   👀 Reviewed: ${reviewedReports}`);
    console.log(`   ✅ Resolved: ${resolvedReports}`);
    console.log(`   ❌ Rejected: ${rejectedReports}\n`);

    if (totalReports > 0) {
      const recentReports = await Report.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("userId", "firstName lastName");

      console.log("📋 Recent 3 Reports:");
      recentReports.forEach((report, index) => {
        console.log(
          `   ${index + 1}. Report by: ${report.firstName} ${report.lastName}`
        );
        console.log(`      Types: ${report.complaintTypes.join(", ")}`);
        console.log(`      Status: ${report.status}`);
        console.log(
          `      Submitted: ${report.createdAt.toLocaleDateString()}\n`
        );
      });
    } else {
      console.log("   ⚠️  No reports found in database!\n");
    }

    // ==================== FINAL SUMMARY ====================
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ VERIFICATION SUMMARY");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    const hasRealData =
      totalUsers > 0 ||
      totalCalls > 0 ||
      totalTransactions > 0 ||
      totalReports > 0;

    if (hasRealData) {
      console.log("✅ VERIFICATION PASSED!");
      console.log("   Admin Dashboard is using REAL DATA from database.\n");

      console.log("📊 Data Summary:");
      console.log(`   • ${totalUsers} real users`);
      console.log(`   • ${totalCalls} real calls`);
      console.log(`   • ${totalTransactions} real transactions`);
      console.log(`   • ${totalReports} real reports\n`);

      console.log("🎯 All statistics in Admin Dashboard are now accurate!");
    } else {
      console.log("⚠️  WARNING: No data found in database!");
      console.log("   Your database appears to be empty.");
      console.log("   Admin Dashboard will show zeros until users sign up.\n");

      console.log("💡 To test with sample data, run:");
      console.log("   node scripts/createTestUsers.js\n");
    }

    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Verification Error:", error.message);
    console.error(error);
    process.exit(1);
  }
};

// Run verification
verifyRealData();
