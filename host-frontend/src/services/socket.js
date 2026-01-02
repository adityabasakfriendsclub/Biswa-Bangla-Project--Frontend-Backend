// // FILE: frontend/src/services/socket.js
// // ✅ FIXED: Proper environment variable handling for Socket.io

// import { io } from "socket.io-client";

// // ==================== GET SOCKET URL ====================
// const getSocketURL = () => {
//   const isDev = import.meta.env.DEV;
//   const envURL =
//     import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

//   if (isDev) {
//     const socketURL = envURL || "http://localhost:3000";
//     console.log("🔌 [DEV MODE] Socket URL:", socketURL);
//     return socketURL;
//   }

//   const socketURL = envURL || "https://biswabanglasocialnetworkingservices.com";
//   console.log("🔌 [PROD MODE] Socket URL:", socketURL);
//   return socketURL;
// };

// const SOCKET_URL = getSocketURL();

// let socket = null;

// // ==================== CONNECT TO SOCKET ====================
// export const connectSocket = (userId) => {
//   if (socket?.connected) {
//     console.log("✅ Socket already connected");
//     return socket;
//   }

//   console.log("🔌 Connecting to socket server:", SOCKET_URL);

//   socket = io(SOCKET_URL, {
//     auth: {
//       token: localStorage.getItem("token"),
//       userId: userId,
//     },
//     transports: ["websocket", "polling"],
//     reconnection: true,
//     reconnectionDelay: 1000,
//     reconnectionAttempts: 5,
//     timeout: 10000,
//   });

//   socket.on("connect", () => {
//     console.log("✅ Socket connected:", socket.id);
//   });

//   socket.on("disconnect", (reason) => {
//     console.log("❌ Socket disconnected:", reason);
//   });

//   socket.on("connect_error", (error) => {
//     console.error("❌ Socket connection error:", error.message);
//   });

//   socket.on("reconnect_attempt", (attemptNumber) => {
//     console.log(`🔄 Socket reconnection attempt ${attemptNumber}...`);
//   });

//   socket.on("reconnect", (attemptNumber) => {
//     console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
//   });

//   return socket;
// };

// // ==================== DISCONNECT FROM SOCKET ====================
// export const disconnectSocket = () => {
//   if (socket?.connected) {
//     socket.disconnect();
//     socket = null;
//     console.log("🔌 Socket disconnected");
//   }
// };

// // ==================== GET SOCKET INSTANCE ====================
// export const getSocket = () => {
//   if (!socket) {
//     console.warn("⚠️ Socket not initialized");
//   }
//   return socket;
// };

// export { socket };

// new2
// FILE: frontend/src/services/socket.js
// ✅ FIXED: Initialize socket immediately to prevent null errors

import { io } from "socket.io-client";

// ==================== GET SOCKET URL ====================
const getSocketURL = () => {
  const isDev = import.meta.env.DEV;
  const envURL =
    import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

  if (isDev) {
    const socketURL = envURL || "http://localhost:3000";
    console.log("🔌 [DEV MODE] Socket URL:", socketURL);
    return socketURL;
  }

  const socketURL = envURL || "https://biswabanglasocialnetworkingservices.com";
  console.log("🔌 [PROD MODE] Socket URL:", socketURL);
  return socketURL;
};

const SOCKET_URL = getSocketURL();

// ✅ FIX: Initialize socket immediately with autoConnect: false
let socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect immediately
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 10000,
});

// Setup connection event listeners
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Socket reconnection attempt ${attemptNumber}...`);
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
});

// ==================== CONNECT TO SOCKET ====================
export const connectSocket = (userId) => {
  if (socket.connected) {
    console.log("✅ Socket already connected");
    return socket;
  }

  console.log("🔌 Connecting to socket server:", SOCKET_URL);

  // Update auth data
  socket.auth = {
    token: localStorage.getItem("token"),
    userId: userId,
  };

  // Connect
  socket.connect();

  return socket;
};

// ==================== DISCONNECT FROM SOCKET ====================
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔌 Socket disconnected");
  }
};

// ==================== GET SOCKET INSTANCE ====================
export const getSocket = () => {
  return socket;
};

// ✅ Export socket directly (it's now always defined)
export { socket };
