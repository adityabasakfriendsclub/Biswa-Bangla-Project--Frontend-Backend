// FILE: backend/routes/callRoutes.js
// ✅ Video Call API Routes

const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { ensureNotHost, ensureIsHost } = require("../middleware/roleValidator");
const callService = require("../services/callService");
const agoraService = require("../services/agoraService");

// ==================== USER ROUTES (Callers) ====================

/**
 * @route   POST /api/calls/initiate
 * @desc    User initiates call to host
 * @access  Private (Users only, NOT hosts)
 */
router.post("/initiate", authenticateToken, ensureNotHost, async (req, res) => {
  try {
    const { hostId, deviceInfo } = req.body;
    const userId = req.user.userId;

    if (!hostId) {
      return res.status(400).json({
        success: false,
        message: "Host ID is required",
      });
    }

    const result = await callService.initiateCall(userId, hostId, deviceInfo);

    res.json({
      success: true,
      message: "Call initiated successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Initiate call error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   POST /api/calls/:callId/end
 * @desc    End active call
 * @access  Private
 */
router.post("/calls/:callId/end", authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    const result = await callService.endCall(
      callId,
      userId,
      reason || "call ended by user"
    );

    res.json({
      success: true,
      message: "Call ended successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ End call error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== HOST ROUTES (Receivers) ====================

/**
 * @route   POST /api/calls/:callId/accept
 * @desc    Host accepts incoming call
 * @access  Private (Hosts only)
 */
router.post(
  "/calls/:callId/accept",
  authenticateToken,
  ensureIsHost,
  async (req, res) => {
    try {
      const { callId } = req.params;
      const { deviceInfo } = req.body;
      const hostId = req.user.userId;

      const result = await callService.acceptCall(callId, hostId, deviceInfo);

      res.json({
        success: true,
        message: "Call accepted successfully",
        data: result,
      });
    } catch (error) {
      console.error("❌ Accept call error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   POST /api/calls/:callId/reject
 * @desc    Host rejects incoming call
 * @access  Private (Hosts only)
 */
router.post(
  "/calls/:callId/reject",
  authenticateToken,
  ensureIsHost,
  async (req, res) => {
    try {
      const { callId } = req.params;
      const { reason } = req.body;
      const hostId = req.user.userId;

      const result = await callService.rejectCall(callId, hostId, reason);

      res.json({
        success: true,
        message: "Call rejected successfully",
        data: result,
      });
    } catch (error) {
      console.error("❌ Reject call error:", error);
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/calls/host/history
 * @desc    Get host call history
 * @access  Private (Hosts only)
 */
router.get(
  "/host/history",
  authenticateToken,
  ensureIsHost,
  async (req, res) => {
    try {
      const hostId = req.user.userId;
      const limit = parseInt(req.query.limit) || 20;

      const calls = await callService.getHostCallHistory(hostId, limit);

      res.json({
        success: true,
        data: calls,
      });
    } catch (error) {
      console.error("❌ Get history error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/calls/host/earnings
 * @desc    Get host earnings summary
 * @access  Private (Hosts only)
 */
router.get(
  "/host/earnings",
  authenticateToken,
  ensureIsHost,
  async (req, res) => {
    try {
      const hostId = req.user.userId;

      const earnings = await callService.getHostEarningsSummary(hostId);

      res.json({
        success: true,
        data: earnings,
      });
    } catch (error) {
      console.error("❌ Get earnings error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==================== COMMON ROUTES ====================

/**
 * @route   GET /api/calls/:callId
 * @desc    Get call details
 * @access  Private
 */
router.get("/calls/:callId", authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;

    const call = await callService.getCallDetails(callId);

    res.json({
      success: true,
      data: call,
    });
  } catch (error) {
    console.error("❌ Get call error:", error);
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

/**
 * @route   GET /api/calls/host/:hostId/availability
 * @desc    Check if host is available
 * @access  Private
 */
router.get(
  "/host/:hostId/availability",
  authenticateToken,
  async (req, res) => {
    try {
      const { hostId } = req.params;

      const isAvailable = await callService.isHostAvailable(hostId);

      res.json({
        success: true,
        available: isAvailable,
      });
    } catch (error) {
      console.error("❌ Check availability error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

/**
 * @route   GET /api/calls/agora/config
 * @desc    Get Agora App ID (for frontend initialization)
 * @access  Private
 */
router.get("/agora/config", authenticateToken, (req, res) => {
  try {
    res.json({
      success: true,
      appId: agoraService.getAppId(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Agora config",
    });
  }
});

module.exports = router;
