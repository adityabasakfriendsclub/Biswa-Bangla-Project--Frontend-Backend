// FILE: frontend/src/components/host/account/WithdrawalHistory.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { hostAPI } from "../../../services/api";

const WithdrawalHistory = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    try {
      const response = await hostAPI.getWithdrawalHistory();
      if (response.data.success) {
        setWithdrawals(response.data.withdrawals || []);
      }
    } catch (error) {
      console.error("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-8">
      <header className="bg-white px-6 py-4 flex items-center shadow-md">
        <button onClick={() => navigate("/host/account")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">
          Withdrawal History
        </h1>
      </header>

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

      <div className="px-6 space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 mx-auto"></div>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg">
            <p className="text-gray-500">No withdrawal history</p>
          </div>
        ) : (
          withdrawals.map((withdrawal, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-gray-600 mb-2">
                {formatDate(withdrawal.requestedAt)}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                ₹ {withdrawal.amount.toFixed(2)}
              </p>
              <p
                className={`font-semibold capitalize ${getStatusColor(
                  withdrawal.status
                )}`}
              >
                {withdrawal.status}
              </p>
            </div>
          ))
        )}
      </div>

      <footer className="text-center px-4 py-8">
        <p className="text-xs text-gray-600">
          © 2025 Biswa Bangla Social Networking Services Club.
        </p>
        <p className="text-xs text-gray-500">All rights reserved.</p>
      </footer>
    </div>
  );
};

export default WithdrawalHistory;
