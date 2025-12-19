const mongoose = require("mongoose");
const Admin = require("../models/Admin");
require("dotenv").config({ path: "./config/config.env" });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("✅ Connected to MongoDB");

    // Delete existing admin if any
    await Admin.deleteMany({ email: "admin@dating.com" });
    console.log("🗑️  Cleared existing admin");

    // Create new admin
    const admin = await Admin.create({
      name: "Super Admin",
      email: "admin@dating.com",
      password: "Admin@123",
      role: "superadmin",
      isActive: true,
    });

    console.log("\n🎉 Admin created successfully!");
    console.log("=====================================");
    console.log("Email:    admin@dating.com");
    console.log("Password: Admin@123");
    console.log("=====================================");
    console.log("Admin ID:", admin._id);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
