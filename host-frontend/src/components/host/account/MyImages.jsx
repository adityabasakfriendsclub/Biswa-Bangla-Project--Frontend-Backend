// FILE: frontend/src/components/host/account/MyImages.jsx
// ✅ FIXED: Proper multipart upload with FormData

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { hostAPI } from "../../../services/api";

const MyImages = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([null, null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null, null]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await hostAPI.getImages();
      if (response.data.success && response.data.images) {
        const loadedImages = response.data.images;
        const newPreviews = [...previews];

        loadedImages.forEach((imgUrl, index) => {
          if (index < 5) {
            // ✅ FIX: Use proper base URL
            const baseURL =
              import.meta.env.VITE_API_URL ||
              "https://biswabanglasocialnetworkingservices.com";
            newPreviews[index] = `${baseURL}${imgUrl}`;
          }
        });

        setPreviews(newPreviews);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
      setError("Failed to load existing images");
    }
  };

  const handleImageSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are allowed");
      return;
    }

    // ✅ Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    // Update images array
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const newPreviews = [...previews];
      newPreviews[index] = e.target.result;
      setPreviews(newPreviews);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const newPreviews = [...previews];

    newImages[index] = null;
    newPreviews[index] = null;

    setImages(newImages);
    setPreviews(newPreviews);
  };

  // ✅ CRITICAL FIX: Proper FormData construction
  const handleUpload = async () => {
    // Check if at least one NEW image is selected
    const hasNewImages = images.some((img) => img !== null);
    if (!hasNewImages && !previews.some((p) => p !== null)) {
      setError("Please select at least one image");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ Create FormData properly
      const formData = new FormData();

      // Append each image with correct field name
      images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`image${index + 1}`, image);
          console.log(`✅ Appending image${index + 1}:`, image.name);
        }
      });

      // ✅ Log FormData contents for debugging
      console.log("📤 Uploading images...");
      for (let pair of formData.entries()) {
        console.log(`   ${pair[0]}:`, pair[1].name || pair[1]);
      }

      const response = await hostAPI.uploadImages(formData);

      if (response.data.success) {
        setSuccess("Images uploaded successfully!");
        // Reload images to show uploaded ones
        await loadImages();
        setTimeout(() => {
          navigate("/host/account");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to upload images";
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-8">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center shadow-md">
        <button
          onClick={() => navigate("/host/account")}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-800">
          My Images
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Club Logo */}
      <div className="flex justify-center py-4">
        <img
          src={`${import.meta.env.BASE_URL}club-logo.png`}
          alt="Club Logo"
          className="h-14 w-14 object-contain"
          onError={(e) => {
            // Fallback to emoji if image fails
            e.target.style.display = "none";
            e.target.parentElement.innerHTML =
              '<div class="h-14 w-14 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">♣️</div>';
          }}
        />
      </div>

      {/* Image Upload Slots */}
      <div className="px-6 py-4 space-y-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg"
          >
            {/* Image Preview */}
            <div className="relative w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              {previews[index] ? (
                <>
                  <img
                    src={previews[index]}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Upload Button */}
            <div className="flex-1">
              <label
                htmlFor={`image-${index}`}
                className="inline-block px-6 py-3 bg-pink-400 text-white font-semibold rounded-xl cursor-pointer hover:bg-pink-500 transition"
              >
                Image {index + 1}
              </label>
              <input
                id={`image-${index}`}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={(e) => handleImageSelect(index, e)}
                className="hidden"
                disabled={uploading}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
          {success}
        </div>
      )}

      {/* Upload Button */}
      <div className="px-6">
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-pink-400 text-white text-lg font-bold py-4 rounded-2xl hover:bg-pink-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center px-4 py-8">
        <p className="text-xs text-gray-600">
          © 2025 Biswa Bangla Social Networking Services Club.
        </p>
        <p className="text-xs text-gray-500">All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyImages;
