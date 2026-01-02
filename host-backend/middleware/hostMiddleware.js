// FILE: backend/middleware/hostMiddleware.js
// 🔐 Middleware to attach host name to request

const Host = require("../models/Host");

/**
 * Middleware to fetch and attach host information to request
 * Must be used AFTER authenticateHost middleware
 */
const attachHostInfo = async (req, res, next) => {
  try {
    // req.user should already exist from authenticateHost middleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Fetch host from database
    const host = await Host.findById(req.user.userId).select(
      "firstName lastName phone isHost isHostPremium"
    );

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    // Attach host info to request
    req.hostName = `${host.firstName}${host.lastName}`;
    req.hostData = {
      id: host._id,
      firstName: host.firstName,
      lastName: host.lastName,
      fullName: `${host.firstName} ${host.lastName}`,
      isHost: host.isHost,
      isHostPremium: host.isHostPremium,
    };

    console.log(
      `✅ Host info attached: ${req.hostData.fullName} (${host._id})`
    );
    next();
  } catch (error) {
    console.error("❌ Attach host info error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load host information",
    });
  }
};

module.exports = { attachHostInfo };
