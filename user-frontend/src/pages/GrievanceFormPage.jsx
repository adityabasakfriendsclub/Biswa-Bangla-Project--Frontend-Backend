// src/pages/GrievanceFormPage.jsx - FIXED FILE UPLOAD
import { useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";

export default function GrievanceFormPage({ user, onBack }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: user?.phone || "",
    email: "",
    appUserId: user?.id || user?.phone || "",
    complaintTypes: [],
    description: "",
    affirm: false,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const complaintOptions = [
    "Objection to Content",
    "Nudity / Pornography",
    "Judicial Order",
    "Privacy",
    "Impersonation",
  ];

  // ✅ Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("❌ File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "video/mp4",
      "video/mpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("❌ Please upload an image, PDF, or video file");
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
      setFilePreview("📄 PDF");
    } else if (file.type.startsWith("video/")) {
      setFilePreview("🎥 Video");
    }
  };

  // ✅ Remove File
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    // Reset file input
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  };

  const handleCheckbox = (value) => {
    setFormData((prev) => ({
      ...prev,
      complaintTypes: prev.complaintTypes.includes(value)
        ? prev.complaintTypes.filter((t) => t !== value)
        : [...prev.complaintTypes, value],
    }));
  };

  // ✅ Submit with File Upload
  const handleSubmit = async () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.appUserId ||
      formData.complaintTypes.length === 0 ||
      !formData.description ||
      !formData.affirm
    ) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    if (!selectedFile) {
      alert("⚠️ Please upload evidence file");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("appUserId", formData.appUserId);
      submitData.append("types", JSON.stringify(formData.complaintTypes));
      submitData.append("description", formData.description);
      submitData.append("evidenceFile", selectedFile);

      const response = await fetch(`${API_BASE_URL}/report/submit`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - browser will set it with boundary
        },
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Report submitted successfully!");
        onBack?.();
      } else {
        alert(data.message || "Failed to submit report");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error submitting report");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const isValid =
    formData.firstName &&
    formData.lastName &&
    formData.phone &&
    formData.email &&
    formData.appUserId &&
    formData.complaintTypes.length > 0 &&
    formData.description &&
    formData.affirm &&
    selectedFile;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white pb-32">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-6 flex items-center sticky top-0 z-10 shadow-md">
        <button
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-white flex-1 ml-4">
          Report / Grievance
        </h1>
      </div>

      {/* Logo */}
      <div className="bg-white p-6 flex justify-center border-b border-gray-200">
        <img src="/logo.png" alt="BBSNC Logo" className="h-32 w-32" />
      </div>

      {/* Title */}
      <div className="px-6 py-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Grievance Form</h2>
        <p className="text-sm text-gray-600 mt-2">
          Please fill out all required fields (*)
        </p>
      </div>

      {/* Form */}
      <div className="px-6 space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            What is your name? *
          </label>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 focus:outline-none focus:border-purple-400"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            What is your registered contact number? *
          </label>
          <input
            type="tel"
            placeholder="+91"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            What is your email address? *
          </label>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* App User ID */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            App User ID *
          </label>
          <input
            type="text"
            placeholder="Enter App User ID"
            value={formData.appUserId}
            onChange={(e) =>
              setFormData({ ...formData, appUserId: e.target.value })
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Complaint Types */}
        <div>
          <label className="block text-gray-800 font-semibold mb-3">
            What is the nature of your complaint? *
          </label>
          <div className="space-y-3">
            {complaintOptions.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.complaintTypes.includes(option)}
                    onChange={() => handleCheckbox(option)}
                    className="w-6 h-6 border-2 border-gray-400 rounded appearance-none checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
                  />
                  {formData.complaintTypes.includes(option) && (
                    <svg
                      className="absolute top-0 left-0 w-6 h-6 text-white pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-gray-800 text-lg">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            Describe the nature of your complaint and what action you want us to
            take *
          </label>
          <textarea
            placeholder="Describe here"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={6}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-400 resize-none"
          />
        </div>

        {/* ✅ FILE UPLOAD - FIXED */}
        <div>
          <label className="block text-gray-800 font-semibold mb-2">
            Provide the necessary evidence *
          </label>

          {/* File Input (Hidden) */}
          <input
            type="file"
            id="file-upload"
            accept="image/*,application/pdf,video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Upload Button */}
          {!selectedFile && (
            <label
              htmlFor="file-upload"
              className="inline-block bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold px-8 py-3 rounded-lg hover:from-pink-500 hover:to-pink-600 cursor-pointer transition-all"
            >
              📁 Upload File
            </label>
          )}

          {/* File Preview */}
          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700">
                  Selected File:
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 font-semibold text-sm"
                >
                  ✕ Remove
                </button>
              </div>

              {/* Image Preview */}
              {filePreview &&
                typeof filePreview === "string" &&
                filePreview.startsWith("data:image") && (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg mb-3"
                  />
                )}

              {/* File Info */}
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Size:</span>{" "}
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Type:</span>{" "}
                  {selectedFile.type}
                </p>
              </div>

              {/* Upload Progress Bar */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="text-gray-600 mt-2 text-sm">
            Accepted: Images (JPG, PNG, GIF), PDF, Videos (MP4) - Max 10MB
          </p>
        </div>

        {/* Affirmation */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="relative mt-1">
              <input
                type="checkbox"
                checked={formData.affirm}
                onChange={(e) =>
                  setFormData({ ...formData, affirm: e.target.checked })
                }
                className="w-6 h-6 border-2 border-gray-400 rounded appearance-none checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
              />
              {formData.affirm && (
                <svg
                  className="absolute top-0 left-0 w-6 h-6 text-white pointer-events-none"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-gray-700">
              I affirm that this information is authentic. I understand that
              this grievance may be rejected if any information is incomplete or
              false.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className={`w-full py-4 rounded-full font-bold text-lg transition-all ${
            isValid && !submitting
              ? "bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
        <p>© 2026 Biswa Bangla Social Networking Club.</p>
      </div>
    </div>
  );
}
