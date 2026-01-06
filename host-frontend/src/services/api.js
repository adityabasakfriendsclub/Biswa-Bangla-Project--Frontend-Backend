import axios from "axios";

// ==================== GET BASE URL ====================
const getBaseURL = () => {
  const isDev = import.meta.env.DEV;
  const envURL = import.meta.env.VITE_API_URL;

  let baseURL;
  if (isDev) {
    baseURL = envURL || "http://localhost:3001";
  } else {
    baseURL = envURL || "https://biswabanglasocialnetworkingservices.com";
  }

  if (!baseURL.startsWith("http://") && !baseURL.startsWith("https://")) {
    baseURL = "http://localhost:3001";
  }

  return baseURL;
};

const BASE_URL = getBaseURL();
const API_URL = `${BASE_URL}/api`;

export const getServerURL = () => BASE_URL;

// ==================== AXIOS INSTANCE ====================
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
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
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error Response:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ==================== HOST API ====================
export const hostAPI = {
  // ========== AUTH ==========
  signup: (data) => axios.post(`${API_URL}/host/signup`, data),
  verifySignup: (data) => axios.post(`${API_URL}/host/verify-signup`, data),
  login: (data) => axios.post(`${API_URL}/host/login`, data),
  forgotPassword: (data) => axios.post(`${API_URL}/host/forgot-password`, data),
  verifyReset: (data) => axios.post(`${API_URL}/host/verify-reset`, data),
  resendOtp: (data) => axios.post(`${API_URL}/host/resend-otp`, data),

  // ========== PROFILE ==========
  getProfile: () => api.get("/host/profile"),
  updateProfile: (data) => api.put("/host/profile", data),

  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.post("/host/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteProfilePicture: () => api.delete("/host/delete-profile-picture"),

  // ========== ACCOUNT - IMAGES ==========
  uploadImages: (formData) =>
    api.post("/host/account/upload-images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getImages: () => api.get("/host/account/images"),

  // ========== ACCOUNT - VIDEOS ==========
  // ✅ FIXED: Changed endpoint to match backend
  uploadVideo: (formData) => {
    console.log("📤 Uploading video to: /host/account/myvideos");
    return api.post("/host/account/myvideos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // 60 seconds for video upload
    });
  },

  getVideos: () => {
    console.log("📥 Fetching videos from: /host/account/myvideos");
    return api.get("/host/account/myvideos");
  },

  deleteVideo: (videoId) => {
    console.log(
      `🗑️ Deleting video ${videoId} from: /host/account/myvideos/${videoId}`
    );
    return api.delete(`/host/account/myvideos/${videoId}`);
  },

  // ========== ACCOUNT - KYC ==========
  uploadKYC: (formData) =>
    api.post("/host/account/upload-kyc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getKYCStatus: () => api.get("/host/account/kyc"),

  // ========== ACCOUNT - AUDITION ==========
  uploadAuditionVideo: (formData) =>
    api.post("/host/account/upload-audition", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAuditionVideo: () => api.get("/host/account/audition"),

  // ========== ACCOUNT - BANK & WITHDRAWAL ==========
  saveBankDetails: (data) => api.post("/host/account/bank-details", data),
  getBankDetails: () => api.get("/host/account/bank-details"),
  withdrawMoney: (data) => api.post("/host/account/withdraw", data),
  getWithdrawalHistory: () => api.get("/host/account/withdrawals"),

  // ========== HOST HOME ==========
  updateOnlineStatus: (isOnline) =>
    api.put("/host/online-status", { isOnline }),
  getAllHosts: () => api.get("/host/all-hosts"),
  getWalletBalance: () => api.get("/host/wallet"),
};

// ==================== AGENCY API ====================
export const agencyAPI = {
  signup: (data) => api.post("/agency/signup", data),
  login: (data) => api.post("/agency/login", data),
  getProfile: () => api.get("/agency/profile"),
  updateProfile: (data) => api.put("/agency/profile", data),

  uploadProfilePicture: (file) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    return api.post("/agency/upload-profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// ==================== ADMIN API ====================
// export const adminAPI = {
//   login: (data) => api.post("/host/admin/login", data),
//   getStats: () => api.get("/host/admin/stats"),
//   getAllAgencies: () => api.get("/host/admin/agencies"),
//   getAllHosts: () => api.get("/host/admin/users"),
// };
// ==================== ADMIN API ====================
export const adminAPI = {
  login: (data) => api.post("/host/admin/login", data),
  getStats: () => api.get("/admin/stats"),
  getAllHosts: () => api.get("/admin/hosts"),
  searchHosts: (query) => api.get(`/admin/hosts?search=${query}`),
  getHostDetails: (hostId) => api.get(`/admin/hosts/${hostId}`),
  approveKYC: (hostId) => api.post(`/admin/hosts/${hostId}/approve-kyc`),
  rejectKYC: (hostId, reason) =>
    api.post(`/admin/hosts/${hostId}/reject-kyc`, { reason }),
  deleteHost: (hostId) => api.delete(`/admin/hosts/${hostId}`),
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

  validateVideo: (file, maxSizeMB = 50) => {
    const errors = [];
    if (!file) {
      errors.push("No file selected");
      return { valid: false, errors };
    }

    if (!file.type.startsWith("video/")) {
      errors.push("Only video files are allowed");
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
