// // server.js - UPDATED VERSION
// const dotenv = require("dotenv");
// dotenv.config({ path: "config/config.env" });

// const express = require("express");
// const colors = require("colors");
// const morgan = require("morgan");
// const cors = require("cors");
// const http = require("http");
// const socketIO = require("socket.io");
// const path = require("path");
// const fs = require("fs");

// const { connectMainDB, connectHostDB } = require("./config/db");
// const { validateTwilioConfig } = require("./utils/twilioService");

// const app = express();
// const server = http.createServer(app);

// // Socket.IO setup
// const io = socketIO(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// // Middleware
// app.use(cors());
// app.use(morgan("dev"));
// app.use(express.json());

// // ✅ Create uploads directories if they don't exist
// const uploadDirs = ["uploads/users", "uploads/hosts"];
// uploadDirs.forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//     console.log(`📁 Created directory: ${dir}`.green);
//   }
// });

// // ✅ Serve static files from uploads directory
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ✅ Initialize databases
// let hostDBConnection;

// const initializeDatabases = async () => {
//   await connectMainDB();
//   hostDBConnection = await connectHostDB();

//   // ⚠️ CRITICAL: Make hostDB available globally
//   app.set("hostDB", hostDBConnection);

//   validateTwilioConfig();
// };

// initializeDatabases();

// // Make io available to routes
// app.set("io", io);

// // ✅ Routes
// app.use("/api/dating/auth", require("./routes/auth"));
// app.use("/api/admin", require("./routes/admin"));
// app.use("/api/hosts", require("./routes/host"));
// app.use("/api/call", require("./routes/call"));
// app.use("/api/wallet", require("./routes/wallet"));
// app.use("/api/report", require("./routes/report"));
// app.use("/api/user", require("./routes/userProfile")); // ✅ NEW ROUTE

// // Test route
// app.get("/", (req, res) => {
//   res.send("✅ Video Calling API Running");
// });

// // Socket.IO Connection
// io.on("connection", (socket) => {
//   console.log(`✅ User connected: ${socket.id}`.cyan);

//   // Host comes online
//   socket.on("host_online", async (data) => {
//     console.log(`🟢 Host ${data.hostId} is online`);
//     try {
//       const hostSchema = require("./models/Host");
//       const Host = hostDBConnection.model("Host", hostSchema);

//       await Host.findByIdAndUpdate(data.hostId, {
//         isOnline: true,
//         status: "online",
//       });

//       io.emit("host_status_change", {
//         hostId: data.hostId,
//         isOnline: true,
//         status: "online",
//       });
//     } catch (error) {
//       console.error("❌ Error updating host status:", error);
//     }
//   });

//   // Host goes offline
//   socket.on("host_offline", async (data) => {
//     console.log(`🔴 Host ${data.hostId} is offline`);
//     try {
//       const hostSchema = require("./models/Host");
//       const Host = hostDBConnection.model("Host", hostSchema);

//       await Host.findByIdAndUpdate(data.hostId, {
//         isOnline: false,
//         status: "offline",
//         lastOnline: new Date(),
//       });

//       io.emit("host_status_change", {
//         hostId: data.hostId,
//         isOnline: false,
//         status: "offline",
//       });
//     } catch (error) {
//       console.error("❌ Error updating host status:", error);
//     }
//   });

//   // Call started
//   socket.on("call_started", async (data) => {
//     console.log(`📞 Call started with host ${data.hostId}`);
//     try {
//       const hostSchema = require("./models/Host");
//       const Host = hostDBConnection.model("Host", hostSchema);

//       await Host.findByIdAndUpdate(data.hostId, {
//         isOnline: true,
//         status: "busy",
//       });

//       io.emit("host_status_change", {
//         hostId: data.hostId,
//         isOnline: true,
//         status: "busy",
//       });
//     } catch (error) {
//       console.error("❌ Error updating host status:", error);
//     }
//   });

//   // Call ended
//   socket.on("call_ended", async (data) => {
//     console.log(`🔴 Call ended with host ${data.hostId}`);
//     try {
//       const hostSchema = require("./models/Host");
//       const Host = hostDBConnection.model("Host", hostSchema);

//       await Host.findByIdAndUpdate(data.hostId, {
//         isOnline: true,
//         status: "online",
//       });

//       io.emit("host_status_change", {
//         hostId: data.hostId,
//         isOnline: true,
//         status: "online",
//       });
//     } catch (error) {
//       console.error("❌ Error updating host status:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`❌ User disconnected: ${socket.id}`.red);
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`.green.bold);
// });

// root
// server.js - FINAL FIXED VERSION

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const fs = require("fs");

const { connectMainDB, connectHostDB } = require("./config/db");
const { validateTwilioConfig } = require("./utils/twilioService");

const app = express();
const server = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = socketIO(server, {
  cors: {
    origin: "*", // ✅ allow prod + local
    methods: ["GET", "POST"],
    credentials: true,
  },
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= UPLOADS PATH (CRITICAL FIX) ================= */
/**
 * IMPORTANT:
 * Files are stored OUTSIDE project folder
 * Same path as Nginx alias
 */
const UPLOAD_ROOT = "/var/www/uploads";
const USER_UPLOAD = path.join(UPLOAD_ROOT, "users");
const HOST_UPLOAD = path.join(UPLOAD_ROOT, "hosts");

// Create directories if not exist
[UPLOAD_ROOT, USER_UPLOAD, HOST_UPLOAD].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`.green);
  }
});

// Serve uploads (for LOCAL testing only)
// In production → Nginx handles /uploads
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(UPLOAD_ROOT));
}

/* ================= DATABASE ================= */
let hostDBConnection;

const initializeDatabases = async () => {
  await connectMainDB();
  hostDBConnection = await connectHostDB();
  app.set("hostDB", hostDBConnection);
  validateTwilioConfig();
};

initializeDatabases();

/* ================= ROUTES ================= */
app.set("io", io);

app.use("/api/dating/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/hosts", require("./routes/host"));
app.use("/api/call", require("./routes/call"));
app.use("/api/wallet", require("./routes/wallet"));
app.use("/api/report", require("./routes/report"));
app.use("/api/user", require("./routes/userProfile"));

app.get("/", (req, res) => {
  res.send("✅ Video Calling API Running");
});

/* ================= SOCKET EVENTS ================= */
io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`.cyan);

  const Host = hostDBConnection?.model("Host", require("./models/Host"));

  socket.on("host_online", async ({ hostId }) => {
    await Host.findByIdAndUpdate(hostId, {
      isOnline: true,
      status: "online",
    });
    io.emit("host_status_change", {
      hostId,
      isOnline: true,
      status: "online",
    });
  });

  socket.on("host_offline", async ({ hostId }) => {
    await Host.findByIdAndUpdate(hostId, {
      isOnline: false,
      status: "offline",
      lastOnline: new Date(),
    });
    io.emit("host_status_change", {
      hostId,
      isOnline: false,
      status: "offline",
    });
  });

  socket.on("call_started", async ({ hostId }) => {
    await Host.findByIdAndUpdate(hostId, {
      status: "busy",
      isOnline: true,
    });
    io.emit("host_status_change", {
      hostId,
      isOnline: true,
      status: "busy",
    });
  });

  socket.on("call_ended", async ({ hostId }) => {
    await Host.findByIdAndUpdate(hostId, {
      status: "online",
      isOnline: true,
    });
    io.emit("host_status_change", {
      hostId,
      isOnline: true,
      status: "online",
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`.red);
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
});
