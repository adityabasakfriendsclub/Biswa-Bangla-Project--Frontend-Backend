// src/pages/TalktimeTransactionPage.jsx
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";

export default function TalktimeTransactionPage({ user, onBack }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const walletBalance = user?.walletBalance || 0;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/wallet/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-6 flex items-center justify-between">
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
          TalkTime transaction
        </h1>

        <div className="bg-yellow-300 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 border-2 border-yellow-400">
          <span>💰</span>
          <span>₹{walletBalance}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6">
              <img
                src="/logo.png"
                alt="BBSNC Logo"
                className="h-32 w-32 opacity-50"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              No Data Found
            </h2>
            <p className="text-gray-500 text-center">
              You haven't made any transactions yet.
              <br />
              Add talktime to get started!
            </p>
          </div>
        ) : (
          /* Transaction List */
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Recent Transactions
            </h2>
            {transactions.map((tx) => (
              <div
                key={tx._id}
                className="bg-white rounded-2xl shadow-md p-5 flex justify-between items-center"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">
                      {tx.type === "credit" ? "💰" : "📹"}
                    </span>
                    <p className="font-bold text-gray-800 text-lg">
                      {tx.description}
                    </p>
                  </div>
                  {tx.hostName && (
                    <p className="text-sm text-gray-600 ml-9">
                      Host: {tx.hostName}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 ml-9 mt-1">
                    {new Date(tx.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-2xl font-bold ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Balance: ₹{tx.balanceAfter}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-center text-xs text-gray-600 space-y-1 border-t border-gray-200">
        <p>© 2025 Biswa Bangla Social Networking Services Club.</p>
        <p>All rights reserved.</p>
      </div>
    </div>
  );
}
