// src/pages/user/ForgotPassword.jsx
import { useState } from "react";
import { userAuthAPI } from "../../api/userAuth";

export default function ForgotPassword({
  onBackToLogin,
  onNavigateToVerifyReset,
  onExit,
}) {
  const [formData, setFormData] = useState({
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await userAuthAPI.forgotPassword(
        formData.phone,
        formData.newPassword,
        formData.confirmPassword,
      );

      if (response.success) {
        // ✅ Store phone for OTP verification
        localStorage.setItem("resetPhone", formData.phone);
        console.log("✅ Reset phone stored:", formData.phone);

        alert("✅ OTP sent successfully! Please check your phone.");

        // ✅ Navigate to Verify Reset OTP page
        onNavigateToVerifyReset(formData.phone);
      } else {
        setError(response.message || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4">
      {/* Exit Button */}
      {/* <button
        onClick={onExit}
        className="fixed top-4 left-4 px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-white transition-all shadow-md flex items-center gap-2 font-medium"
      >
        ← Admin Mode
      </button> */}

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Biswa Bangla Social Networking Club"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-500">Reset your password securely</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
          />

          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            required
            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-300 text-white font-semibold rounded-2xl hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING OTP..." : "SEND OTP"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center mt-6 text-gray-600">
          <button
            onClick={onBackToLogin}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            ← Back to Login
          </button>
        </p>

        {/* Footer */}
        <div className="bg-white px-6 py-4 text-center text-xs text-gray-600 space-y-1">
          <p>© 2026 Biswa Bangla Social Networking Services Club.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
