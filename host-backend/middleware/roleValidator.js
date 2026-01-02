// FILE: backend/middleware/roleValidator.js
// ✅ Role-based access control for video calling

const Host = require("../models/Host");

/**
 * Ensure user is NOT a host (can initiate calls)
 */
const ensureNotHost = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await Host.findById(userId).select("isHost");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isHost) {
      console.warn(`❌ SECURITY: Host ${userId} attempted to initiate call`);
      return res.status(403).json({
        success: false,
        message:
          "❌ Hosts cannot initiate video calls. Only regular users can call hosts.",
        securityViolation: true,
      });
    }

    next();
  } catch (error) {
    console.error("❌ Role validation error:", error);
    res.status(500).json({
      success: false,
      message: "Role validation failed",
    });
  }
};

/**
 * Ensure user IS a host (can receive calls)
 */
const ensureIsHost = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const user = await Host.findById(userId).select("isHost isActive");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isHost) {
      return res.status(403).json({
        success: false,
        message: "Only hosts can perform this action",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your host account is not active",
      });
    }

    next();
  } catch (error) {
    console.error("❌ Role validation error:", error);
    res.status(500).json({
      success: false,
      message: "Role validation failed",
    });
  }
};

module.exports = {
  ensureNotHost,
  ensureIsHost,
};
