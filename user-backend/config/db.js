// config/db.js - Already correct ✅
const mongoose = require("mongoose");

// Main Database Connection (Users, Transactions, etc.)
const connectMainDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URI);
    console.log(`✅ Main DB connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(`❌ Main DB Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Host Database Connection (Separate connection)
const connectHostDB = async () => {
  try {
    const hostConn = await mongoose.createConnection(process.env.HOST_DB_URI);
    console.log(`✅ Host DB connected: ${hostConn.host}`.green.bold);
    return hostConn; // ⚠️ IMPORTANT: Return connection
  } catch (error) {
    console.log(`❌ Host DB Error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = { connectMainDB, connectHostDB };
