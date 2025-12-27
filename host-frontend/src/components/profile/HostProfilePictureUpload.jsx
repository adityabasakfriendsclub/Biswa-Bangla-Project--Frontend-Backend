// FILE: frontend/src/components/profile/HostProfilePictureUpload.jsx
// PURPOSE: Component for uploading host profile pictures
// ACTION: CREATE NEW FILE in frontend/src/components/profile/ folder
//
// Features:
// - Image preview before upload
// - File validation (type and size)
// - Upload progress indication
// - Error handling

import React, { useState, useRef } from "react";
import { hostAPI, uploadHelper } from "../../services/api";

const HostProfilePictureUpload = ({ currentImage, onUploadSuccess }) => {
  // State Management
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");

    // Validate file
    const validation = uploadHelper.validateImage(file, 5);
    if (!validation.valid) {
      setError(validation.errors.join(", "));
      return;
    }

    try {
      // Show preview
      const previewUrl = await uploadHelper.previewImage(file);
      setPreview(previewUrl);

      // Upload to server
      setUploading(true);
      const response = await hostAPI.uploadProfilePicture(file);

      if (response.data.success) {
        setSuccess("Profile picture uploaded successfully!");
        console.log("✅ Upload successful:", response.data.imageUrl);

        // Call parent callback if provided
        if (onUploadSuccess) {
          onUploadSuccess(response.data.imageUrl);
        }

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError(err.response?.data?.message || "Upload failed");
      setPreview(currentImage); // Revert to old image
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Remove current image
  const handleRemoveImage = () => {
    setPreview(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      {/* Image Preview */}
      <div className="relative group">
        {preview ? (
          <>
            <img
              src={
                preview.startsWith("/")
                  ? `http://localhost:3000${preview}`
                  : preview
              }
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover border-4 border-gray-300 shadow-lg"
            />
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                title="Remove image"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center border-4 border-gray-300 shadow-lg">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}

        {/* Upload Button Overlay */}
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="absolute bottom-2 right-2 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-110"
          title="Upload new image"
        >
          {uploading ? (
            <svg
              className="animate-spin w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm w-full max-w-md text-center shadow-sm">
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm w-full max-w-md text-center shadow-sm">
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="text-center space-y-2 max-w-md">
        <p className="text-sm text-gray-600 font-medium">
          Click the button to {preview ? "change" : "upload"} your profile
          picture
        </p>
        <div className="text-xs text-gray-500 space-y-1">
          <p>✓ Accepted formats: JPEG, PNG, GIF, WebP</p>
          <p>✓ Maximum file size: 5MB</p>
          <p>✓ Recommended: Square image (1:1 ratio)</p>
        </div>
      </div>

      {/* Upload Button (Alternative) */}
      {!preview && (
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-lg"
        >
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
      )}
    </div>
  );
};

export default HostProfilePictureUpload;

// ==================== USAGE EXAMPLE ====================
//
// In your HostProfile.jsx component:
//
// import HostProfilePictureUpload from "./components/profile/HostProfilePictureUpload";
//
// function HostProfile() {
//   const [host, setHost] = useState(null);
//
//   const handleUploadSuccess = (imageUrl) => {
//     console.log("New image URL:", imageUrl);
//     // Update host state with new image
//     setHost({ ...host, profilePicture: imageUrl });
//   };
//
//   return (
//     <div>
//       <HostProfilePictureUpload
//         currentImage={host?.profilePicture}
//         onUploadSuccess={handleUploadSuccess}
//       />
//     </div>
//   );
// }
//
// ==================== PROPS ====================
//
// currentImage (string, optional):
//   - Current profile picture URL
//   - Example: "/uploads/profile-123456789.jpg"
//
// onUploadSuccess (function, optional):
//   - Callback function called after successful upload
//   - Receives the new image URL as parameter
//   - Example: (imageUrl) => console.log(imageUrl)
