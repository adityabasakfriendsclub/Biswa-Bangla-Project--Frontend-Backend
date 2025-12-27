const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URI);
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.bold);
  } catch (error) {
    console.log(`MongoDB Error: ${error.message}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
