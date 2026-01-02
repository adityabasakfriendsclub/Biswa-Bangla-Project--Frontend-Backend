// FILE: frontend/src/components/host/account/BankDetails.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { hostAPI } from "../../../services/api";

const BankDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "savings",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadBankDetails();
  }, []);

  const loadBankDetails = async () => {
    try {
      const response = await hostAPI.getBankDetails();
      if (response.data.success && response.data.bankDetails) {
        setFormData(response.data.bankDetails);
      }
    } catch (error) {
      console.error("Failed to load bank details");
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.accountHolderName ||
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.ifscCode
    ) {
      setError("All fields are required");
      return;
    }

    // Validate IFSC (11 characters, alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.ifscCode)) {
      setError("Invalid IFSC Code format");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await hostAPI.saveBankDetails(formData);
      if (response.data.success) {
        setSuccess("Bank details saved successfully!");
        setTimeout(() => navigate("/host/account"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save bank details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-8">
      <header className="bg-white px-6 py-4 flex items-center shadow-md">
        <button onClick={() => navigate("/host/account")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">Bank Details</h1>
      </header>

      <div className="flex justify-center py-4">
        <img
          src="/club-logo.png"
          alt="Club"
          className="h-14 w-14"
          onError={(e) => (e.target.src = "https://via.placeholder.com/56")}
        />
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-4">
        <input
          type="text"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          placeholder="Account Holder Name"
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none"
          disabled={loading}
        />

        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Bank Name"
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none"
          disabled={loading}
        />

        <input
          type="text"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Account Number"
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none"
          disabled={loading}
        />

        <input
          type="text"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="IFSC Code"
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none uppercase"
          disabled={loading}
        />

        <select
          name="accountType"
          value={formData.accountType}
          onChange={handleChange}
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none"
          disabled={loading}
        >
          <option value="savings">Savings</option>
          <option value="current">Current</option>
        </select>

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-400 text-white text-lg font-bold py-4 rounded-2xl hover:bg-pink-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Submit Bank Details"}
        </button>
      </form>

      <footer className="text-center px-4 py-8">
        <p className="text-xs text-gray-600">
          © 2025 Biswa Bangla Social Networking Services Club.
        </p>
        <p className="text-xs text-gray-500">All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BankDetails;
