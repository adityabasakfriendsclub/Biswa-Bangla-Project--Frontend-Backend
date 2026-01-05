// FILE: frontend/src/components/host/account/MyKYC.jsx
// ✅ FIXED: Proper KYC document upload (Aadhaar & Voter Card)

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { hostAPI } from "../../../services/api";

const MyKYC = () => {
  const navigate = useNavigate();
  const [kyc, setKyc] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    voterFront: null,
    voterBack: null,
  });
  const [previews, setPreviews] = useState({
    aadhaarFront: null,
    aadhaarBack: null,
    voterFront: null,
    voterBack: null,
  });
  const [kycStatus, setKycStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const response = await hostAPI.getKYCStatus();
      if (response.data.success && response.data.kyc) {
        setKycStatus(response.data.kyc);

        // Load existing images
        const existingKyc = response.data.kyc;
        const baseURL =
          import.meta.env.VITE_API_URL ||
          "https://biswabanglasocialnetworkingservices.com";

        if (existingKyc.aadhaarFront) {
          setPreviews((prev) => ({
            ...prev,
            aadhaarFront: `${baseURL}${existingKyc.aadhaarFront}`,
          }));
        }
        if (existingKyc.aadhaarBack) {
          setPreviews((prev) => ({
            ...prev,
            aadhaarBack: `${baseURL}${existingKyc.aadhaarBack}`,
          }));
        }
        if (existingKyc.voterFront) {
          setPreviews((prev) => ({
            ...prev,
            voterFront: `${baseURL}${existingKyc.voterFront}`,
          }));
        }
        if (existingKyc.voterBack) {
          setPreviews((prev) => ({
            ...prev,
            voterBack: `${baseURL}${existingKyc.voterBack}`,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load KYC status:", error);
    }
  };

  const handleImageSelect = (field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    setKyc((prev) => ({
      ...prev,
      [field]: file,
    }));

    // ✅ Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviews((prev) => ({
        ...prev,
        [field]: e.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // ✅ CRITICAL FIX: Proper FormData upload
  const handleUpload = async () => {
    // Validate all fields
    const allFieldsFilled =
      (kyc.aadhaarFront || previews.aadhaarFront) &&
      (kyc.aadhaarBack || previews.aadhaarBack) &&
      (kyc.voterFront || previews.voterFront) &&
      (kyc.voterBack || previews.voterBack);

    if (!allFieldsFilled) {
      setError(
        "Please upload all KYC documents (Aadhaar & Voter Card - Front & Back)"
      );
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      // ✅ Append files with correct field names
      if (kyc.aadhaarFront) formData.append("aadhaarFront", kyc.aadhaarFront);
      if (kyc.aadhaarBack) formData.append("aadhaarBack", kyc.aadhaarBack);
      if (kyc.voterFront) formData.append("voterFront", kyc.voterFront);
      if (kyc.voterBack) formData.append("voterBack", kyc.voterBack);

      console.log("📤 Uploading KYC documents...");
      for (let pair of formData.entries()) {
        console.log(`   ${pair[0]}:`, pair[1].name || pair[1]);
      }

      const response = await hostAPI.uploadKYC(formData);

      if (response.data.success) {
        setSuccess(
          "KYC documents uploaded successfully! Verification pending."
        );
        await loadKYCStatus();
        setTimeout(() => {
          navigate("/host/account");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to upload KYC documents";
      setError(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  // ✅ Status Badge Component
  const StatusBadge = ({ status }) => {
    const config = {
      approved: { color: "green", icon: CheckCircle, text: "Approved" },
      rejected: { color: "red", icon: XCircle, text: "Rejected" },
      pending: { color: "yellow", icon: Clock, text: "Pending" },
    };

    const { color, icon: Icon, text } = config[status] || config.pending;

    return (
      <div
        className={`flex items-center gap-2 px-4 py-2 bg-${color}-100 text-${color}-700 rounded-lg border border-${color}-300`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-semibold">{text}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-8">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center shadow-md">
        <button
          onClick={() => navigate("/host/account")}
          className="flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-800">
          My KYC
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

      {/* KYC Status */}
      {kycStatus && (
        <div className="mx-6 mb-6 p-4 bg-white rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">KYC Status</p>
            <StatusBadge status={kycStatus.status} />
          </div>
          {kycStatus.rejectionReason && (
            <div className="flex-1 ml-4">
              <p className="text-sm text-red-600">
                <strong>Reason:</strong> {kycStatus.rejectionReason}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Aadhaar Card Section */}
      <div className="mx-6 mb-6 bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Aadhaar Card
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Front */}
          <div className="flex flex-col items-center">
            <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-2">
              {previews.aadhaarFront ? (
                <img
                  src={previews.aadhaarFront}
                  alt="Aadhaar Front"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="aadhaar-front"
              className="w-full px-4 py-2 bg-pink-400 text-white font-semibold rounded-xl text-center cursor-pointer hover:bg-pink-500 transition"
            >
              Front
            </label>
            <input
              id="aadhaar-front"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect("aadhaarFront", e)}
              className="hidden"
              disabled={uploading || kycStatus?.status === "approved"}
            />
          </div>

          {/* Back */}
          <div className="flex flex-col items-center">
            <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-2">
              {previews.aadhaarBack ? (
                <img
                  src={previews.aadhaarBack}
                  alt="Aadhaar Back"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="aadhaar-back"
              className="w-full px-4 py-2 bg-pink-400 text-white font-semibold rounded-xl text-center cursor-pointer hover:bg-pink-500 transition"
            >
              Back
            </label>
            <input
              id="aadhaar-back"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect("aadhaarBack", e)}
              className="hidden"
              disabled={uploading || kycStatus?.status === "approved"}
            />
          </div>
        </div>
      </div>

      {/* Voter Card Section */}
      <div className="mx-6 mb-6 bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Voter Card
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Front */}
          <div className="flex flex-col items-center">
            <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-2">
              {previews.voterFront ? (
                <img
                  src={previews.voterFront}
                  alt="Voter Front"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="voter-front"
              className="w-full px-4 py-2 bg-pink-400 text-white font-semibold rounded-xl text-center cursor-pointer hover:bg-pink-500 transition"
            >
              Front
            </label>
            <input
              id="voter-front"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect("voterFront", e)}
              className="hidden"
              disabled={uploading || kycStatus?.status === "approved"}
            />
          </div>

          {/* Back */}
          <div className="flex flex-col items-center">
            <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden mb-2">
              {previews.voterBack ? (
                <img
                  src={previews.voterBack}
                  alt="Voter Back"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FileText className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="voter-back"
              className="w-full px-4 py-2 bg-pink-400 text-white font-semibold rounded-xl text-center cursor-pointer hover:bg-pink-500 transition"
            >
              Back
            </label>
            <input
              id="voter-back"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect("voterBack", e)}
              className="hidden"
              disabled={uploading || kycStatus?.status === "approved"}
            />
          </div>
        </div>
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
      {kycStatus?.status !== "approved" && (
        <div className="px-6">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-pink-400 text-white text-lg font-bold py-4 rounded-2xl hover:bg-pink-500 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload KYC Documents"}
          </button>
        </div>
      )}

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

export default MyKYC;
