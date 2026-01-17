// PURPOSE: Dual-mode login for Admin and Agency

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { adminAPI, agencyAPI } from "../../services/api";
import authBg from "../../assets/auth-bg.png";

const HostLogin = () => {
  const navigate = useNavigate();

  // Login mode: "admin" or "agency"
  const [loginMode, setLoginMode] = useState("admin");

  const [formData, setFormData] = useState({
    username: "", // For admin
    email: "", // For agency
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // Switch login mode
  const switchMode = (mode) => {
    setLoginMode(mode);
    setFormData({ username: "", email: "", password: "" });
    setError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (loginMode === "admin") {
        // Admin Login
        if (!formData.username || !formData.password) {
          setError("Username and password are required");
          setLoading(false);
          return;
        }

        const response = await adminAPI.login({
          username: formData.username,
          password: formData.password,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userType", "admin");
          localStorage.setItem(
            "adminData",
            JSON.stringify(response.data.admin),
          );

          alert(`Welcome back, ${response.data.admin.username}!`);
          navigate("/admin/dashboard");
        }
      } else {
        // Agency Login
        if (!formData.email || !formData.password) {
          setError("Email and password are required");
          setLoading(false);
          return;
        }

        const response = await agencyAPI.login({
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userType", "agency");
          localStorage.setItem(
            "agencyData",
            JSON.stringify(response.data.agency),
          );

          alert(`Welcome back, ${response.data.agency.agencyName}!`);
          navigate("/agency/dashboard");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <img
            src="public/logo-left.png"
            alt="Biswa Bangla Social Networking Club"
            className="w-28 h-28 object-contain"
          />
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => switchMode("admin")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              loginMode === "admin"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            🛡️ Admin
          </button>
          <button
            type="button"
            onClick={() => switchMode("agency")}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              loginMode === "agency"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            🏢 Agency
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            {loginMode === "admin" ? (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {loginMode === "admin" ? "Admin Login" : "Agency Login"}
          </h2>
          <p className="text-gray-600 text-sm">
            {loginMode === "admin"
              ? "System Administrator Access"
              : "Agency Management Portal"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username (Admin) or Email (Agency) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {loginMode === "admin" ? "Username" : "Email Address"}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {loginMode === "admin" ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  )}
                </svg>
              </div>
              <input
                type={loginMode === "admin" ? "text" : "email"}
                name={loginMode === "admin" ? "username" : "email"}
                value={
                  loginMode === "admin" ? formData.username : formData.email
                }
                onChange={handleChange}
                placeholder={
                  loginMode === "admin" ? "Enter username" : "Enter email"
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white py-3.5 rounded-xl font-bold text-lg hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 transition duration-300 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed shadow-xl transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              `Login as ${loginMode === "admin" ? "Admin" : "Agency"}`
            )}
          </button>
        </form>

        {/* Agency Signup Link */}
        {loginMode === "agency" && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an agency account?{" "}
              <Link
                to="/agency/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Register Agency
              </Link>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            End User?{" "}
            <Link
              to="/login"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Host Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HostLogin;
