// controllers/userController.js - NEW FILE
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Configure multer for profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "user-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
}).single("profileImage");

// ==================== GET USER PROFILE ====================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -otp -otpExpires -tempPassword"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate age if DOB exists
    let age = null;
    if (user.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(user.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          age,
        },
      },
    });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching profile",
    });
  }
};

// ==================== UPDATE USER PROFILE ====================
exports.updateProfile = async (req, res) => {
  try {
    const { nickname, gender, dateOfBirth } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    if (nickname) user.nickname = nickname;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);

    await user.save();

    // Calculate age
    let age = null;
    if (user.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(user.dateOfBirth);
      age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    console.log("✅ User profile updated:", user._id);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          nickname: user.nickname,
          phone: user.phone,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          profileImage: user.profileImage,
          walletBalance: user.walletBalance,
          age,
        },
      },
    });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

// ==================== UPLOAD PROFILE IMAGE ====================
exports.uploadProfileImage = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: "File upload error: " + err.message,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    try {
      const userId = req.user._id;
      const imageUrl = `/uploads/users/${req.file.filename}`;

      const user = await User.findByIdAndUpdate(
        userId,
        { profileImage: imageUrl },
        { new: true }
      ).select("-password -otp -otpExpires -tempPassword");

      console.log("✅ Profile image uploaded:", imageUrl);

      return res.status(200).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: {
          profileImage: imageUrl,
          user,
        },
      });
    } catch (error) {
      console.error("❌ Upload Image Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while uploading image",
      });
    }
  });
};

module.exports = {
  getProfile: exports.getProfile,
  updateProfile: exports.updateProfile,
  uploadProfileImage: exports.uploadProfileImage,
};
