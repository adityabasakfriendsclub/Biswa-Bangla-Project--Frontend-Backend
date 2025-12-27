const Admin = require("../models/Admin");
const User = require("../models/User");
const { generateToken } = require("../middleware/adminAuth");

// ==================== ADMIN LOGIN ====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("=== ADMIN LOGIN START ===");
    console.log("Email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: "Admin account is deactivated",
      });
    }

    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin._id);

    console.log("✅ Admin login successful");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error) {
    console.error("❌ Admin Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ==================== GET DASHBOARD STATS ====================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const unverifiedUsers = await User.countDocuments({ isVerified: false });

    const maleUsers = await User.countDocuments({ gender: "Male" });
    const femaleUsers = await User.countDocuments({ gender: "Female" });
    const otherUsers = await User.countDocuments({ gender: "Others" });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today },
    });

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekUsers = await User.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const monthUsers = await User.countDocuments({
      createdAt: { $gte: monthAgo },
    });

    // Get last 7 days user registration data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await User.countDocuments({
        createdAt: { $gte: date, $lt: nextDate },
      });

      last7Days.push({
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        verifiedUsers,
        unverifiedUsers,
        genderDistribution: {
          male: maleUsers,
          female: femaleUsers,
          others: otherUsers,
        },
        newUsers: {
          today: todayUsers,
          week: weekUsers,
          month: monthUsers,
        },
        registrationTrend: last7Days,
      },
    });
  } catch (error) {
    console.error("❌ Get Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
    });
  }
};

// ==================== GET ALL USERS ====================
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      gender = "",
      isVerified = "",
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Search by name or phone
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by gender
    if (gender) {
      query.gender = gender;
    }

    // Filter by verification status
    if (isVerified !== "") {
      query.isVerified = isVerified === "true";
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .select("-otp -otpExpires -tempPassword");

    const totalUsers = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          perPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Get Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching users",
    });
  }
};

// ==================== GET SINGLE USER ====================
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-otp -otpExpires -tempPassword"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error("❌ Get User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

// ==================== UPDATE USER ====================
exports.updateUser = async (req, res) => {
  try {
    const { isVerified, firstName, lastName, gender } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (isVerified !== undefined) user.isVerified = isVerified;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (gender) user.gender = gender;

    await user.save();

    console.log("✅ User updated:", user._id);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("❌ Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating user",
    });
  }
};

// ==================== DELETE USER ====================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    console.log("✅ User deleted:", req.params.id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting user",
    });
  }
};

// ==================== GET RECENT USERS ====================
exports.getRecentUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select("-otp -otpExpires -tempPassword -password");

    return res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.error("❌ Get Recent Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching recent users",
    });
  }
};
