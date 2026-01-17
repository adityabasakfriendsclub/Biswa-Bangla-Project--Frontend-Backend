// const express = require("express");
// const router = express.Router();
// const Report = require("../models/Report");
// const { protect } = require("../middleware/userAuth");

// router.post("/submit", protect, async (req, res) => {
//   const report = await Report.create({
//     userId: req.user._id,
//     name: `${req.user.firstName} ${req.user.lastName}`,
//     phone: req.user.phone,
//     complaintTypes: req.body.types,
//     description: req.body.description,
//     evidenceFile: req.body.file,
//   });

//   res.status(201).json({ success: true, data: { report } });
// });

// module.exports = router;

// new
// routes/report.js - UPDATED WITH ALL ENDPOINTS
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/userAuth");
const { protect: adminProtect } = require("../middleware/adminAuth");
const {
  submitReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require("../controllers/reportController");

// ✅ USER ROUTES
router.post("/submit", protect, submitReport);

// ✅ ADMIN ROUTES
router.get("/", adminProtect, getAllReports);
router.get("/:id", adminProtect, getReportById);
router.put("/:reportId", adminProtect, updateReportStatus);
router.delete("/:id", adminProtect, deleteReport);

module.exports = router;
