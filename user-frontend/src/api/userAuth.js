const USER_API_URL = "http://localhost:3000/api/dating/auth";

export const userAuthAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${USER_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Verify OTP - Using phone number (Signup)
  verifyOTP: async (phone, otp) => {
    const response = await fetch(`${USER_API_URL}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    return response.json();
  },

  // Resend OTP - Using phone number
  resendOTP: async (phone) => {
    const response = await fetch(`${USER_API_URL}/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    return response.json();
  },

  // Login
  login: async (credentials) => {
    const response = await fetch(`${USER_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Forgot Password - Send OTP
  forgotPassword: async (phone, newPassword, confirmPassword) => {
    const response = await fetch(`${USER_API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, newPassword, confirmPassword }),
    });
    return response.json();
  },

  // ✅ ONLY NEW FUNCTION ADDED (RESET OTP VERIFY)
  verifyResetOTP: async (phone, otp) => {
    const response = await fetch(`${USER_API_URL}/verify-reset-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    return response.json();
  },
};
