const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getBalance,
  getTransactions,
} = require("../controllers/walletController");
const { protect } = require("../middleware/userAuth");

// Razorpay Routes
router.post("/create-order", protect, createOrder);
router.post("/verify-payment", protect, verifyPayment);

// Wallet Routes
router.get("/balance", protect, getBalance);
router.get("/transactions", protect, getTransactions);

module.exports = router;
