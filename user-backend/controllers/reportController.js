// controllers/reportController.js - COMPLETE WITH FILE UPLOAD
const Report = require("../models/Report");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Create uploads directory if it doesn't exist
const uploadsDir = "uploads/reports";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Configure multer for evidence file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "evidence-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images, PDFs, and videos
  const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|mpeg/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images, PDF, and videos are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
}).single("evidenceFile");

// ✅ SUBMIT REPORT WITH FILE UPLOAD
exports.submitReport = async (req, res) => {
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

    try {
      const {
        firstName,
        lastName,
        phone,
        email,
        appUserId,
        types,
        description,
      } = req.body;

      // Validation
      if (
        !firstName ||
        !lastName ||
        !phone ||
        !email ||
        !appUserId ||
        !types ||
        !description
      ) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      // Parse complaint types if sent as string
      let complaintTypes;
      try {
        complaintTypes = typeof types === "string" ? JSON.parse(types) : types;
      } catch (error) {
        complaintTypes = [types];
      }

      // Get file path if file was uploaded
      const evidenceFile = req.file
        ? `/uploads/reports/${req.file.filename}`
        : null;

      if (!evidenceFile) {
        return res.status(400).json({
          success: false,
          message: "Evidence file is required",
        });
      }

      // Create report
      const report = await Report.create({
        userId: req.user._id,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        phone,
        email,
        appUserId,
        complaintTypes,
        description,
        evidenceFile,
        status: "pending",
      });

      console.log("✅ Report submitted:", report._id);

      return res.status(201).json({
        success: true,
        message: "Report submitted successfully",
        data: { report },
      });
    } catch (error) {
      console.error("❌ Submit Report Error:", error);
      return res.status(500).json({
        success: false,
        message: "Server error while submitting report",
      });
    }
  });
};

// ✅ GET ALL REPORTS (Admin)
exports.getAllReports = async (req, res) => {
  try {
    const {
      status = "all",
      page = 1,
      limit = 50,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};
    if (status !== "all") {
      query.status = status;
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    const reports = await Report.find(query)
      .populate("userId", "firstName lastName phone")
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const totalReports = await Report.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalReports / limit),
          totalReports,
          perPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("❌ Get Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports",
    });
  }
};

// ✅ GET SINGLE REPORT BY ID (Admin)
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      "userId",
      "firstName lastName phone email"
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { report },
    });
  } catch (error) {
    console.error("❌ Get Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching report",
    });
  }
};

// ✅ UPDATE REPORT STATUS (Admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes } = req.body;

    if (!["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    report.status = status;
    if (adminNotes) {
      report.adminNotes = adminNotes;
    }
    report.reviewedAt = new Date();

    await report.save();

    console.log("✅ Report status updated:", reportId);

    return res.status(200).json({
      success: true,
      message: "Report updated successfully",
      data: { report },
    });
  } catch (error) {
    console.error("❌ Update Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating report",
    });
  }
};

// ✅ DELETE REPORT (Admin)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Delete evidence file if exists
    if (report.evidenceFile) {
      const filePath = path.join(__dirname, "..", report.evidenceFile);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Report.findByIdAndDelete(req.params.id);

    console.log("✅ Report deleted:", req.params.id);

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting report",
    });
  }
};

module.exports = {
  submitReport: exports.submitReport,
  getAllReports: exports.getAllReports,
  getReportById: exports.getReportById,
  updateReportStatus: exports.updateReportStatus,
  deleteReport: exports.deleteReport,
};
