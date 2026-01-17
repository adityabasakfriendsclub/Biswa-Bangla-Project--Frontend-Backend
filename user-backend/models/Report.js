// const mongoose = require("mongoose");

// const reportSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     name: {
//       type: String,
//       required: true,
//     },
//     phone: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//     },
//     appUserId: {
//       type: String,
//     },
//     complaintTypes: {
//       type: [String],
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     evidenceFile: {
//       type: String,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "reviewed", "resolved", "rejected"],
//       default: "pending",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Report", reportSchema);

// new2
// models/Report.js - UPDATED WITH NEW FIELDS
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    appUserId: {
      type: String,
      required: true,
    },
    complaintTypes: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    evidenceFile: {
      type: String, // Path to uploaded file
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "rejected"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
