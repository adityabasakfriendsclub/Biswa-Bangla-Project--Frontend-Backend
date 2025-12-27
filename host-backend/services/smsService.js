// services/smsService.js
// ✅ Twilio SMS OTP Service (ONLY)

const twilio = require("twilio");

// Create Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send OTP via Twilio
async function sendOTP(phone, otp) {
  try {
    // DEV MODE: show OTP in terminal
    if (process.env.NODE_ENV === "development") {
      console.log(`📵 SMS skipped (DEV): OTP = ${otp}`);
      return { success: true };
    }

    // PRODUCTION: send real SMS
    await twilioClient.messages.create({
      body: `Your Dating App verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone.startsWith("+") ? phone : `+91${phone}`, // India support
    });

    console.log("✅ OTP SMS sent successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Twilio SMS error:", error.message);
    return { success: false, error: error.message };
  }
}

// Generate 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports = {
  sendOTP,
  generateOTP,
};
