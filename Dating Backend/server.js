// STEP 1: LOAD ENV FIRST (VERY IMPORTANT)
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

// STEP 2: NOW IMPORT EVERYTHING ELSE
const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./config/db");
const { validateTwilioConfig } = require("./utils/twilioService");

// STEP 3: APP INIT
const app = express();

// STEP 4: MIDDLEWARE
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// STEP 5: DATABASE + TWILIO
connectDB();
validateTwilioConfig();

// STEP 6: ROUTES
app.use("/api/dating/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));

// STEP 7: TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server running OK");
});

// STEP 8: START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`.green.bold);
});
