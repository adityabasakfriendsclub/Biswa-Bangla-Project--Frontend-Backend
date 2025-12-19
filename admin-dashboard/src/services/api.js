const API_URL = "http://localhost:3000/api/admin";

export const adminAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getStats: async (token) => {
    const response = await fetch(`${API_URL}/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  getUsers: async (token) => {
    const response = await fetch(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};
