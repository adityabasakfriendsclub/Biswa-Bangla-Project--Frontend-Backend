// const express = require("express");
// const router = express.Router();
// const {
//   startCall,
//   billingDeduct,
//   endCall,
// } = require("../controllers/callController");
// const { protect } = require("../middleware/userAuth");

// router.post("/start", protect, startCall);
// router.post("/billing", protect, billingDeduct);
// router.post("/end", protect, endCall);

// module.exports = router;

// new 2
// routes/call.js - UPDATED WITH BLOCKED CHECK
// const express = require("express");
// const router = express.Router();
// const {
//   startCall,
//   billingDeduct,
//   endCall,
// } = require("../controllers/callController");
// const { protect } = require("../middleware/userAuth");
// const { checkBlocked } = require("../middleware/checkBlocked");

// // Apply blocked check to all call routes
// router.use(protect);
// router.use(checkBlocked);

// router.post("/start", startCall);
// router.post("/billing", billingDeduct);
// router.post("/end", endCall);

// module.exports = router;

// // ================================================================

// // routes/wallet.js - UPDATED WITH BLOCKED CHECK
// const express2 = require("express");
// const router2 = express2.Router();
// const {
//   createOrder,
//   verifyPayment,
//   getBalance,
//   getTransactions,
// } = require("../controllers/walletController");
// const { protect: protect2 } = require("../middleware/userAuth");
// const { checkBlocked: checkBlocked2 } = require("../middleware/checkBlocked");

// // Apply blocked check to all wallet routes
// router2.use(protect2);
// router2.use(checkBlocked2);

// router2.post("/create-order", createOrder);
// router2.post("/verify-payment", verifyPayment);
// router2.get("/balance", getBalance);
// router2.get("/transactions", getTransactions);

// module.exports = router2;

// // ================================================================

// // routes/host.js - UPDATED WITH BLOCKED CHECK
// const express3 = require("express");
// const router3 = express3.Router();
// const {
//   getOnlineHosts,
//   getAllHosts,
//   getHostById,
//   updateHostStatus,
//   updateHostStats,
// } = require("../controllers/hostController");
// const { protect: protect3 } = require("../middleware/userAuth");
// const {
//   checkBlocked: checkBlocked3,
//   trackActivity,
// } = require("../middleware/checkBlocked");

// // Public routes (no auth needed)
// router3.put("/:hostId/status", updateHostStatus);
// router3.put("/:hostId/stats", updateHostStats);

// // Protected routes with blocked check
// router3.get("/online", protect3, checkBlocked3, trackActivity, getOnlineHosts);
// router3.get("/", protect3, checkBlocked3, trackActivity, getAllHosts);
// router3.get("/:hostId", protect3, checkBlocked3, trackActivity, getHostById);

// module.exports = router3;

// // ================================================================

// // routes/userProfile.js - UPDATED WITH BLOCKED CHECK
// const express4 = require("express");
// const router4 = express4.Router();
// const {
//   getProfile,
//   updateProfile,
//   uploadProfileImage,
// } = require("../controllers/userController");
// const { protect: protect4 } = require("../middleware/userAuth");
// const { checkBlocked: checkBlocked4 } = require("../middleware/checkBlocked");

// // Apply blocked check to all profile routes
// router4.use(protect4);
// router4.use(checkBlocked4);

// router4.get("/profile", getProfile);
// router4.put("/profile", updateProfile);
// router4.post("/upload-image", uploadProfileImage);

// module.exports = router4;
const express = require("express");
const router = express.Router();
const {
  startCall,
  billingDeduct,
  endCall,
} = require("../controllers/callController");
const { protect } = require("../middleware/userAuth");

router.post("/start", protect, startCall);
router.post("/billing", protect, billingDeduct);
router.post("/end", protect, endCall);

module.exports = router;
