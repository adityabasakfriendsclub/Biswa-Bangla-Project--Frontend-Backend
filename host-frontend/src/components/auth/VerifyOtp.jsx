import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import authBg from "../../assets/auth-bg.png";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const phone =
    location.state?.phone || localStorage.getItem("verificationPhone");
  const type = location.state?.type || "signup";

  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    if (!phone) navigate("/login");
  }, [phone, navigate]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 4) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use correct endpoint based on type
      const endpoint =
        type === "signup" ? "/host/verify-signup" : "/host/verify-reset";

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otpValue }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Verification successful!");
        localStorage.removeItem("verificationPhone");

        if (type === "signup" && data.token) {
          login(data.token, data.user);
          setTimeout(() => navigate("/dashboard"), 1500);
        } else {
          setTimeout(() => navigate("/login"), 1500);
        }
      } else {
        setError(data.message || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/host/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("OTP resent successfully!");
        setOtp(["", "", "", ""]);
        setTimeout(() => setSuccess(""), 2000);
      } else {
        setError(data.message || "Failed to resend OTP");
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
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center">
        <Link
          to={type === "signup" ? "/signup" : "/forgot-password"}
          className="flex items-center gap-2 mb-4 text-gray-700 hover:opacity-70"
        >
          <ArrowLeft className="w-6 h-6" />
          <span>Back</span>
        </Link>

        <h1 className="text-4xl font-bold text-gray-700 mb-2">Verify OTP</h1>
        <p className="text-gray-600 mb-1">Enter the 4-digit code sent to</p>
        <p className="text-lg font-semibold text-gray-700 mb-6">{phone}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                disabled={loading}
                autoFocus={index === 0}
                className="w-14 h-14 text-center text-2xl bg-white rounded-xl border-2 border-pink-300 outline-none focus:border-pink-400 transition"
              />
            ))}
          </div>

          {error && <p className="text-red-600 font-medium">{error}</p>}
          {success && <p className="text-green-600 font-medium">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-pink-400 text-white text-xl font-semibold rounded-2xl hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "VERIFY OTP"}
          </button>

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={loading}
            className="text-gray-600 font-semibold hover:underline disabled:opacity-50"
          >
            Didn't receive OTP? Resend
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
