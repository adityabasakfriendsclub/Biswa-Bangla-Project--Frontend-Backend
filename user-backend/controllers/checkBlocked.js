// middleware/checkBlocked.js
const User = require("../models/User");

// Middleware to check if user is blocked
exports.checkBlocked = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
        isBlocked: true,
      });
    }

    // Update last active time
    user.lastActive = new Date();
    user.isOnline = true;
    await user.save();

    next();
  } catch (error) {
    console.error("❌ Check Blocked Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Middleware to track user activity
exports.trackActivity = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        lastActive: new Date(),
        isOnline: true,
        ipAddress: req.ip || req.connection.remoteAddress,
        deviceInfo: req.headers["user-agent"],
      });
    }
    next();
  } catch (error) {
    // Don't block request if tracking fails
    console.error("❌ Track Activity Error:", error);
    next();
  }
};
