import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import authBg from "../../assets/auth-bg.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:3000/api";

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

    if (!formData.phone || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, send OTP (don't send password yet)
      const response = await fetch(`${API_URL}/host/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("OTP sent to your phone!");
        // Store phone and password for verification page
        localStorage.setItem("verificationPhone", formData.phone);
        localStorage.setItem("resetPassword", formData.password);

        setTimeout(() => {
          navigate("/verify-reset", {
            state: {
              phone: formData.phone,
              newPassword: formData.password,
              type: "reset",
            },
          });
        }, 1000);
      } else {
        setError(data.message || "Request failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        <Link
          to="/login"
          className="flex items-center gap-2 mb-4 text-gray-700 hover:opacity-70"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Login</span>
        </Link>

        <h1 className="text-4xl font-bold text-center text-gray-700 mb-2">
          Forgot Password
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Reset your password securely
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            name="phone"
            placeholder="Phone (10 digits)"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength="10"
            disabled={loading}
            className="w-full h-14 bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          <input
            type="password"
            name="password"
            placeholder="New Password (min 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full h-14 bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full h-14 bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center font-medium">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-yellow-400 text-white text-xl font-semibold rounded-2xl hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "SEND OTP"}
          </button>

          <p className="text-center text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-yellow-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
