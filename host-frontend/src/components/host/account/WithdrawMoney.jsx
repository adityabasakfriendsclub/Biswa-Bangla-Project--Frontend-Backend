// FILE: frontend/src/components/host/account/WithdrawMoney.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { hostAPI } from "../../../services/api";

const WithdrawMoney = () => {
  const navigate = useNavigate();
  const [walletBalance, setWalletBalance] = useState(0);
  const [earningPoints, setEarningPoints] = useState(0);
  const [formData, setFormData] = useState({
    amount: "",
    upiId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const response = await hostAPI.getProfile();
      if (response.data.success) {
        setWalletBalance(response.data.user.walletBalance || 0);
        setEarningPoints(response.data.user.earningPoints || 0);
      }
    } catch (error) {
      console.error("Failed to load wallet data");
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

    const amount = parseFloat(formData.amount);

    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (amount > walletBalance) {
      setError("Insufficient balance");
      return;
    }

    if (!formData.upiId) {
      setError("Please enter UPI ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await hostAPI.withdrawMoney({
        amount: amount,
        upiId: formData.upiId,
      });

      if (response.data.success) {
        setSuccess("Withdrawal request submitted successfully!");
        setTimeout(() => navigate("/host/account/history"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Withdrawal failed");
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
        <h1 className="flex-1 text-center text-xl font-bold">Withdraw Money</h1>
      </header>

      <div className="flex justify-center py-4">
        <img
          src="/club-logo.png"
          alt="Club"
          className="h-14 w-14"
          onError={(e) => (e.target.src = "https://via.placeholder.com/56")}
        />
      </div>

      <div className="mx-6 mb-6 bg-white rounded-2xl p-6 shadow-lg text-center">
        <p className="text-gray-600 mb-2">Wallet Balance</p>
        <p className="text-4xl font-bold text-gray-900">
          ₹ {walletBalance.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-4">
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount to withdraw"
          step="0.01"
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none"
          disabled={loading}
        />

        <input
          type="text"
          name="upiId"
          value={formData.upiId}
          onChange={handleChange}
          placeholder="Enter upi id"
          className="w-full px-4 py-4 rounded-2xl border-2 border-gray-300 focus:border-pink-400 outline-none"
          disabled={loading}
        />

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">1 min = 1 point</p>
          <p className="text-lg font-semibold">1 point = ₹8</p>
        </div>

        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-red-700 text-sm font-semibold">
            Note : If UPI Id is Wrong or Invalid Biswa Bangla Social Networking
            Services Club Will Be not responsible for any type of fund transfer
          </p>
        </div>

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
          {loading ? "Processing..." : "Withdraw"}
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

export default WithdrawMoney;
