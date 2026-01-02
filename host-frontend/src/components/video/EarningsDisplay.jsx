import React, { useEffect, useState } from "react";
import { TrendingUp, Clock, DollarSign, Award } from "lucide-react";
import { callAPI } from "../../services/callService";

const EarningsDisplay = () => {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEarnings();
  }, []);

  const loadEarnings = async () => {
    try {
      const response = await callAPI.getHostEarnings();
      if (response.success) {
        setEarnings(response.data);
      }
    } catch (error) {
      console.error("❌ Load earnings error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!earnings) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-800">Your Earnings</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Total Calls */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Total Calls</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {earnings.totalCalls || 0}
          </p>
        </div>

        {/* Total Minutes */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Minutes</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.floor(earnings.totalMinutes || 0)}
          </p>
        </div>

        {/* Total Points */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-gray-600">Points Earned</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {earnings.totalPoints || 0}
          </p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>
          <p className="text-2xl font-bold text-green-600">
            ₹{earnings.totalEarnings || 0}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          💡 You earn 1 point per minute • 1 point = ₹8
        </p>
      </div>
    </div>
  );
};

export default EarningsDisplay;
