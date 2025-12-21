// utils/generateOtp.js - CLEAN VERSION

// ================= GENERATE 6-DIGIT OTP =================
exports.generateOtp = () => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  console.log("✅ Generated OTP:", otp);
  return otp;
};

// ================= OTP EXPIRY TIME =================
exports.getOtpExpiry = (minutes = 10) => {
  console.log("🔍 getOtpExpiry called with minutes:", minutes);

  if (typeof minutes !== "number" || minutes <= 0) {
    console.warn("⚠️ Invalid minutes value, using default 10");
    minutes = 10;
  }

  const now = Date.now();
  const expiryTime = now + minutes * 60 * 1000;

  console.log("📅 OTP Timing:");
  console.log("  Current time:", new Date(now));
  console.log("  Expiry time:", new Date(expiryTime));
  console.log("  Duration (minutes):", minutes);
  console.log("  Duration (milliseconds):", minutes * 60 * 1000);
  console.log("  Time until expiry (seconds):", (expiryTime - now) / 1000);

  return expiryTime;
};

// ================= CHECK OTP EXPIRY =================
exports.isOtpExpired = (otpExpires) => {
  if (!otpExpires) {
    console.log("❌ No expiry time found");
    return true;
  }

  const now = Date.now();
  const expired = now > otpExpires;
  const timeLeft = (otpExpires - now) / 1000; // seconds

  console.log("🕐 OTP Expiry Check:");
  console.log("  Current time:", new Date(now));
  console.log("  Expiry time:", new Date(otpExpires));
  console.log("  Time left (seconds):", timeLeft);
  console.log("  Is expired?", expired);

  return expired;
};
