require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// ✅ Add this after existing requires
const callRoutes = require("./routes/callRoutes");
const callService = require("./services/callService");
// ✅ Import new upload configurations
const {
  uploadImage,
  uploadVideo,
  uploadDocument,
  getRelativePath,
  deleteFile,
} = require("./utils/uploadConfig");
// ✅ Import host middleware
const { attachHostInfo } = require("./middleware/hostMiddleware");
// end

const { body, validationResult } = require("express-validator");
const http = require("http");
const { Server } = require("socket.io");

// Import models
const Host = require("./models/Host");
const Agency = require("./models/Agency");
const Admin = require("./models/Admin");
const { sendOTP, generateOTP } = require("./services/smsService");

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== CREATE HTTP SERVER FOR SOCKET.IO ====================
const server = http.createServer(app);

// ==================== CORS CONFIGURATION ====================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_DEV_ALT,
  process.env.FRONTEND_URL_PROD,
  process.env.FRONTEND_URL_PROD_WWW,
  "https://biswabanglasocialnetworkingservices.com",
  "https://www.biswabanglasocialnetworkingservices.com",
].filter(Boolean);

console.log("🌐 Allowed CORS Origins:", allowedOrigins);

// ==================== INITIALIZE SOCKET.IO ====================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  transports: ["websocket", "polling"],
  allowEIO3: true,
});

// Store active connections
const activeHosts = new Map();
const activeCalls = new Map();

// Create uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Uploads directory created");
}

// ==================== MIDDLEWARE ====================
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.warn("⚠️ Blocked CORS request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

console.log("📁 Static files served from:", uploadsDir);

// ==================== REQUEST LOGGING MIDDLEWARE ====================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`📥 [${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ==================== MONGODB CONNECTION ====================
mongoose
  .connect(
    process.env.MONGO_URI ||
      process.env.URI ||
      "mongodb://localhost:27017/dating-app"
  )
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("📊 Database:", mongoose.connection.name);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
// Video Call Routes
app.use("/api/calls", callRoutes);
console.log("✅ Call routes registered at /api/calls");
// ==================== OTP STORAGE ====================
const otpStorage = {};

// ==================== HELPER FUNCTIONS ====================
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

// ==================== VALIDATION RULES ====================
const signupValidation = [
  body("firstName").trim().notEmpty().withMessage("First name required"),
  body("lastName").trim().notEmpty().withMessage("Last name required"),
  body("phone")
    .matches(/^[0-9]{10}$/)
    .withMessage("Valid 10-digit phone required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6+ characters"),
  body("gender")
    .isIn(["male", "female", "others"])
    .withMessage("Valid gender required"),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth required")
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      const age = calculateAge(value);
      if (age < 18) {
        throw new Error("You must be at least 18 years old");
      }
      return true;
    }),
  body("isHost")
    .optional()
    .isBoolean()
    .withMessage("isHost must be true or false"),
  body("isHostPremium")
    .optional()
    .isBoolean()
    .withMessage("isHostPremium must be true or false")
    .custom((value, { req }) => {
      if (value && !req.body.isHost) {
        throw new Error("You must be a Host to enable Premium");
      }
      return true;
    }),
  body("interAgencyCode")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.isHostPremium && !value) {
        throw new Error("Inter-Agency Code required for Premium Hosts");
      }
      if (value && value.length < 6) {
        throw new Error("Inter-Agency Code must be at least 6 characters");
      }
      return true;
    }),
];

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

// ==================== ✅ FIXED AUTHENTICATION MIDDLEWARE ====================
const authenticateHost = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("❌ Invalid token:", err.message);
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // ✅ CRITICAL FIX: Store in req.user (standard convention)
      req.user = {
        userId: decoded.userId,
        phone: decoded.phone,
      };

      console.log("✅ Token verified for user:", decoded.userId);
      next();
    });
  } catch (error) {
    console.error("❌ Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

const authenticateAgency = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Agency access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.type !== "agency") {
      return res
        .status(403)
        .json({ success: false, message: "Invalid agency token" });
    }
    req.agency = decoded;
    next();
  });
};

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Admin access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err || decoded.type !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Invalid admin token" });
    }
    req.admin = decoded;
    next();
  });
};

// ==================== SOCKET.IO CONNECTION HANDLER ====================
// io.on("connection", (socket) => {
//   console.log(`✅ Socket connected: ${socket.id}`);

//   socket.on("host-online", (data) => {
//     activeHosts.set(data.hostId, socket.id);
//     console.log(`🟢 Host ${data.hostId} is now online`);
//     io.emit("host-status-updated", {
//       hostId: data.hostId,
//       isOnline: true,
//     });
//   });

//   socket.on("host-offline", (data) => {
//     activeHosts.delete(data.hostId);
//     console.log(`🔴 Host ${data.hostId} is now offline`);
//     io.emit("host-status-updated", {
//       hostId: data.hostId,
//       isOnline: false,
//     });
//   });

//   socket.on("host-status-change", (data) => {
//     if (data.isOnline) {
//       activeHosts.set(data.hostId, socket.id);
//     } else {
//       activeHosts.delete(data.hostId);
//     }
//     console.log(
//       `🔄 Host ${data.hostId} status: ${data.isOnline ? "Online" : "Offline"}`
//     );
//     io.emit("host-status-updated", {
//       hostId: data.hostId,
//       isOnline: data.isOnline,
//     });
//   });

//   socket.on("call-host", (data) => {
//     const { hostId, callerId, callerName, callerProfile } = data;
//     const hostSocketId = activeHosts.get(hostId);

//     if (hostSocketId) {
//       const callId = `call_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;

//       activeCalls.set(callId, {
//         callId,
//         hostId,
//         callerId,
//         callerName,
//         status: "ringing",
//         startTime: new Date(),
//       });

//       io.to(hostSocketId).emit("incoming-call", {
//         callId,
//         callerId,
//         caller: {
//           name: callerName,
//           profilePicture: callerProfile,
//         },
//       });

//       console.log(`📞 Call initiated: ${callerId} -> ${hostId}`);
//     } else {
//       socket.emit("host-unavailable", {
//         hostId,
//         message: "Host is currently offline",
//       });
//     }
//   });

//   socket.on("call-accepted", (data) => {
//     const { callId, hostId, callerId } = data;
//     const call = activeCalls.get(callId);

//     if (call) {
//       call.status = "active";
//       call.acceptTime = new Date();
//       activeCalls.set(callId, call);

//       io.emit("call-accepted-by-host", {
//         callId,
//         hostId,
//         callerId,
//       });

//       console.log(`✅ Call accepted: ${callId}`);
//     }
//   });

//   socket.on("call-rejected", (data) => {
//     const { callId, hostId, callerId } = data;
//     activeCalls.delete(callId);

//     io.emit("call-rejected-by-host", {
//       callId,
//       hostId,
//       callerId,
//       message: "Host declined the call",
//     });

//     console.log(`❌ Call rejected: ${callId}`);
//   });

//   socket.on("end-call", (data) => {
//     const { callId } = data;
//     const call = activeCalls.get(callId);

//     if (call) {
//       io.emit("call-ended", { callId });
//       activeCalls.delete(callId);
//       console.log(`🔴 Call ended: ${callId}`);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ Socket disconnected: ${socket.id}`);

//     for (const [hostId, socketId] of activeHosts.entries()) {
//       if (socketId === socket.id) {
//         activeHosts.delete(hostId);
//         io.emit("host-status-updated", {
//           hostId,
//           isOnline: false,
//         });
//         console.log(`🔴 Host ${hostId} disconnected`);
//         break;
//       }
//     }
//   });
// });

// new
io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // ==================== HOST STATUS ====================
  socket.on("host-online", (data) => {
    activeHosts.set(data.hostId, socket.id);
    console.log(`🟢 Host ${data.hostId} is now online`);
    io.emit("host-status-updated", {
      hostId: data.hostId,
      isOnline: true,
    });
  });

  socket.on("host-offline", (data) => {
    activeHosts.delete(data.hostId);
    console.log(`🔴 Host ${data.hostId} is now offline`);
    io.emit("host-status-updated", {
      hostId: data.hostId,
      isOnline: false,
    });
  });

  socket.on("host-status-change", (data) => {
    if (data.isOnline) {
      activeHosts.set(data.hostId, socket.id);
    } else {
      activeHosts.delete(data.hostId);
    }
    console.log(
      `🔄 Host ${data.hostId} status: ${data.isOnline ? "Online" : "Offline"}`
    );
    io.emit("host-status-updated", {
      hostId: data.hostId,
      isOnline: data.isOnline,
    });
  });

  // ==================== VIDEO CALL SIGNALING ====================

  /**
   * User initiates video call to host
   */
  socket.on("video-call-request", async (data) => {
    const { callId, hostId, caller } = data;
    const hostSocketId = activeHosts.get(hostId);

    console.log(`📞 Video call request: ${caller.name} -> Host ${hostId}`);

    if (hostSocketId) {
      // Send incoming call notification to host
      io.to(hostSocketId).emit("incoming-video-call", {
        callId,
        caller,
        timestamp: new Date().toISOString(),
      });

      console.log(`✅ Call notification sent to host socket: ${hostSocketId}`);
    } else {
      // Host is offline
      socket.emit("call-failed", {
        callId,
        reason: "Host is currently offline",
      });

      console.log(`❌ Host ${hostId} is offline`);
    }
  });

  /**
   * Host accepts video call
   */
  socket.on("video-call-accepted", (data) => {
    const { callId, userId, hostId } = data;

    console.log(`✅ Video call accepted: ${callId}`);

    // Notify user that host accepted
    io.emit("video-call-started", {
      callId,
      userId,
      hostId,
      status: "active",
    });
  });

  /**
   * Host rejects video call
   */
  socket.on("video-call-rejected", (data) => {
    const { callId, userId, hostId, reason } = data;

    console.log(`❌ Video call rejected: ${callId} - ${reason}`);

    // Notify user that host rejected
    io.emit("video-call-rejected", {
      callId,
      userId,
      hostId,
      reason: reason || "Host declined the call",
    });
  });

  /**
   * Video call ended by either party
   */
  socket.on("video-call-ended", async (data) => {
    const { callId, endedBy, reason } = data;

    console.log(`🔴 Video call ended: ${callId} by ${endedBy}`);

    // Broadcast to all participants
    io.emit("video-call-ended", {
      callId,
      endedBy,
      reason: reason || "Call ended",
      timestamp: new Date().toISOString(),
    });

    // Clean up active call tracking
    activeCalls.delete(callId);
  });

  /**
   * Call quality feedback
   */
  socket.on("call-quality-report", (data) => {
    const { callId, quality, issues } = data;
    console.log(`📊 Call quality report: ${callId} - ${quality}`);
    // You can save this to database for analytics
  });

  // ==================== LEGACY AUDIO CALL SUPPORT ====================
  // Keep existing audio call handlers for backward compatibility

  socket.on("call-host", (data) => {
    const { hostId, callerId, callerName, callerProfile } = data;
    const hostSocketId = activeHosts.get(hostId);

    if (hostSocketId) {
      const callId = `call_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      activeCalls.set(callId, {
        callId,
        hostId,
        callerId,
        callerName,
        status: "ringing",
        startTime: new Date(),
      });

      io.to(hostSocketId).emit("incoming-call", {
        callId,
        callerId,
        caller: {
          name: callerName,
          profilePicture: callerProfile,
        },
      });

      console.log(`📞 Call initiated: ${callerId} -> ${hostId}`);
    } else {
      socket.emit("host-unavailable", {
        hostId,
        message: "Host is currently offline",
      });
    }
  });

  socket.on("call-accepted", (data) => {
    const { callId, hostId, callerId } = data;
    const call = activeCalls.get(callId);

    if (call) {
      call.status = "active";
      call.acceptTime = new Date();
      activeCalls.set(callId, call);

      io.emit("call-accepted-by-host", {
        callId,
        hostId,
        callerId,
      });

      console.log(`✅ Call accepted: ${callId}`);
    }
  });

  socket.on("call-rejected", (data) => {
    const { callId, hostId, callerId } = data;
    activeCalls.delete(callId);

    io.emit("call-rejected-by-host", {
      callId,
      hostId,
      callerId,
      message: "Host declined the call",
    });

    console.log(`❌ Call rejected: ${callId}`);
  });

  socket.on("end-call", (data) => {
    const { callId } = data;
    const call = activeCalls.get(callId);

    if (call) {
      io.emit("call-ended", { callId });
      activeCalls.delete(callId);
      console.log(`🔴 Call ended: ${callId}`);
    }
  });

  // ==================== DISCONNECT ====================
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);

    // Remove host from active list
    for (const [hostId, socketId] of activeHosts.entries()) {
      if (socketId === socket.id) {
        activeHosts.delete(hostId);
        io.emit("host-status-updated", {
          hostId,
          isOnline: false,
        });
        console.log(`🔴 Host ${hostId} disconnected`);
        break;
      }
    }
  });
});

console.log("✅ Socket.io handlers configured for video calling");

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ==================== DEBUG ENDPOINTS (TEMPORARY) ====================
app.get("/api/debug/check-token", authenticateHost, async (req, res) => {
  try {
    console.log("🔍 Token Debug Info:");
    console.log("   - User ID:", req.user.userId);
    console.log("   - Phone:", req.user.phone);

    const host = await Host.findById(req.user.userId);

    res.json({
      success: true,
      tokenData: req.user,
      hostFound: !!host,
      hostData: host
        ? {
            id: host._id,
            phone: host.phone,
            firstName: host.firstName,
            isHost: host.isHost,
            isVerified: host.isVerified,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/debug/find-by-phone/:phone", async (req, res) => {
  try {
    const host = await Host.findOne({ phone: req.params.phone });

    if (!host) {
      return res.json({
        found: false,
        message: "No user with this phone number",
      });
    }

    res.json({
      found: true,
      userId: host._id,
      phone: host.phone,
      firstName: host.firstName,
      isHost: host.isHost,
      isVerified: host.isVerified,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/debug/db-stats", async (req, res) => {
  try {
    const hostCount = await Host.countDocuments();
    const hosts = await Host.find()
      .limit(5)
      .select("phone firstName isHost isVerified");

    res.json({
      success: true,
      database: mongoose.connection.name,
      connectionState: mongoose.connection.readyState,
      hostCount,
      sampleHosts: hosts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ==================== HOST AUTH ROUTES ====================
app.post(
  "/api/host/signup",
  signupValidation,
  handleValidation,
  async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        password,
        gender,
        dateOfBirth,
        agencyCode,
        isHost,
        isHostPremium,
        interAgencyCode,
      } = req.body;

      const existingHost = await Host.findOne({ phone });
      if (existingHost && existingHost.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered",
        });
      }

      if (interAgencyCode) {
        const codeExists = await Host.findOne({
          interAgencyCode: interAgencyCode.toUpperCase(),
        });
        if (codeExists) {
          return res.status(400).json({
            success: false,
            message: "Inter-Agency Code already exists. Please choose another.",
          });
        }
      }

      if (isHostPremium && !isHost) {
        return res.status(400).json({
          success: false,
          message: "You must be a Host to enable Premium",
        });
      }

      const otp = generateOTP();
      const otpResult = await sendOTP(phone, otp);

      if (!otpResult.success) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to send OTP" });
      }

      otpStorage[phone] = {
        otp,
        userData: {
          firstName,
          lastName,
          phone,
          password,
          gender,
          dateOfBirth,
          agencyCode,
          isHost: isHost || false,
          isHostPremium: isHostPremium || false,
          interAgencyCode: interAgencyCode || null,
        },
        expiresAt: Date.now() + 5 * 60 * 1000,
        type: "signup",
      };

      console.log(`📱 [HOST SIGNUP] OTP for ${phone}: ${otp}`);

      res.json({
        success: true,
        message: "OTP sent successfully",
        phone,
      });
    } catch (error) {
      console.error("❌ Signup error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

app.post("/api/host/verify-signup", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const otpData = otpStorage[phone];
    if (!otpData || otpData.type !== "signup") {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (Date.now() > otpData.expiresAt) {
      delete otpStorage[phone];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(otpData.userData.password, 10);

    const newHost = new Host({
      firstName: otpData.userData.firstName,
      lastName: otpData.userData.lastName,
      phone: otpData.userData.phone,
      password: hashedPassword,
      gender: otpData.userData.gender,
      dateOfBirth: otpData.userData.dateOfBirth,
      agencyCode: otpData.userData.agencyCode,
      isHost: otpData.userData.isHost,
      isHostPremium: otpData.userData.isHostPremium,
      interAgencyCode: otpData.userData.interAgencyCode
        ? otpData.userData.interAgencyCode.toUpperCase()
        : null,
      isVerified: true,
    });

    await newHost.save();
    delete otpStorage[phone];

    const token = jwt.sign(
      { userId: newHost._id, phone: newHost.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ [HOST REGISTERED] ${phone} - ID: ${newHost._id}`);

    res.json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: newHost._id,
        firstName: newHost.firstName,
        lastName: newHost.lastName,
        phone: newHost.phone,
        gender: newHost.gender,
        dateOfBirth: newHost.dateOfBirth,
        isHost: newHost.isHost,
        isHostPremium: newHost.isHostPremium,
        interAgencyCode: newHost.interAgencyCode,
        isVerified: newHost.isVerified,
        profilePicture: newHost.profilePicture,
        walletBalance: newHost.walletBalance || 0,
        earningPoints: newHost.earningPoints || 0,
      },
    });
  } catch (error) {
    console.error("❌ Verify signup error:", error);

    if (error.code === 11000 && error.keyPattern?.interAgencyCode) {
      return res.status(400).json({
        success: false,
        message:
          "Inter-Agency Code already exists. Please try again with a different code.",
      });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/host/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const host = await Host.findOne({ phone });
    if (!host) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!host.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Account not verified" });
    }

    const isValidPassword = await bcrypt.compare(password, host.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    host.lastLogin = new Date();
    await host.save();

    const token = jwt.sign(
      { userId: host._id, phone: host.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ [HOST LOGIN] ${phone} - ID: ${host._id}`);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: host._id,
        firstName: host.firstName,
        lastName: host.lastName,
        phone: host.phone,
        gender: host.gender,
        dateOfBirth: host.dateOfBirth,
        isHost: host.isHost,
        isHostPremium: host.isHostPremium,
        interAgencyCode: host.interAgencyCode,
        isVerified: host.isVerified,
        profilePicture: host.profilePicture,
        walletBalance: host.walletBalance || 0,
        earningPoints: host.earningPoints || 0,
        bio: host.bio,
        location: host.location,
        isOnline: host.isOnline || false,
        isActive: host.isActive,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/host/forgot-password", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Phone is required" });
    }

    const host = await Host.findOne({ phone });
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Phone not registered" });
    }

    const otp = generateOTP();
    const otpResult = await sendOTP(phone, otp);

    if (!otpResult.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }

    otpStorage[phone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      type: "reset",
    };

    console.log(`📱 [RESET] OTP for ${phone}: ${otp}`);

    res.json({ success: true, message: "OTP sent successfully", phone });
  } catch (error) {
    console.error("❌ Forgot password error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/host/verify-reset", async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    const otpData = otpStorage[phone];
    if (!otpData || otpData.type !== "reset") {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (Date.now() > otpData.expiresAt) {
      delete otpStorage[phone];
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const host = await Host.findOne({ phone });
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }

    host.password = await bcrypt.hash(newPassword, 10);
    await host.save();

    delete otpStorage[phone];

    console.log(`✅ [RESET] Password reset successful: ${phone}`);

    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Verify reset error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/host/resend-otp", async (req, res) => {
  try {
    const { phone } = req.body;

    const otpData = otpStorage[phone];
    if (!otpData) {
      return res
        .status(400)
        .json({ success: false, message: "No OTP request found" });
    }

    const newOtp = generateOTP();
    const otpResult = await sendOTP(phone, newOtp);

    if (!otpResult.success) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to send OTP" });
    }

    otpData.otp = newOtp;
    otpData.expiresAt = Date.now() + 5 * 60 * 1000;

    console.log(`📱 [RESEND] OTP for ${phone}: ${newOtp}`);

    res.json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("❌ Resend OTP error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== ✅ FIXED HOST PROFILE ROUTES ====================
app.get("/api/host/profile", authenticateHost, async (req, res) => {
  try {
    console.log("📥 GET /api/host/profile called");
    console.log("📥 User ID from token:", req.user.userId);

    // ✅ FIXED: Use req.user instead of req.host
    const host = await Host.findById(req.user.userId);

    if (!host) {
      console.error("❌ Host not found for ID:", req.user.userId);
      return res.status(404).json({
        success: false,
        message: "Host not found. Please login again.",
      });
    }

    console.log("✅ Host found:", host.phone);

    res.json({
      success: true,
      user: {
        id: host._id,
        firstName: host.firstName,
        lastName: host.lastName,
        phone: host.phone,
        email: host.email,
        gender: host.gender,
        dateOfBirth: host.dateOfBirth,
        isHost: host.isHost,
        isHostPremium: host.isHostPremium,
        interAgencyCode: host.interAgencyCode,
        agencyCode: host.agencyCode,
        bio: host.bio,
        interests: host.interests,
        location: host.location,
        profilePicture: host.profilePicture,
        isVerified: host.isVerified,
        isActive: host.isActive,
        isOnline: host.isOnline,
        lastOnline: host.lastOnline,
        walletBalance: host.walletBalance || 0,
        earningPoints: host.earningPoints || 0,
        images: host.images || [],
        videos: host.videos || [],
        kyc: host.kyc,
        auditionVideo: host.auditionVideo,
        bankDetails: host.bankDetails,
        createdAt: host.createdAt,
        updatedAt: host.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});
app.put("/api/host/profile", authenticateHost, async (req, res) => {
  try {
    console.log("📥 PUT /api/host/profile called");
    const { bio, dateOfBirth, interests, location } = req.body;
    const host = await Host.findById(req.user.userId);
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    if (bio !== undefined) host.bio = bio;
    if (dateOfBirth !== undefined) host.dateOfBirth = dateOfBirth;
    if (interests !== undefined) host.interests = interests;
    if (location !== undefined) host.location = location;

    await host.save();

    console.log(`✅ [PROFILE] Updated profile for host: ${host.phone}`);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: host,
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

app.post(
  "/api/host/upload-profile-picture",
  authenticateHost,
  attachHostInfo, // ✅ ADD THIS LINE
  uploadImage.single("profilePicture"), // ✅ CHANGED from upload to uploadImage
  async (req, res) => {
    try {
      console.log("📥 POST /api/host/upload-profile-picture called");
      console.log("📥 File:", req.file);
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const host = await Host.findById(req.user.userId);
      if (!host) {
        // ✅ ADD: Delete uploaded file if host not found
        deleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      // ✅ CHANGED: Delete old profile picture using utility
      if (host.profilePicture) {
        deleteFile(host.profilePicture);
      }

      // ✅ CHANGED: Store relative path
      host.profilePicture = getRelativePath(req.file.path);
      await host.save();

      console.log(`✅ [PROFILE PICTURE] Uploaded for host: ${host.phone}`);
      console.log(`📁 Stored at: ${host.profilePicture}`); // ✅ ADD THIS

      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        imageUrl: host.profilePicture,
      });
    } catch (error) {
      console.error("❌ Upload profile picture error:", error);
      // ✅ ADD: Delete uploaded file on error
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
);
// ===============end
// old start
app.delete(
  "/api/host/delete-profile-picture",
  authenticateHost,
  async (req, res) => {
    try {
      console.log("📥 DELETE /api/host/delete-profile-picture called");
      const host = await Host.findById(req.user.userId);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      if (host.profilePicture) {
        const imagePath = path.join(__dirname, host.profilePicture);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
        host.profilePicture = null;
        await host.save();
      }

      console.log(`✅ [PROFILE PICTURE] Deleted for host: ${host.phone}`);

      res.json({
        success: true,
        message: "Profile picture deleted successfully",
      });
    } catch (error) {
      console.error("❌ Delete profile picture error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
);
// old end
// new start
app.delete(
  "/api/host/delete-profile-picture",
  authenticateHost,
  async (req, res) => {
    try {
      console.log("📥 DELETE /api/host/delete-profile-picture called");
      const host = await Host.findById(req.user.userId);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      if (host.profilePicture) {
        deleteFile(host.profilePicture); // ✅ CHANGED: Use utility function
        host.profilePicture = null;
        await host.save();
      }

      console.log(`✅ [PROFILE PICTURE] Deleted for host: ${host.phone}`);

      res.json({
        success: true,
        message: "Profile picture deleted successfully",
      });
    } catch (error) {
      console.error("❌ Delete profile picture error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
);
// new end
// ==================== HOST HOME ROUTES ====================
app.get("/api/host/all-hosts", authenticateHost, async (req, res) => {
  try {
    const hosts = await Host.find({ isHost: true, isActive: true })
      .select("firstName lastName profilePicture isOnline")
      .limit(20);
    res.json({
      success: true,
      hosts,
    });
  } catch (error) {
    console.error("❌ Get all hosts error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
app.put("/api/host/online-status", authenticateHost, async (req, res) => {
  try {
    const { isOnline } = req.body;
    const hostId = req.user.userId;
    const host = await Host.findById(hostId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }

    host.isOnline = isOnline;
    host.lastOnline = new Date();
    await host.save();

    console.log(
      `🔄 Host ${hostId} status updated: ${isOnline ? "Online" : "Offline"}`
    );

    res.json({
      success: true,
      message: "Status updated successfully",
      isOnline,
    });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/api/host/wallet", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.user.userId).select(
      "walletBalance earningPoints"
    );
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }

    res.json({
      success: true,
      walletBalance: host.walletBalance || 0,
      earningPoints: host.earningPoints || 0,
    });
  } catch (error) {
    console.error("❌ Get wallet error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ==================== IMAGE ROUTES ====================
app.get("/api/host/account/images", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.user.userId).select("images");
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    res.json({
      success: true,
      images: host.images || [],
    });
  } catch (error) {
    console.error("❌ Get images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post(
  "/api/host/account/upload-images",
  authenticateHost,
  attachHostInfo, // ✅ ADD THIS
  uploadImage.fields([
    // ✅ CHANGED from upload to uploadImage
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const host = await Host.findById(req.user.userId);
      if (!host) {
        // ✅ ADD: Delete uploaded files if host not found
        if (req.files) {
          Object.values(req.files)
            .flat()
            .forEach((file) => deleteFile(file.path));
        }
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded",
        });
      }

      const images = [];

      // Process uploaded images
      for (let i = 1; i <= 5; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName]) {
          const imageUrl = getRelativePath(req.files[fieldName][0].path); // ✅ CHANGED
          images.push(imageUrl);
          console.log(`✅ Processed ${fieldName}:`, imageUrl);
        }
      }

      if (images.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid images processed",
        });
      }

      // ✅ ADD: Delete old images before replacing
      const existingImages = host.images || [];
      existingImages.forEach((img) => deleteFile(img));

      // Merge with existing images
      const mergedImages = [...images];
      for (let i = mergedImages.length; i < 5; i++) {
        if (existingImages[i]) {
          mergedImages.push(existingImages[i]);
        }
      }

      host.images = mergedImages.slice(0, 5);
      await host.save();

      console.log(
        `✅ [IMAGES] Uploaded ${images.length} images for: ${req.hostData.fullName}`
      ); // ✅ CHANGED
      console.log(
        `📁 Stored in: uploads/images/${req.user.userId}-${req.hostName}`
      ); // ✅ ADD

      res.json({
        success: true,
        message: "Images uploaded successfully",
        images: host.images,
      });
    } catch (error) {
      console.error("❌ Upload images error:", error);
      // ✅ ADD: Delete uploaded files on error
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => deleteFile(file.path));
      }
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);
// new-end
// ==================== VIDEO ROUTES ====================

app.get("/api/host/account/myvideos", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.user.userId).select("videos");
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    console.log(`📥 Videos retrieved for host: ${req.user.userId}`);

    res.json({
      success: true,
      videos: host.videos || [],
    });
  } catch (error) {
    console.error("❌ Get videos error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// UPLOAD video
app.post(
  "/api/host/account/myvideos",
  authenticateHost,
  attachHostInfo,
  uploadVideo.single("video"),
  async (req, res) => {
    try {
      console.log("📤 POST /api/host/account/myvideos called");
      console.log("📤 User ID:", req.user.userId);
      console.log("📤 File:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No video file uploaded",
        });
      }

      const host = await Host.findById(req.user.userId);
      if (!host) {
        deleteFile(req.file.path);
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      if (!host.videos) {
        host.videos = [];
      }

      if (host.videos.length >= 10) {
        deleteFile(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Maximum 10 videos allowed",
        });
      }

      const videoUrl = getRelativePath(req.file.path);
      host.videos.push(videoUrl);

      await host.save();

      console.log(`✅ [VIDEO] Uploaded for: ${req.hostData.fullName}`);
      console.log(`📁 Stored at: ${videoUrl}`);

      res.json({
        success: true,
        message: "Video uploaded successfully",
        videoUrl,
        videos: host.videos,
      });
    } catch (error) {
      console.error("❌ Upload video error:", error);
      if (req.file) deleteFile(req.file.path);
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);

// DELETE video
app.delete(
  "/api/host/account/myvideos/:videoId",
  authenticateHost,
  async (req, res) => {
    try {
      console.log("🗑️ DELETE /api/host/account/myvideos/:videoId called");
      const { videoId } = req.params;

      const host = await Host.findById(req.user.userId);
      if (!host) {
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      const videoIndex = parseInt(videoId);

      if (
        isNaN(videoIndex) ||
        videoIndex < 0 ||
        videoIndex >= host.videos.length
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid video ID",
        });
      }

      const videoPath = host.videos[videoIndex];

      if (videoPath) {
        deleteFile(videoPath);
      }

      host.videos.splice(videoIndex, 1);
      await host.save();

      console.log(
        `✅ [VIDEO] Deleted index ${videoIndex} for host: ${req.user.userId}`
      );

      res.json({
        success: true,
        message: "Video deleted successfully",
        videos: host.videos,
      });
    } catch (error) {
      console.error("❌ Delete video error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);
// ==================== KYC ROUTES ====================
app.get("/api/host/account/kyc", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.user.userId).select("kyc");
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    res.json({
      success: true,
      kyc: host.kyc || { status: "pending" },
    });
  } catch (error) {
    console.error("❌ Get KYC error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post(
  "/api/host/account/upload-kyc",
  authenticateHost,
  attachHostInfo, // ✅ ADD
  uploadDocument.fields([
    // ✅ CHANGED from upload to uploadDocument
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "voterFront", maxCount: 1 },
    { name: "voterBack", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const host = await Host.findById(req.user.userId);
      if (!host) {
        // ✅ ADD: Cleanup on error
        if (req.files) {
          Object.values(req.files)
            .flat()
            .forEach((file) => deleteFile(file.path));
        }
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          success: false,
          message: "No KYC documents uploaded",
        });
      }

      if (!host.kyc) {
        host.kyc = {
          status: "pending",
        };
      }

      // ✅ ADD: Delete old KYC documents before replacing
      if (host.kyc.aadhaarFront) deleteFile(host.kyc.aadhaarFront);
      if (host.kyc.aadhaarBack) deleteFile(host.kyc.aadhaarBack);
      if (host.kyc.voterFront) deleteFile(host.kyc.voterFront);
      if (host.kyc.voterBack) deleteFile(host.kyc.voterBack);

      // ✅ CHANGED: Store relative paths
      if (req.files.aadhaarFront) {
        host.kyc.aadhaarFront = getRelativePath(req.files.aadhaarFront[0].path);
        console.log("✅ Aadhaar Front uploaded");
      }
      if (req.files.aadhaarBack) {
        host.kyc.aadhaarBack = getRelativePath(req.files.aadhaarBack[0].path);
        console.log("✅ Aadhaar Back uploaded");
      }
      if (req.files.voterFront) {
        host.kyc.voterFront = getRelativePath(req.files.voterFront[0].path);
        console.log("✅ Voter Front uploaded");
      }
      if (req.files.voterBack) {
        host.kyc.voterBack = getRelativePath(req.files.voterBack[0].path);
        console.log("✅ Voter Back uploaded");
      }

      host.kyc.status = "pending";
      await host.save();

      console.log(`✅ [KYC] Documents uploaded for: ${req.hostData.fullName}`); // ✅ CHANGED
      console.log(
        `📁 Stored in: uploads/documents/${req.user.userId}-${req.hostName}`
      ); // ✅ ADD

      res.json({
        success: true,
        message: "KYC documents uploaded successfully",
        kyc: host.kyc,
      });
    } catch (error) {
      console.error("❌ Upload KYC error:", error);
      // ✅ ADD: Cleanup on error
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => deleteFile(file.path));
      }
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);
// new end
// ==================== AUDITION VIDEO ROUTES ====================
app.get("/api/host/account/audition", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.user.userId).select("auditionVideo");
    if (!host) {
      return res.status(404).json({
        success: false,
        message: "Host not found",
      });
    }

    res.json({
      success: true,
      auditionVideo: host.auditionVideo || null,
    });
  } catch (error) {
    console.error("❌ Get audition error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post(
  "/api/host/account/upload-audition",
  authenticateHost,
  attachHostInfo, // ✅ ADD
  uploadVideo.single("auditionVideo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No audition video uploaded",
        });
      }

      const host = await Host.findById(req.user.userId);
      if (!host) {
        deleteFile(req.file.path); // ✅ ADD
        return res.status(404).json({
          success: false,
          message: "Host not found",
        });
      }

      // ✅ CHANGED: Delete old audition video using utility
      if (host.auditionVideo?.url) {
        deleteFile(host.auditionVideo.url);
      }

      host.auditionVideo = {
        url: getRelativePath(req.file.path), // ✅ CHANGED
        status: "pending",
        uploadedAt: new Date(),
      };

      await host.save();

      console.log(`✅ [AUDITION] Video uploaded for: ${req.hostData.fullName}`); // ✅ CHANGED
      console.log(`📁 Stored at: ${host.auditionVideo.url}`); // ✅ ADD

      res.json({
        success: true,
        message: "Audition video uploaded successfully",
        auditionVideo: host.auditionVideo,
      });
    } catch (error) {
      console.error("❌ Upload audition video error:", error);
      if (req.file) deleteFile(req.file.path); // ✅ ADD
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
);
// new end
// ==================== BANK & WITHDRAWAL ROUTES ====================
app.post(
  "/api/host/account/bank-details",
  authenticateHost,
  async (req, res) => {
    try {
      const {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode,
        accountType,
      } = req.body;
      const host = await Host.findById(req.user.userId);
      if (!host) {
        return res
          .status(404)
          .json({ success: false, message: "Host not found" });
      }

      host.bankDetails = {
        accountHolderName,
        bankName,
        accountNumber,
        ifscCode: ifscCode.toUpperCase(),
        accountType,
        verified: false,
      };
      await host.save();

      console.log(`✅ [BANK] Saved bank details for host: ${host.phone}`);

      res.json({
        success: true,
        message: "Bank details saved successfully",
        bankDetails: host.bankDetails,
      });
    } catch (error) {
      console.error("❌ Save bank details error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);
app.get(
  "/api/host/account/bank-details",
  authenticateHost,
  async (req, res) => {
    try {
      const host = await Host.findById(req.user.userId).select("bankDetails");
      res.json({
        success: true,
        bankDetails: host.bankDetails,
      });
    } catch (error) {
      console.error("❌ Get bank details error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);
app.post("/api/host/account/withdraw", authenticateHost, async (req, res) => {
  try {
    const { amount, upiId } = req.body;
    const host = await Host.findById(req.user.userId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }

    if (amount > host.walletBalance) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    const points = amount / 8;

    host.withdrawals.push({
      amount,
      points,
      upiId,
      status: "pending",
      requestedAt: new Date(),
    });

    host.walletBalance -= amount;

    await host.save();

    console.log(
      `✅ [WITHDRAW] Request submitted by host: ${host.phone} - Amount: ₹${amount}`
    );

    res.json({
      success: true,
      message: "Withdrawal request submitted successfully",
      withdrawal: host.withdrawals[host.withdrawals.length - 1],
    });
  } catch (error) {
    console.error("❌ Withdraw error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.get("/api/host/account/withdrawals", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.user.userId).select("withdrawals");
    const withdrawals = host.withdrawals.sort(
      (a, b) => new Date(b.requestedAt) - new Date(a.requestedAt)
    );

    res.json({
      success: true,
      withdrawals,
    });
  } catch (error) {
    console.error("❌ Get withdrawals error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ==================== AGENCY ROUTES ====================
app.post("/api/agency/signup", async (req, res) => {
  try {
    const { email, phone, password, agencyName, agencyCode } = req.body;
    if (!email || !phone || !password || !agencyName || !agencyCode) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingAgency = await Agency.findOne({
      $or: [{ email }, { phone }, { agencyCode: agencyCode.toUpperCase() }],
    });

    if (existingAgency) {
      return res.status(400).json({
        success: false,
        message: "Email, phone, or agency code already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAgency = new Agency({
      email,
      phone,
      password: hashedPassword,
      agencyName,
      agencyCode: agencyCode.toUpperCase(),
      isVerified: true,
    });

    await newAgency.save();

    const token = jwt.sign(
      { agencyId: newAgency._id, email: newAgency.email, type: "agency" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ [AGENCY SIGNUP] ${email}`);

    res.json({
      success: true,
      message: "Agency registered successfully",
      token,
      agency: newAgency,
    });
  } catch (error) {
    console.error("❌ Agency signup error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
app.post("/api/agency/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const agency = await Agency.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!agency) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, agency.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    agency.lastLogin = new Date();
    await agency.save();

    const token = jwt.sign(
      {
        agencyId: agency._id,
        email: agency.email,
        agencyCode: agency.agencyCode,
        type: "agency",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ [AGENCY LOGIN] ${email}`);

    res.json({
      success: true,
      message: "Agency login successful",
      token,
      agency,
    });
  } catch (error) {
    console.error("❌ Agency login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ==================== ADMIN ROUTES ====================
app.post("/api/host/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const admin = await Admin.findOne({
      username: username.toLowerCase(),
      isActive: true,
    });

    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      {
        adminId: admin._id,
        username: admin.username,
        role: admin.role,
        type: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ [ADMIN LOGIN] ${username}`);

    res.json({
      success: true,
      message: "Admin login successful",
      token,
      admin,
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
// ==================== ERROR HANDLERS ====================
app.use((req, res) => {
  console.log("❌ 404 Not Found: ${req.method} ${req.path}");
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message:
          "File too large. Maximum size is 5MB for images, 50MB for videos",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});
// ==================== CREATE INITIAL ADMIN ====================
async function createInitialAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: "superadmin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      await Admin.create({
        username: "superadmin",
        password: hashedPassword,
        role: "superadmin",
      });
      console.log("\n🛡 ================================");
      console.log("   INITIAL ADMIN CREATED");
      console.log("   ================================");
      console.log("   Username: superadmin");
      console.log("   Password: Admin@12345");
      console.log("   ⚠️  CHANGE PASSWORD IMMEDIATELY!");
      console.log("   ================================\n");
    }
  } catch (error) {
    console.error("❌ Admin creation error:", error);
  }
}
mongoose.connection.once("open", () => {
  createInitialAdmin();
});
// ==================== START SERVER WITH SOCKET.IO ====================
server.listen(PORT, () => {
  console.log("\n🚀 ================================");
  console.log(" SERVER RUNNING ON PORT ${PORT}");
  console.log("  Environment: ${process.env.NODE_ENV" || "development}");
  console.log("  API URL: http://localhost:${PORT}/api");
  console.log(" ✅ Socket.io enabled");
  console.log(" ✅ CORS configured");
  console.log("   ================================\n");
});
// ==================== GRACEFUL SHUTDOWN ====================
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});
process.on("SIGINT", () => {
  console.log("\n👋 SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("✅ HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});
