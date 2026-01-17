const Call = require("../models/Call");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { generateAgoraToken } = require("../utils/agoraToken");

// =======================
// START CALL
// =======================
exports.startCall = async (req, res) => {
  try {
    const { hostId } = req.body;
    const userId = req.user._id;

    const callId = `CALL_${Date.now()}`;

    const token = generateAgoraToken(callId);

    const call = await Call.create({
      callId,
      userId,
      hostId,
      status: "ongoing",
      startTime: new Date(),
    });

    // Mark host busy
    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", require("../models/Host"));

    await Host.findByIdAndUpdate(hostId, {
      status: "busy",
      isOnline: true,
    });

    // Emit socket
    const io = req.app.get("io");
    if (io) {
      io.emit("call_started", { hostId });
      io.emit("host_status_change", {
        hostId,
        status: "busy",
        isOnline: true,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        callId,
        token,
      },
    });
  } catch (error) {
    console.error("❌ Start call error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// BILLING (₹25 / MIN)
// =======================
exports.billingDeduct = async (req, res) => {
  try {
    const { callId, amount } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (user.walletBalance < amount) {
      return res.status(400).json({
        success: false,
        insufficientBalance: true,
      });
    }

    const balanceBefore = user.walletBalance;
    user.walletBalance -= amount;
    await user.save();

    const call = await Call.findOne({ callId });

    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", require("../models/Host"));
    const host = await Host.findById(call.hostId);

    await Transaction.create({
      userId,
      type: "debit",
      amount,
      description: `Video call with ${host.firstName} ${host.lastName}`,
      callId,
      hostId: host._id,
      hostName: `${host.firstName} ${host.lastName}`,
      balanceBefore,
      balanceAfter: user.walletBalance,
    });

    host.earningPoints = (host.earningPoints || 0) + 1;
    await host.save();

    return res.status(200).json({
      success: true,
      data: { newBalance: user.walletBalance },
    });
  } catch (error) {
    console.error("❌ Billing error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// END CALL
// =======================
exports.endCall = async (req, res) => {
  try {
    const { callId, duration, cost } = req.body;

    const call = await Call.findOne({ callId });
    if (!call) {
      return res.status(404).json({
        success: false,
        message: "Call not found",
      });
    }

    call.endTime = new Date();
    call.duration = duration;
    call.cost = cost;
    call.status = "completed";
    await call.save();

    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", require("../models/Host"));

    await Host.findByIdAndUpdate(call.hostId, {
      $inc: {
        totalCalls: 1,
        totalMinutes: Math.ceil(duration / 60),
      },
      status: "online",
      isOnline: true,
    });

    // Emit socket
    const io = req.app.get("io");
    if (io) {
      io.emit("call_ended", { hostId: call.hostId });
      io.emit("host_status_change", {
        hostId: call.hostId,
        status: "online",
        isOnline: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Call ended successfully",
    });
  } catch (error) {
    console.error("❌ End call error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
