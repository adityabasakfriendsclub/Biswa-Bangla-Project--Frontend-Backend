import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user?.firstName}! 👋
              </h1>
              <p className="text-gray-600 mt-1">Your dashboard is ready</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="text-gray-800 font-semibold">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-gray-800 font-semibold">{user?.phone}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Gender</p>
              <p className="text-gray-800 font-semibold capitalize">
                {user?.gender}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className="text-green-600 font-semibold">
                {user?.isVerified ? "✅ Verified" : "⏳ Pending"}
              </p>
            </div>
            {user?.agencyCode && (
              <div>
                <p className="text-gray-600 text-sm">Agency Code</p>
                <p className="text-gray-800 font-semibold">
                  {user?.agencyCode}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Find Matches</h3>
            <p className="text-sm opacity-90 mb-4">Discover people near you</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Start Browsing
            </button>
          </div>

          <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Messages</h3>
            <p className="text-sm opacity-90 mb-4">Chat with your matches</p>
            <button className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              View Messages
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-bold mb-2">Edit Profile</h3>
            <p className="text-sm opacity-90 mb-4">Update your information</p>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Stats</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-gray-600 text-sm mt-1">Matches</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg">
              <p className="text-3xl font-bold text-pink-600">0</p>
              <p className="text-gray-600 text-sm mt-1">Likes</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-gray-600 text-sm mt-1">Views</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
