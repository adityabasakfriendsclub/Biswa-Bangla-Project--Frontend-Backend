const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config({ path: "./config/config.env" });

const testUsers = [
  {
    firstName: "John",
    lastName: "Doe",
    phone: "9876543210",
    gender: "Male",
    password: "Test@123",
    isVerified: true,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    phone: "9876543211",
    gender: "Female",
    password: "Test@123",
    isVerified: true,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    phone: "9876543212",
    gender: "Female",
    password: "Test@123",
    isVerified: false,
  },
  {
    firstName: "Bob",
    lastName: "Williams",
    phone: "9876543213",
    gender: "Male",
    password: "Test@123",
    isVerified: true,
  },
  {
    firstName: "Charlie",
    lastName: "Brown",
    phone: "9876543214",
    gender: "Male",
    password: "Test@123",
    isVerified: false,
  },
  {
    firstName: "Diana",
    lastName: "Davis",
    phone: "9876543215",
    gender: "Female",
    password: "Test@123",
    isVerified: true,
  },
  {
    firstName: "Eve",
    lastName: "Miller",
    phone: "9876543216",
    gender: "Female",
    password: "Test@123",
    isVerified: true,
  },
  {
    firstName: "Frank",
    lastName: "Wilson",
    phone: "9876543217",
    gender: "Male",
    password: "Test@123",
    isVerified: false,
  },
  {
    firstName: "Grace",
    lastName: "Moore",
    phone: "9876543218",
    gender: "Female",
    password: "Test@123",
    isVerified: true,
  },
  {
    firstName: "Henry",
    lastName: "Taylor",
    phone: "9876543219",
    gender: "Male",
    password: "Test@123",
    isVerified: true,
  },
];

const createTestUsers = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing test users
    await User.deleteMany({ phone: { $in: testUsers.map((u) => u.phone) } });
    console.log("🗑️  Cleared existing test users");

    // Create test users
    const created = await User.insertMany(testUsers);
    console.log(`✅ Created ${created.length} test users`);

    console.log("\n📊 Test Users Summary:");
    console.log("- Total Users:", created.length);
    console.log("- Verified:", created.filter((u) => u.isVerified).length);
    console.log("- Unverified:", created.filter((u) => !u.isVerified).length);
    console.log("- Male:", created.filter((u) => u.gender === "Male").length);
    console.log(
      "- Female:",
      created.filter((u) => u.gender === "Female").length
    );

    console.log("\n🎉 Test data created successfully!");
    console.log("You can now login to the admin dashboard and see data.");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createTestUsers();
