const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   POST /api/dating/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, phone, gender, password, confirmPassword } =
      req.body;

    console.log("=== REGISTRATION DEBUG ===");
    console.log("Full request body:", req.body);
    console.log("firstName:", firstName);
    console.log("lastName:", lastName);
    console.log("phone:", phone);
    console.log("gender:", gender);
    console.log("password present:", !!password);
    console.log("confirmPassword present:", !!confirmPassword);
    console.log("passwords match:", password === confirmPassword);
    console.log("========================");

    // Validation: Check if all required fields are provided
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
        missingFields: {
          firstName: !firstName,
          lastName: !lastName,
          phone: !phone,
          gender: !gender,
          password: !password,
          confirmPassword: !confirmPassword,
        },
      });
    }

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Check if user already exists with phone
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      console.log("❌ User already exists with this phone");
      return res.status(409).json({
        success: false,
        message: "User with this phone number already exists",
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      phone,
      gender,
      password,
    });

    console.log("✅ User created successfully:", user._id);

    // Return success response without password
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          gender: user.gender,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      console.log("Validation errors:", messages);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.log("Duplicate field:", field);
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// @route   POST /api/dating/auth/login
// @desc    Login user (using phone number)
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    console.log("Login attempt for phone:", phone);

    // Validation
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide phone number and password",
      });
    }

    // Find user and include password field
    const user = await User.findOne({ phone }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    // Check if user is active (if you have this field)
    // if (!user.isActive) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Account is deactivated",
    //   });
    // }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    console.log("✅ Login successful for phone:", phone);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          gender: user.gender,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
});

// @route   GET /api/dating/auth/profile/:id
// @desc    Get user profile
// @access  Public (Should be protected with auth middleware in production)
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;
