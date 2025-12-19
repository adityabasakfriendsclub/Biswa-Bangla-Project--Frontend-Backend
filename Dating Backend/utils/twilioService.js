const twilio = require("twilio");

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Validate Twilio configuration
exports.validateTwilioConfig = () => {
  console.log("🔍 Checking Twilio Configuration...");
  console.log("TWILIO_ACCOUNT_SID:", accountSid ? "✅ Set" : "❌ Missing");
  console.log("TWILIO_AUTH_TOKEN:", authToken ? "✅ Set" : "❌ Missing");
  console.log("TWILIO_PHONE_NUMBER:", twilioPhoneNumber || "❌ Missing");

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error("❌ Twilio configuration is incomplete!");
    return false;
  }

  console.log("✅ Twilio configuration is valid");
  return true;
};

// Initialize Twilio client
let client = null;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

/**
 * Format phone number to E.164 format for Twilio
 * @param {string} phone - Phone number (can be 10 digits or with country code)
 * @returns {string} - Formatted phone number with country code
 */
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, "");

  // If it's a 10-digit Indian number, add +91
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return `+91${cleaned}`;
  }

  // If it starts with 91 and has 12 digits total, add +
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+${cleaned}`;
  }

  // If it already has +, return as is
  if (phone.startsWith("+")) {
    return phone;
  }

  // Default: assume it needs +91
  return `+91${cleaned}`;
};

/**
 * Send OTP via SMS
 * @param {string} phone - Recipient phone number
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<boolean>} - Success status
 */
exports.sendOtpSms = async (phone, otp) => {
  if (!client) {
    console.log("📵 Twilio not configured. OTP (DEV MODE):", otp);
    return true; // Allow development without Twilio
  }

  try {
    const formattedPhone = formatPhoneNumber(phone);
    console.log(`📱 Sending OTP to: ${formattedPhone}`);

    const message = await client.messages.create({
      body: `Your Dating App verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`✅ SMS sent successfully! SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("❌ Twilio SMS Error:", error.message);
    console.error("Error Code:", error.code);
    console.error("Phone attempted:", phone);
    return false;
  }
};

/**
 * Send Password Reset OTP via SMS
 * @param {string} phone - Recipient phone number
 * @param {string} otp - 6-digit OTP
 * @returns {Promise<boolean>} - Success status
 */
exports.sendPasswordResetOtp = async (phone, otp) => {
  if (!client) {
    console.log("📵 Twilio not configured. Reset OTP (DEV MODE):", otp);
    return true;
  }

  try {
    const formattedPhone = formatPhoneNumber(phone);
    console.log(`📱 Sending Password Reset OTP to: ${formattedPhone}`);

    const message = await client.messages.create({
      body: `Your Dating App password reset code is: ${otp}. Valid for 5 minutes. If you didn't request this, please ignore.`,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`✅ Password Reset SMS sent! SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("❌ Twilio Password Reset Error:", error.message);
    console.error("Error Code:", error.code);
    console.error("Phone attempted:", phone);
    return false;
  }
};
