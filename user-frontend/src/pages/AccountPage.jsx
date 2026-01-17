///src/pages/AccountPage.jsx
import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000/api";

export default function AccountPage({ user, onNavigate, onLogout }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch complete profile data on mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfileData(data.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get profile image URL
  const getProfileImageUrl = () => {
    const userData = profileData || user;

    if (userData?.profileImage) {
      // If it's a full URL
      if (userData.profileImage.startsWith("http")) {
        return userData.profileImage;
      }
      // If it's a path from backend
      return `${API_BASE_URL.replace("/api", "")}${userData.profileImage}`;
    }

    // Fallback to UI Avatars
    const displayName = userData?.nickname || userData?.firstName || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName,
    )}&background=ec4899&color=fff&size=200`;
  };

  // Get display name (nickname or firstName)
  const getDisplayName = () => {
    const userData = profileData || user;
    return userData?.nickname || userData?.firstName || "User";
  };

  const userData = profileData || user;
  const displayName = getDisplayName();
  const userId = userData?.phone || "Not Available";
  const gender = userData?.gender || null;
  const age = calculateAge(userData?.dateOfBirth);
  const profileImageUrl = getProfileImageUrl();

  const menuItems = [
    { id: "transaction", icon: "💳", label: "Talktime Transaction" },
    { id: "talktime", icon: "💰", label: "Talktime" },
    { id: "report", icon: "⚠️", label: "Report" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-300 via-pink-200 to-pink-100 flex flex-col">
      {/* Header with Logo and Wallet */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-4 flex items-center justify-between">
        <button onClick={() => onNavigate("home")}>
          {/* <span className="text-2xl">💕</span> */}
          <div className="px-3 py-1.5">
            <img
              src="/user-logo.png"
              alt="Userapp Logo"
              className="h-16 w-auto"
            />
          </div>
        </button>

        <div className="px-3 py-1.5">
          <a href="">
            <img src="/logo.png" alt="BBSNC Logo" className="h-16 w-auto" />
          </a>
        </div>

        <div className="bg-yellow-300 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 border-2 border-yellow-400">
          <span>💰</span>
          <span>₹{userData?.walletBalance || 0}</span>
        </div>
      </div>

      {/* Profile Section - ENHANCED */}
      <div className="bg-gradient-to-b from-pink-300 to-pink-200 pt-8 pb-6 px-6 text-center relative">
        {/* Profile Image */}
        <div className="relative inline-block mb-3">
          <img
            src={profileImageUrl}
            alt="Profile"
            onClick={() => onNavigate("profile")}
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                displayName,
              )}&background=ec4899&color=fff&size=200`;
            }}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
          />

          {/* Edit Button */}
          <button
            onClick={() => onNavigate("profile")}
            className="absolute bottom-1 right-1 w-9 h-9 bg-yellow-400 rounded-full text-white text-xl font-bold shadow-lg hover:bg-yellow-500 transition-colors"
          >
            +
          </button>
        </div>

        {/* Display Name */}
        <h2 className="text-2xl font-bold text-white mb-2">{displayName}</h2>

        {/* User ID (Phone) */}
        <p className="text-sm text-white opacity-90 mb-3">{userId}</p>

        {/* Gender and Age Row */}
        <div className="flex items-center justify-center gap-4 text-white">
          {/* Gender */}
          {gender && (
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="text-lg">
                {gender === "Male" ? "👨" : gender === "Female" ? "👩" : "🧑"}
              </span>
              <span className="text-sm font-semibold">{gender}</span>
            </div>
          )}

          {/* Age */}
          {age !== null && (
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <span className="text-lg">🎂</span>
              <span className="text-sm font-semibold">{age} yrs</span>
            </div>
          )}
        </div>

        {/* Add Info Message if Missing Data */}
        {(!gender || age === null) && (
          <button
            onClick={() => onNavigate("profile")}
            className="mt-3 text-xs text-white/80 hover:text-white underline"
          >
            Complete your profile →
          </button>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 px-6 py-6 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-all flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-pink-100 transition-colors">
              {item.icon}
            </div>
            <span className="text-lg font-semibold text-gray-800 flex-1 text-left">
              {item.label}
            </span>
            <svg
              className="w-6 h-6 text-gray-400 group-hover:text-pink-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}

        {/* Sign Out Button */}
        <button
          onClick={onLogout}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl p-5 shadow-lg hover:from-pink-600 hover:to-pink-700 transition-all font-bold text-lg mt-6"
        >
          Sign Out
        </button>
      </div>

      {/* Footer */}
      <div className="bg-white px-6 py-4 text-center text-xs text-gray-600 space-y-1">
        <p>© 2026 Biswa Bangla Social Networking Services Club.</p>
        <p>All rights reserved.</p>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gradient-to-r from-pink-300 to-pink-400 px-8 py-4 flex items-center justify-around shadow-lg">
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col items-center gap-1 text-gray-800 hover:text-white transition-colors"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xs font-semibold">Home</span>
        </button>

        <button
          onClick={() => onNavigate("account")}
          className="flex flex-col items-center gap-1 relative"
        >
          <div className="bg-white rounded-full p-3 shadow-lg">
            <svg
              className="w-7 h-7 text-pink-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-pink-600">Account</span>
        </button>
      </div>
    </div>
  );
}
