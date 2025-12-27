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
      const response = await userAuthAPI.login(formData);

      if (response.success) {
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        alert("✅ Login successful!");
        onLoginSuccess();
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
      console.error("Login error:", err);
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Login</h1>
          <p className="text-gray-600">Welcome Back</p>
          <p className="text-gray-500 text-sm">Log in to continue Talking</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              📱
            </span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔒
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={onNavigateToForgotPassword}
              className="text-sm text-gray-600 hover:text-pink-500"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-300 text-white font-semibold rounded-lg hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SIGNING IN..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          <button
            onClick={onNavigateToSignUp}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign Up
          </button>
        </p>

        <p className="text-center mt-8 text-xs text-gray-400">
          © 2025 Dating App, Find Your Partner
        </p>
      </div>
    </div>
  );
}
