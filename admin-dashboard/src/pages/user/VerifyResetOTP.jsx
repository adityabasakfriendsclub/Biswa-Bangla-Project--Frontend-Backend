import { useState, useRef, useEffect } from "react";
import { userAuthAPI } from "../../api/userAuth";

export default function VerifyResetOTP({
  phone,
  onVerifySuccess,
  onBackToForgot,
  onExit,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef([]);

  // Get phone from props OR localStorage
  const userPhone = phone || localStorage.getItem("resetPhone");

  console.log("🔐 VerifyResetOTP Component:");
  console.log("  Phone from props:", phone);
  console.log("  Phone from localStorage:", localStorage.getItem("resetPhone"));
  console.log("  Using phone:", userPhone);

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

    console.log("🔍 Verifying Reset OTP:");
    console.log("  Phone:", userPhone);
    console.log("  OTP:", otpString);

    if (!userPhone) {
      setError("❌ Phone number missing. Please try again.");
      return;
    }

    if (otpString.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await userAuthAPI.verifyResetOTP(userPhone, otpString);

      console.log("📥 Verify Reset OTP Response:", response);

      if (response.success) {
        // Clear temp phone after successful verification
        localStorage.removeItem("resetPhone");
        alert(
          "✅ Password reset successful! You can now login with your new password."
        );
        onVerifySuccess();
      } else {
        const errorMessage = response.message || "Invalid OTP";

        console.log("❌ OTP Verification Failed:", response);

        if (errorMessage.toLowerCase().includes("expired")) {
          setError("⏱️ OTP has expired. Please request a new password reset.");
        } else if (
          errorMessage.toLowerCase().includes("invalid") ||
          errorMessage.toLowerCase().includes("wrong")
        ) {
          setError("❌ Invalid OTP. Please check the code and try again.");
        } else {
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("Reset OTP verification error:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Verify OTP</h1>
          <p className="text-gray-500">Enter the 6-digit code sent to</p>
          <p className="text-gray-700 font-semibold mt-1">
            📱 {userPhone || "Phone number missing"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Password Reset Verification
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

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

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-4 bg-pink-300 text-white font-semibold rounded-2xl hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? "VERIFYING..." : "VERIFY & RESET PASSWORD"}
        </button>

        <div className="text-center">
          <button
            onClick={onBackToForgot}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            ← Back to Forgot Password
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⏱️ OTP expires in 10 minutes</p>
          <p className="mt-1">Didn't receive? Go back and request again</p>
        </div>
      </div>
    </div>
  );
}
