// FILE: backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const Host = require("../models/Host");
const Call = require("../models/Call");
const { authenticateAdmin } = require("../middleware/auth");

// ==================== GET ALL HOSTS ====================
router.get("/hosts", authenticateAdmin, async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;

    let query = { isHost: true };

    if (search) {
      query.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const hosts = await Host.find(query)
      .select(
        "firstName lastName phone dateOfBirth walletBalance earningPoints profilePicture kyc bankDetails isActive"
      )
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Host.countDocuments(query);

    // Calculate total call time for each host
    const hostsWithCallTime = await Promise.all(
      hosts.map(async (host) => {
        const calls = await Call.find({
          hostId: host._id,
          status: "completed",
        });

        const totalMinutes = calls.reduce(
          (sum, call) => sum + Math.floor(call.totalDuration / 60),
          0
        );

        return {
          ...host.toObject(),
          totalCallTime: totalMinutes,
        };
      })
    );

    res.json({
      success: true,
      hosts: hostsWithCallTime,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalHosts: count,
    });
  } catch (error) {
    console.error("❌ Get hosts error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== GET HOST DETAILS ====================
router.get("/hosts/:hostId", authenticateAdmin, async (req, res) => {
  try {
    const host = await Host.findById(req.params.hostId);

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    // Get call history
    const calls = await Call.find({
      hostId: host._id,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      host,
      recentCalls: calls,
    });
  } catch (error) {
    console.error("❌ Get host details error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== APPROVE KYC ====================
router.post(
  "/hosts/:hostId/approve-kyc",
  authenticateAdmin,
  async (req, res) => {
    try {
      const host = await Host.findById(req.params.hostId);

      if (!host) {
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      host.kyc.status = "approved";
      host.kyc.verifiedAt = new Date();
      await host.save();

      res.json({
        success: true,
        message: "KYC approved successfully",
      });
    } catch (error) {
      console.error("❌ Approve KYC error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ==================== REJECT KYC ====================
router.post(
  "/hosts/:hostId/reject-kyc",
  authenticateAdmin,
  async (req, res) => {
    try {
      const { reason } = req.body;
      const host = await Host.findById(req.params.hostId);

      if (!host) {
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      host.kyc.status = "rejected";
      host.kyc.rejectionReason = reason;
      await host.save();

      res.json({
        success: true,
        message: "KYC rejected",
      });
    } catch (error) {
      console.error("❌ Reject KYC error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// ==================== DELETE HOST ====================
router.delete("/hosts/:hostId", authenticateAdmin, async (req, res) => {
  try {
    await Host.findByIdAndDelete(req.params.hostId);

    res.json({
      success: true,
      message: "Host deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete host error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== DASHBOARD STATS ====================
router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const totalHosts = await Host.countDocuments({ isHost: true });
    const activeHosts = await Host.countDocuments({
      isHost: true,
      isActive: true,
    });
    const pendingKYC = await Host.countDocuments({ "kyc.status": "pending" });
    const totalCalls = await Call.countDocuments({ status: "completed" });

    res.json({
      success: true,
      stats: {
        totalHosts,
        activeHosts,
        pendingKYC,
        totalCalls,
      },
    });
  } catch (error) {
    console.error("❌ Get stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
