const express = require("express");
const router = express.Router();
const {
  getOnlineHosts,
  getAllHosts,
  getHostById,
  updateHostStatus,
  updateHostStats,
} = require("../controllers/hostController");
const { protect } = require("../middleware/userAuth");

// ✅ Get online hosts (User side)
router.get("/online", protect, getOnlineHosts);

// ✅ Get all hosts
router.get("/", protect, getAllHosts);

// ✅ Get single host by ID
router.get("/:hostId", protect, getHostById);

// ✅ Update host online/offline/busy status
router.put("/:hostId/status", updateHostStatus);

// ✅ Update host stats after call
router.put("/:hostId/stats", updateHostStats);

module.exports = router;
