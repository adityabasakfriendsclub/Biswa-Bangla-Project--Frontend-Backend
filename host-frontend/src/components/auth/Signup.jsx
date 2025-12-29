// PURPOSE: Host (End User) registration page with DOB, Host Premium, and Inter-Agency Code

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
    dateOfBirth: "",
    agencyCode: "",
    password: "",
    confirmPassword: "",
    gender: "",
    isHost: false,
    isHostPremium: false,
    interAgencyCode: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // If user unchecks "Is Host", reset host-related fields
      if (name === "isHost" && !checked) {
        newData.isHostPremium = false;
        newData.interAgencyCode = "";
      }

      // If user unchecks "Host Premium", reset inter-agency code
      if (name === "isHostPremium" && !checked) {
        newData.interAgencyCode = "";
      }

      return newData;
    });

    setError("");
  };

  // Calculate age from date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.dateOfBirth ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.gender
    ) {
      setError("Please fill in all required fields");
      return;
    }

    // Age validation (18+)
    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      setError("You must be at least 18 years old to sign up");
      return;
    }

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Host Premium validation
    if (formData.isHostPremium && !formData.interAgencyCode) {
      setError("Inter-Agency Code is required for Premium Hosts");
      return;
    }

    if (formData.interAgencyCode && formData.interAgencyCode.length < 6) {
      setError("Inter-Agency Code must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const signupData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        password: formData.password,
        gender: formData.gender,
        isHost: formData.isHost,
        isHostPremium: formData.isHostPremium,
        agencyCode: formData.agencyCode || undefined,
        interAgencyCode: formData.interAgencyCode || undefined,
      };

      const response = await hostAPI.signup(signupData);

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
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl my-8">
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

          {/* Date of Birth */}
          <div>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={loading}
              max={
                new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]
              }
              className="w-full bg-white rounded-2xl p-4 border-2 border-yellow-400 outline-none focus:border-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1 ml-2">
              Enter your Date of Birth and You must be 18+ years old
            </p>
          </div>

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

          {/* Is Host Checkbox */}
          <div className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-300">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isHost"
                checked={formData.isHost}
                onChange={handleInputChange}
                disabled={loading}
                className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-500"
              />
              <span className="font-semibold text-gray-700">
                Are you want a Premium Host?
              </span>
            </label>
          </div>

          {/* Host Premium Section - Only show if isHost is true */}
          {formData.isHost && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border-2 border-yellow-400 space-y-4">
              {/* Host Premium Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isHostPremium"
                  checked={formData.isHostPremium}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-500"
                />
                <span className="font-semibold text-gray-700">
                  Upgrade to Premium Host 👑
                </span>
              </label>

              {/* Inter-Agency Code - Only show if isHostPremium is true */}
              {formData.isHostPremium && (
                <div>
                  <input
                    type="text"
                    name="interAgencyCode"
                    placeholder="Inter-Agency Code (Required)"
                    value={formData.interAgencyCode}
                    onChange={handleInputChange}
                    disabled={loading}
                    minLength="6"
                    className="w-full bg-white rounded-xl p-3 border-2 border-orange-400 outline-none focus:border-orange-500"
                  />
                  <p className="text-xs text-gray-600 mt-1 ml-2">
                    ⚠️ Minimum 6 characters. Cannot be changed after signup.
                  </p>
                </div>
              )}
            </div>
          )}

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
