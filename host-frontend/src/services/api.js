// FILE: frontend/src/services/api.js
// PURPOSE: Updated API service matching new route structure
// LOCATION: frontend/src/services/api.js

import axios from "axios";

const API_URL = "http://localhost:3000/api";

// ==================== AXIOS INSTANCE ====================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ==================== HOST API (End Users) ====================
export const hostAPI = {
  // Host Signup - Send OTP
  signup: (data) => axios.post(`${API_URL}/host/signup`, data),

  // Verify OTP and Complete Registration
  verifySignup: (data) => axios.post(`${API_URL}/host/verify-signup`, data),

  // Host Login
  login: (data) => axios.post(`${API_URL}/host/login`, data),

  // Forgot Password - Send OTP
  forgotPassword: (data) => axios.post(`${API_URL}/host/forgot-password`, data),

  // Verify OTP and Reset Password
  verifyReset: (data) => axios.post(`${API_URL}/host/verify-reset`, data),

  // Resend OTP
  resendOtp: (data) => axios.post(`${API_URL}/host/resend-otp`, data),

  // Get Host Profile
  getProfile: () => api.get("/host/profile"),

  // Update Host Profile
  updateProfile: (data) => api.put("/host/profile", data),

  // Upload Host Profile Picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.post("/host/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Delete Host Profile Picture
  deleteProfilePicture: () => api.delete("/host/delete-profile-picture"),
};

// ==================== AGENCY API ====================
export const agencyAPI = {
  // Agency Signup
  signup: (data) => api.post("/agency/signup", data),

  // Agency Login
  login: (data) => api.post("/agency/login", data),

  // Get Agency Profile
  getProfile: () => api.get("/agency/profile"),

  // Update Agency Profile
  updateProfile: (data) => api.put("/agency/profile", data),

  // Upload Agency Profile Picture
  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.post("/agency/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // Admin Login
  login: (data) => api.post("/host/admin/login", data),

  // Get Dashboard Statistics
  getStats: () => api.get("/host/admin/stats"),

  // Get All Agencies
  getAllAgencies: () => api.get("/host/admin/agencies"),

  // Get All Hosts (Users)
  getAllHosts: () => api.get("/host/admin/users"),
};

// ==================== UPLOAD HELPER ====================
export const uploadHelper = {
  previewImage: (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  validateImage: (file, maxSizeMB = 5) => {
    const errors = [];
    if (!file) {
      errors.push("No file selected");
      return { valid: false, errors };
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      errors.push("Only JPEG, PNG, GIF, and WebP images are allowed");
    }

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${maxSizeMB}MB`);
    }

    return { valid: errors.length === 0, errors };
  },
};

// ==================== AUTH HELPER ====================
export const authHelper = {
  isAuthenticated: () => !!localStorage.getItem("token"),

  getUserType: () => localStorage.getItem("userType"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("userData");
    localStorage.removeItem("agencyData");
    localStorage.removeItem("adminData");
  },

  getUserData: () => {
    const userType = authHelper.getUserType();
    const dataKey = `${userType}Data`;
    const data = localStorage.getItem(dataKey);
    return data ? JSON.parse(data) : null;
  },
};

export default api;
