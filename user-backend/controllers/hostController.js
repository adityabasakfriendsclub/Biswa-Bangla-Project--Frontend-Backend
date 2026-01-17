// controllers/hostController.js - COMPLETE VERSION
const HostSchema = require("../models/Host");

/**
 * Get all online hosts
 */
exports.getOnlineHosts = async (req, res) => {
  try {
    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", HostSchema);

    const hosts = await Host.find({
      isHost: true,
      isVerified: true,
      isActive: true,
      isOnline: true,
    })
      .select(
        "firstName lastName profilePicture isOnline status rating totalCalls bio interests location images"
      )
      .sort({ rating: -1 })
      .lean();

    const formattedHosts = hosts.map((host) => ({
      id: host._id.toString(), // ⚠️ Convert to string
      name: `${host.firstName} ${host.lastName}`,
      profilePicture:
        host.profilePicture ||
        `https://ui-avatars.com/api/?name=${host.firstName}+${host.lastName}&background=ec4899&color=fff`,
      isOnline: host.isOnline,
      status: host.status || "online",
      rating: host.rating || 0,
      totalCalls: host.totalCalls || 0,
      bio: host.bio || "",
      interests: host.interests || [],
      location: host.location || "",
      images: host.images || [],
    }));

    console.log(`📋 Online hosts found: ${formattedHosts.length}`);

    return res.status(200).json({
      success: true,
      data: { hosts: formattedHosts },
    });
  } catch (error) {
    console.error("❌ Get online hosts error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get all hosts
 */
exports.getAllHosts = async (req, res) => {
  try {
    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", HostSchema);

    const hosts = await Host.find({
      isHost: true,
      isVerified: true,
      isActive: true,
    })
      .select(
        "firstName lastName profilePicture isOnline status rating totalCalls bio interests location images"
      )
      .sort({ isOnline: -1, rating: -1 })
      .lean();

    const formattedHosts = hosts.map((host) => ({
      id: host._id.toString(),
      name: `${host.firstName} ${host.lastName}`,
      profilePicture:
        host.profilePicture ||
        `https://ui-avatars.com/api/?name=${host.firstName}+${host.lastName}&background=ec4899&color=fff`,
      isOnline: host.isOnline,
      status: host.status || (host.isOnline ? "online" : "offline"),
      rating: host.rating || 0,
      totalCalls: host.totalCalls || 0,
      bio: host.bio || "",
      interests: host.interests || [],
      location: host.location || "",
      images: host.images || [],
    }));

    return res.status(200).json({
      success: true,
      data: { hosts: formattedHosts },
    });
  } catch (error) {
    console.error("❌ Get all hosts error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get host by ID
 */
exports.getHostById = async (req, res) => {
  try {
    const { hostId } = req.params;
    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", HostSchema);

    const host = await Host.findById(hostId)
      .select(
        "firstName lastName profilePicture isOnline status rating totalCalls totalMinutes bio interests location images videos dateOfBirth"
      )
      .lean();

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    // Calculate age
    let age = null;
    if (host.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(host.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        host: {
          id: host._id.toString(),
          name: `${host.firstName} ${host.lastName}`,
          profilePicture:
            host.profilePicture ||
            `https://ui-avatars.com/api/?name=${host.firstName}+${host.lastName}&background=ec4899&color=fff`,
          isOnline: host.isOnline,
          status: host.status || (host.isOnline ? "online" : "offline"),
          rating: host.rating || 0,
          totalCalls: host.totalCalls || 0,
          totalMinutes: host.totalMinutes || 0,
          bio: host.bio || "",
          interests: host.interests || [],
          location: host.location || "",
          age,
          images: host.images || [],
          videos: host.videos || [],
        },
      },
    });
  } catch (error) {
    console.error("❌ Get host by ID error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update host status
 */
exports.updateHostStatus = async (req, res) => {
  try {
    const { hostId } = req.params;
    const { isOnline, status } = req.body;

    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", HostSchema);

    const updateData = {};

    if (typeof isOnline !== "undefined") {
      updateData.isOnline = isOnline;
    }

    if (status) {
      updateData.status = status;
    } else if (typeof isOnline !== "undefined") {
      updateData.status = isOnline ? "online" : "offline";
    }

    if (updateData.isOnline === false || updateData.status === "offline") {
      updateData.lastOnline = new Date();
    }

    const host = await Host.findByIdAndUpdate(hostId, updateData, {
      new: true,
    });

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.emit("host_status_change", {
        hostId: host._id.toString(),
        isOnline: host.isOnline,
        status: host.status,
      });
    }

    console.log(`✅ Host ${hostId} status updated: ${host.status}`);

    return res.status(200).json({
      success: true,
      data: { host },
    });
  } catch (error) {
    console.error("❌ Update host status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Update host stats after call
 */
exports.updateHostStats = async (req, res) => {
  try {
    const { hostId } = req.params;
    const { callDuration = 0, points = 0, amount = 0 } = req.body;

    const hostDBConnection = req.app.get("hostDB");
    const Host = hostDBConnection.model("Host", HostSchema);

    const host = await Host.findById(hostId);

    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    host.totalCalls += 1;
    host.totalMinutes += Math.floor(callDuration / 60);
    host.earningPoints += points;
    host.walletBalance += amount;
    host.status = "online";

    await host.save();

    const io = req.app.get("io");
    if (io) {
      io.emit("host_status_change", {
        hostId: host._id.toString(),
        isOnline: true,
        status: "online",
      });
    }

    return res.status(200).json({
      success: true,
      data: { host },
    });
  } catch (error) {
    console.error("❌ Update host stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
