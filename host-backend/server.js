require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, validationResult } = require("express-validator");

// Import models
const Host = require("./models/Host");
const Agency = require("./models/Agency");
const Admin = require("./models/Admin");
const { sendOTP, generateOTP } = require("./services/smsService");

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==================== MIDDLEWARE ====================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://biswabanglasocialnetworkingservices.com",
      "https://www.biswabanglasocialnetworkingservices.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// ==================== MONGODB CONNECTION ====================
mongoose
  .connect(process.env.URI || "mongodb://localhost:27017/dating-app")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ==================== FILE UPLOAD CONFIGURATION ====================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter,
});

// ==================== OTP STORAGE ====================
const otpStorage = {};

// ==================== HELPER FUNCTION: CALCULATE AGE ====================
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

// ==================== UPDATED VALIDATION RULES ====================
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
      // Premium can only be true if isHost is true
      if (value && !req.body.isHost) {
        throw new Error("You must be a Host to enable Premium");
      }
      return true;
    }),
  body("interAgencyCode")
    .optional()
    .trim()
    .custom((value, { req }) => {
      // If isHostPremium is true, interAgencyCode is required
      if (req.body.isHostPremium && !value) {
        throw new Error("Inter-Agency Code required for Premium Hosts");
      }
      // If provided, must be at least 6 characters
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

// ==================== AUTHENTICATION MIDDLEWARE ====================
const authenticateHost = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.host = decoded;
    next();
  });
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

// ==================== HEALTH CHECK ====================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// ==================== HOST AUTH ROUTES ====================

// 1. Host Signup - Send OTP (UPDATED)
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

      // Check if host already exists
      const existingHost = await Host.findOne({ phone });
      if (existingHost && existingHost.isVerified) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered",
        });
      }

      // Check if inter-agency code already exists (if provided)
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

      // Validate: isHostPremium can only be true if isHost is true
      if (isHostPremium && !isHost) {
        return res.status(400).json({
          success: false,
          message: "You must be a Host to enable Premium",
        });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpResult = await sendOTP(phone, otp);

      if (!otpResult.success) {
        return res
          .status(500)
          .json({ success: false, message: "Failed to send OTP" });
      }

      // Store OTP and user data
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
      console.log(
        `   📋 User Type: ${isHost ? "Host" : "User"} ${
          isHostPremium ? "(Premium)" : ""
        }`
      );
      if (interAgencyCode) {
        console.log(
          `   🆔 Inter-Agency Code: ${interAgencyCode.toUpperCase()}`
        );
      }

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

// 2. Verify OTP & Complete Registration (UPDATED)
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

    // Hash password
    const hashedPassword = await bcrypt.hash(otpData.userData.password, 10);

    // Create new host with all new fields
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

    console.log(`✅ [HOST REGISTERED] ${phone}`);
    console.log(
      `   📋 Type: ${newHost.isHost ? "Host" : "User"} ${
        newHost.isHostPremium ? "(Premium)" : ""
      }`
    );
    if (newHost.interAgencyCode) {
      console.log(`   🆔 Inter-Agency Code: ${newHost.interAgencyCode}`);
    }

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
      },
    });
  } catch (error) {
    console.error("❌ Verify signup error:", error);

    // Handle duplicate inter-agency code error
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

// 3. Host Login
app.post("/api/host/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Find host
    const host = await Host.findOne({ phone });
    if (!host) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if verified
    if (!host.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Account not verified" });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, host.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Update last login
    host.lastLogin = new Date();
    await host.save();

    const token = jwt.sign(
      { userId: host._id, phone: host.phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ [HOST LOGIN] ${phone}`);

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
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 4. Forgot Password - Send OTP
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

// 5. Verify OTP & Reset Password
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

// 6. Resend OTP
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

// ==================== HOST PROFILE ROUTES ====================

app.get("/api/host/profile", authenticateHost, async (req, res) => {
  try {
    const host = await Host.findById(req.host.userId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
    }
    res.json({ success: true, user: host });
  } catch (error) {
    console.error("❌ Profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.put("/api/host/profile", authenticateHost, async (req, res) => {
  try {
    const { bio, dateOfBirth, interests, location } = req.body;

    const host = await Host.findById(req.host.userId);
    if (!host) {
      return res
        .status(404)
        .json({ success: false, message: "Host not found" });
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
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==================== AGENCY ROUTES ====================

app.post("/api/agency/signup", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      agencyName,
      agencyCode,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !agencyName ||
      !agencyCode
    ) {
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
      firstName,
      lastName,
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
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  res
    .status(500)
    .json({ success: false, message: err.message || "Internal server error" });
});

// ==================== CREATE INITIAL ADMIN ====================
async function createInitialAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: "superadmin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin@12345", 10);
      await Admin.create({
        username: "superadmin",
        email: "admin@datingapp.com",
        password: hashedPassword,
        role: "superadmin",
      });
      // console.log("\n🔐 ================================");
      // console.log("   INITIAL ADMIN CREATED");
      // console.log("   ================================");
      // console.log("   Username: superadmin");
      // console.log("   Password: Admin@12345");
      // console.log("   ⚠️  CHANGE PASSWORD IMMEDIATELY!");
      // console.log("   ================================\n");
    }
  } catch (error) {
    console.error("❌ Admin creation error:", error);
  }
}

mongoose.connection.once("open", () => {
  createInitialAdmin();
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log("\n🚀 ================================");
  console.log(`   SERVER RUNNING ON PORT ${PORT}`);
  console.log("   ================================\n");
});
