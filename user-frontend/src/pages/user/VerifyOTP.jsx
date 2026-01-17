// src/pages/user/VerifyOTP.jsx
import { useState, useRef, useEffect } from "react";
import { userAuthAPI } from "../../api/userAuth";

export default function VerifyOTP({ phone, onVerifySuccess, onExit }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await userAuthAPI.verifyOTP(phone, otpString);

      if (response.success) {
        alert("✅ OTP verified successfully!");
        onVerifySuccess();
      } else {
        // Better error messages with debugging info
        const errorMessage = response.message || "Invalid OTP";

        console.log("❌ OTP Verification Failed:");
        console.log("Response:", response);
        console.log("Error message:", errorMessage);

        if (errorMessage.toLowerCase().includes("expired")) {
          setError(
            "⏱️ OTP has expired. Click 'Resend OTP' below to get a new code.",
          );
        } else if (
          errorMessage.toLowerCase().includes("invalid") ||
          errorMessage.toLowerCase().includes("wrong")
        ) {
          setError("❌ Invalid OTP. Please check the code and try again.");
        } else if (errorMessage.toLowerCase().includes("not found")) {
          setError(
            "❌ No OTP found for this phone number. Please register again.",
          );
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;

    setResendLoading(true);
    setError("");

    try {
      const response = await userAuthAPI.resendOTP(phone);

      if (response.success) {
        alert("✅ New OTP sent successfully!");
        setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
        inputRefs.current[0]?.focus(); // Focus first input
        setResendTimer(60); // Reset timer
        setCanResend(false);
      } else {
        setError(response.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Resend OTP error:", err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4">
      {/* Exit Button */}
      <button
        onClick={onExit}
        className="fixed top-4 left-4 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-all shadow-md flex items-center gap-2 font-medium"
      >
        ← Admin Mode
      </button>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-12">
          <img
            src="/logo.png"
            alt="Biswa Bangla Social Networking Club"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Title & Phone Info */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Verify OTP</h1>
          <p className="text-gray-500">Enter the 6-digit code sent to</p>
          <p className="text-gray-700 font-semibold mt-1">📱 {phone}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* OTP Input Grid */}
        <div className="flex justify-center gap-3 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-4 bg-pink-300 text-white font-semibold rounded-2xl hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? "VERIFYING..." : "VERIFY OTP"}
        </button>

        {/* Resend OTP Section */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="text-pink-500 hover:text-pink-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? "Sending..." : "🔄 Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-500">
              Resend OTP in{" "}
              <span className="font-bold text-pink-500">{resendTimer}s</span>
            </p>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⏱️ OTP expires in 10 minutes</p>
          <p className="mt-1">
            Didn't receive? Check your SMS or resend after{" "}
            {resendTimer > 0 ? `${resendTimer}s` : "now"}
          </p>
        </div>
      </div>
    </div>
  );
}
