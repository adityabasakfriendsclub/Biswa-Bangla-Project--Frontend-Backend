// PURPOSE: Host (End User) login page

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { hostAPI } from "../../services/api";
import authBg from "../../assets/auth-bg.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.phone || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await hostAPI.login(formData);

      if (response.data.success) {
        setSuccess("Login successful!");
        login(response.data.token, response.data.user);
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat px-4"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Host Login
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Welcome back! Please login to your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone */}
          <div className="flex items-center gap-3 bg-pink-100 border-2 border-pink-300 rounded-2xl p-4">
            <Phone className="w-6 h-6 text-gray-600" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              maxLength="10"
              disabled={loading}
              className="bg-transparent flex-1 outline-none text-lg"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-pink-100 border-2 border-pink-300 rounded-2xl p-4">
            <Lock className="w-6 h-6 text-gray-600" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              className="bg-transparent flex-1 outline-none text-lg"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Messages */}
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center font-medium">{success}</p>
          )}

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-gray-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-xl font-semibold py-4 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Signup */}
          <p className="text-center text-gray-700 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-pink-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>

        {/* Admin/Agency Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Admin or Agency?{" "}
            <Link
              to="/host-login"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Login Here
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Dating App. Find Your Partner.
        </p>
      </div>
    </div>
  );
};

export default Login;
