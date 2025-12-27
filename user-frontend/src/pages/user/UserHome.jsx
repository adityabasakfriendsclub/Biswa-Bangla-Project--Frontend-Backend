// src/pages/user/UserHome.jsx
import { useState, useEffect } from "react";

export default function UserHome({ onLogout, onExitToAdmin }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Exit to Admin Button */}
      <button
        onClick={onExitToAdmin}
        className="fixed top-4 left-4 px-4 py-2 bg-white shadow-lg text-gray-700 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
      >
        ← Admin Mode
      </button>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome to Dating App! 💕
            </h1>
            <p className="text-gray-600">You're successfully logged in</p>
          </div>

          {userData && (
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Your Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {userData.firstName} {userData.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-800">
                    📱 {userData.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {userData.gender === "Male"
                      ? "👨"
                      : userData.gender === "Female"
                      ? "👩"
                      : "🧑"}{" "}
                    {userData.gender}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ✅ Active
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={handleLogout}
              className="px-8 py-3 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-3">❤️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Find Matches</h3>
            <p className="text-sm text-gray-600">
              Discover people who share your interests
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="font-semibold text-gray-800 mb-2">Chat</h3>
            <p className="text-sm text-gray-600">
              Start conversations with your matches
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="font-semibold text-gray-800 mb-2">Premium</h3>
            <p className="text-sm text-gray-600">Unlock exclusive features</p>
          </div>
        </div>
      </div>
    </div>
  );
}
