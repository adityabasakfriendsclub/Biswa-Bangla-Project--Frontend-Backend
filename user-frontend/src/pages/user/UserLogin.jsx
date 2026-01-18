// src/pages/user/UserLogin.jsx
import { useState } from "react";
import { userAuthAPI } from "../../api/userAuth";

export default function UserLogin({
  onLoginSuccess,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onExit,
}) {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      console.log("🔐 Attempting login with:", formData.phone);

      const response = await userAuthAPI.login(formData);
      console.log("📥 Login response:", response);

      if (response.success) {
        // ✅ Save token
        const token = response.data.token;
        localStorage.setItem("userToken", token);
        localStorage.setItem("token", token);

        // ✅ Save user data (complete user object from API)
        const userData = {
          ...response.data.user,
          token: token,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        console.log("✅ Login successful, saved data:", userData);

        alert("✅ Login successful!");

        // ✅ Call parent handler with complete user data
        onLoginSuccess(userData);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      {/* Exit Button */}
      <button
        onClick={onExit}
        className="fixed top-4 left-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all shadow-md flex items-center gap-2 font-medium"
      >
        ← Admin Mode
      </button>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Biswa Bangla Social Networking Club"
            className="w-32 h-32 object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-600">Welcome Back</p>
          <p className="text-gray-500 text-sm">Log in to continue Talking</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              📱
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔒
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-sm text-gray-600 hover:text-pink-500"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-yellow-400 text-white font-bold text-lg rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SIGNING IN..." : "Sign In"}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={onNavigateToSignUp}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign Up
          </button>
        </p>

        {/* Footer */}
        <div className="bg-white px-6 py-4 text-center text-xs text-gray-600 space-y-1">
          <p>© 2026 Biswa Bangla Social Networking Club.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
