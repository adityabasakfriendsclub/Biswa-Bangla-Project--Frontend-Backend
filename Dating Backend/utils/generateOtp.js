// ================= GENERATE 6-DIGIT OTP =================
exports.generateOtp = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

// ================= OTP EXPIRY TIME =================
exports.getOtpExpiry = (minutes = 5) => {
  if (typeof minutes !== "number" || minutes <= 0) {
    minutes = 5;
  }
  return Date.now() + minutes * 60 * 1000;
};

// ================= CHECK OTP EXPIRY =================
exports.isOtpExpired = (otpExpires) => {
  if (!otpExpires) return true;
  return Date.now() > otpExpires;
};
