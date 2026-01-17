// src/services/api.js

// ==================== BASE URL ====================
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const ADMIN_API_URL = `${API_BASE_URL}/admin`;

// ==================== TOKEN HELPER ====================
const getToken = () => localStorage.getItem("token");

// ==================== COMMON RESPONSE HANDLER ====================
const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }
  return data;
};

// ==================== USER API ====================
export const api = {
  // ---------- GET ----------
  get: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(res);
  },

  // ---------- POST ----------
  post: async (endpoint, data = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ---------- PUT ----------
  put: async (endpoint, data = {}) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // ---------- DELETE ----------
  delete: async (endpoint) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json",
      },
    });
    return handleResponse(res);
  },
};

// ==================== ADMIN API ====================
export const adminAPI = {
  // ---------- ADMIN LOGIN ----------
  login: async (credentials) => {
    const res = await fetch(`${ADMIN_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  // ---------- DASHBOARD STATS ----------
  getStats: async () => {
    const res = await fetch(`${ADMIN_API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  },

  // ---------- USERS LIST ----------
  getUsers: async () => {
    const res = await fetch(`${ADMIN_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(res);
  },
};

// ==================== DEFAULT EXPORT ====================
export default api;
