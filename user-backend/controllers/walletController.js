const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ==================== CREATE RAZORPAY ORDER ====================
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user._id;

    console.log("📤 Creating order for user:", userId, "Amount:", amount);

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    // ✅ FIX: Create shorter receipt (max 40 chars)
    // Format: rcpt_TIMESTAMP_RANDOMID
    const timestamp = Date.now().toString().slice(-10); // Last 10 digits
    const randomId = Math.random().toString(36).substring(2, 8); // 6 random chars
    const receipt = `rcpt_${timestamp}_${randomId}`; // ~23 characters

    console.log("📝 Generated receipt:", receipt, "Length:", receipt.length);

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert rupees to paise
      currency: "INR",
      receipt: receipt, // ✅ Now within 40 char limit
    };

    const order = await razorpay.orders.create(options);
    console.log("✅ Order created:", order.id);

    return res.status(200).json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// ==================== VERIFY PAYMENT ====================
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;
    const userId = req.user._id;

    console.log("🔍 Verifying payment:", razorpay_payment_id);

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      console.log("❌ Invalid signature");
      return res.status(400).json({
        success: false,
        message: "Payment verification failed - Invalid signature",
      });
    }

    console.log("✅ Signature verified");

    // Update wallet balance
    const user = await User.findById(userId);
    const balanceBefore = user.walletBalance;

    user.walletBalance += amount;
    await user.save();

    console.log("💰 Balance updated:", balanceBefore, "→", user.walletBalance);

    // Create transaction record
    await Transaction.create({
      userId,
      type: "credit",
      amount,
      description: `Wallet Recharge via Razorpay`,
      balanceBefore,
      balanceAfter: user.walletBalance,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "completed",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { newBalance: user.walletBalance },
    });
  } catch (error) {
    console.error("❌ Verify payment error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

// ==================== GET BALANCE ====================
exports.getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: { balance: user.walletBalance },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ==================== GET TRANSACTIONS ====================
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: { transactions },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// for demo
// const User = require("../models/User");
// const Transaction = require("../models/Transaction");
// const crypto = require("crypto");

// // ==================== RAZORPAY INITIALIZATION ====================
// let razorpay;
// try {
//   const Razorpay = require("razorpay");

//   // Check if keys are present
//   if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
//     console.error("❌ RAZORPAY KEYS MISSING IN .env FILE!");
//     console.error("Please add:");
//     console.error("RAZORPAY_KEY_ID=rzp_test_t3MVJcEfzJZomz");
//     console.error("RAZORPAY_KEY_SECRET=58Uw1fyNB8440OSk625v9Ql");
//   } else {
//     razorpay = new Razorpay({
//       key_id: process.env.RAZORPAY_KEY_ID,
//       key_secret: process.env.RAZORPAY_KEY_SECRET,
//     });
//     console.log("✅ Razorpay initialized successfully (TEST MODE)");
//     console.log("   Key ID:", process.env.RAZORPAY_KEY_ID);
//   }
// } catch (error) {
//   console.error("❌ Failed to initialize Razorpay:", error.message);
//   console.error("   Run: npm install razorpay");
// }

// // ==================== CREATE RAZORPAY ORDER ====================
// exports.createOrder = async (req, res) => {
//   try {
//     // Check if Razorpay is initialized
//     if (!razorpay) {
//       console.error("❌ Razorpay not initialized");
//       return res.status(500).json({
//         success: false,
//         message: "Payment gateway not configured. Please contact support.",
//         error: "Razorpay not initialized",
//       });
//     }

//     const { amount } = req.body;
//     const userId = req.user._id;

//     console.log("🔐 [DEMO MODE] Creating Razorpay order");
//     console.log("  User ID:", userId);
//     console.log("  Amount:", amount);

//     // Validation
//     if (!amount || amount <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid amount",
//       });
//     }

//     // ✅ Create shorter receipt (max 40 chars)
//     const timestamp = Date.now().toString().slice(-10);
//     const randomId = Math.random().toString(36).substring(2, 8);
//     const receipt = `rcpt_${timestamp}_${randomId}`;

//     console.log("📝 Receipt generated:", receipt, "Length:", receipt.length);

//     // ✅ Create Razorpay order
//     const options = {
//       amount: amount * 100, // Convert rupees to paise
//       currency: "INR",
//       receipt: receipt,
//       notes: {
//         mode: "demo",
//         description: "Test wallet recharge - No real money",
//         userId: userId.toString(),
//       },
//     };

//     console.log("📤 Creating Razorpay order with options:", options);

//     const order = await razorpay.orders.create(options);

//     console.log("✅ [DEMO] Order created successfully:", order.id);

//     return res.status(200).json({
//       success: true,
//       data: {
//         orderId: order.id,
//         amount: order.amount,
//         currency: order.currency,
//         keyId: process.env.RAZORPAY_KEY_ID,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Create order error:", error);
//     console.error("   Error name:", error.name);
//     console.error("   Error message:", error.message);
//     console.error("   Error stack:", error.stack);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create order. Please try again.",
//       error: error.message,
//       details: process.env.NODE_ENV === "development" ? error.stack : undefined,
//     });
//   }
// };

// // ==================== VERIFY PAYMENT ====================
// exports.verifyPayment = async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       amount,
//     } = req.body;
//     const userId = req.user._id;

//     console.log("🔍 [DEMO MODE] Verifying payment");
//     console.log("  Payment ID:", razorpay_payment_id);
//     console.log("  Order ID:", razorpay_order_id);

//     // ✅ Verify signature
//     const text = razorpay_order_id + "|" + razorpay_payment_id;
//     const generated_signature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(text)
//       .digest("hex");

//     if (generated_signature !== razorpay_signature) {
//       console.log("❌ Invalid signature");
//       return res.status(400).json({
//         success: false,
//         message: "Payment verification failed - Invalid signature",
//       });
//     }

//     console.log("✅ Signature verified successfully");

//     // ✅ Update wallet balance
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const balanceBefore = user.walletBalance;
//     user.walletBalance += amount;
//     await user.save();

//     console.log("💰 Wallet updated:");
//     console.log("  Before:", balanceBefore);
//     console.log("  After:", user.walletBalance);
//     console.log("  Added:", amount);

//     // ✅ Create transaction record
//     await Transaction.create({
//       userId,
//       type: "credit",
//       amount,
//       description: `Wallet Recharge via Razorpay (DEMO)`,
//       balanceBefore,
//       balanceAfter: user.walletBalance,
//       paymentId: razorpay_payment_id,
//       orderId: razorpay_order_id,
//       status: "completed",
//     });

//     console.log("✅ Transaction recorded");

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified successfully",
//       data: {
//         newBalance: user.walletBalance,
//         amountAdded: amount,
//         transactionId: razorpay_payment_id,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Verify payment error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Payment verification failed",
//       error: error.message,
//     });
//   }
// };

// // ==================== GET BALANCE ====================
// exports.getBalance = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: { balance: user.walletBalance },
//     });
//   } catch (error) {
//     console.error("❌ Get balance error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ==================== GET TRANSACTIONS ====================
// exports.getTransactions = async (req, res) => {
//   try {
//     const transactions = await Transaction.find({ userId: req.user._id })
//       .sort({ createdAt: -1 })
//       .limit(50);

//     res.json({
//       success: true,
//       data: { transactions },
//     });
//   } catch (error) {
//     console.error("❌ Get transactions error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
