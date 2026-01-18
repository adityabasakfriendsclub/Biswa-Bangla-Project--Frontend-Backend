// src/pages/user/SignUp.jsx
import { useState } from "react";
import { userAuthAPI } from "../../api/userAuth";

export default function SignUp({ onSignUpSuccess, onNavigateToLogin, onExit }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    password: "",
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

  const handleGenderChange = (gender) => {
    setFormData({ ...formData, gender });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.gender) {
      setError("Please select a gender");
      setLoading(false);
      return;
    }

    try {
      const response = await userAuthAPI.register(formData);

      if (response.success) {
        // ✅ Store phone in localStorage for OTP verification
        localStorage.setItem("tempPhone", formData.phone);
        alert("✅ Registration successful! Please verify your OTP.");
        onSignUpSuccess(formData.phone);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please check if the server is running.");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4 py-8">
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
            className="w-36 h-36 object-contain"
          />
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500">Sign up to find your date</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
              className="px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
              className="px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
            />
          </div>

          {/* Phone Input */}
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
          />

          {/* Gender Selection */}
          <div className="flex gap-4 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "Male"}
                onChange={() => handleGenderChange("Male")}
                className="w-5 h-5 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "Female"}
                onChange={() => handleGenderChange("Female")}
                className="w-5 h-5 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">Female</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                checked={formData.gender === "Others"}
                onChange={() => handleGenderChange("Others")}
                className="w-5 h-5 text-pink-500 focus:ring-pink-500"
              />
              <span className="text-gray-700">Others</span>
            </label>
          </div>

          {/* Password Inputs */}
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter Password"
            required
            className="w-full px-4 py-3 bg-white border-2 border-pink-200 rounded-2xl focus:outline-none focus:border-pink-400 transition-colors placeholder-gray-400"
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pink-300 text-white font-semibold rounded-2xl hover:bg-pink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SIGNING UP..." : "SIGN UP"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-pink-500 hover:text-pink-600 font-medium"
          >
            Sign In
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
