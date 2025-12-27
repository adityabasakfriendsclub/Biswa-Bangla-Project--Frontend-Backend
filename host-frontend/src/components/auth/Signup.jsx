// PURPOSE: Host (End User) registration page

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { hostAPI } from "../../services/api";
import authBg from "../../assets/auth-bg.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    agencyCode: "",
    password: "",
    confirmPassword: "",
    gender: "",
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

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.gender
    ) {
      setError("Please fill in all required fields");
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
      const response = await hostAPI.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender,
        agencyCode: formData.agencyCode || undefined,
      });

      if (response.data.success) {
        setSuccess("OTP sent to your phone!");
        localStorage.setItem("verificationPhone", formData.phone);
        setTimeout(() => {
          navigate("/verify-otp", {
            state: { phone: formData.phone, type: "signup" },
          });
        }, 1000);
      } else {
        setError(response.data.message || "Signup failed");
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
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
        {/* Back Button */}
        <Link
          to="/login"
          className="flex items-center gap-2 mb-4 text-gray-700 hover:opacity-70"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back to Login</span>
        </Link>

        <h1 className="text-4xl font-bold text-center text-gray-700 mb-2">
          Sign Up
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Join us to find your partner
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={loading}
              className="bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={loading}
              className="bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
            />
          </div>

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            placeholder="Phone (10 digits)"
            value={formData.phone}
            onChange={handleInputChange}
            maxLength="10"
            disabled={loading}
            className="w-full bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          {/* Agency Code */}
          <input
            type="text"
            name="agencyCode"
            placeholder="Agency Code (Optional)"
            value={formData.agencyCode}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          {/* Gender */}
          <div className="flex gap-6 justify-center">
            {["male", "female", "others"].map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-5 h-5"
                />
                <span className="capitalize">{g}</span>
              </label>
            ))}
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
          />

          {/* Messages */}
          {error && (
            <p className="text-red-600 text-center font-medium">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-center font-medium">{success}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-white text-xl font-semibold py-4 rounded-2xl hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Signing Up..." : "SIGN UP"}
          </button>

          {/* Login */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}
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

export default Signup;
