import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  User,
  Image,
  Video,
  FileText,
  CreditCard,
  IndianRupee,
  DollarSign,
  History,
  Camera,
  LogOut,
} from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { hostAPI, getServerURL } from "../../../services/api";

const HostAccount = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hostData, setHostData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    console.log("🏠 HostAccount mounted");

    if (!user) {
      setError("Authentication required");
      setLoading(false);
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token missing");
      setLoading(false);
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 2000);
      return;
    }

    loadHostData();
  }, [user, navigate, logout]);

  const loadHostData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hostAPI.getProfile();

      if (response.data.success) {
        setHostData(response.data.user);
      } else {
        throw new Error(response.data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("❌ Failed to load host data:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load profile";
      setError(errorMsg);

      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureURL = () => {
    if (!hostData) return null;

    if (!hostData.profilePicture) {
      return `https://ui-avatars.com/api/?name=${hostData.firstName}+${hostData.lastName}&background=random&color=fff&size=200`;
    }

    const baseURL = getServerURL();
    return `${baseURL}${hostData.profilePicture}`;
  };

  // ✅ NEW: Generate ID Number (first 8 digits of phone)
  const getIDNumber = (phone) => {
    if (!phone) return "N/A";
    return phone.substring(0, 8);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  if (error || !hostData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] px-4">
        <div className="text-center bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Failed to Load Profile
          </h2>
          <p className="text-red-600 mb-6">
            {error || "Unknown error occurred"}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={loadHostData}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SUCCESS STATE ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-24">
      {/* old */}
      {/* TOP HEADER */}
      <header className="bg-pink-300 py-4 px-6 flex items-center justify-between shadow-md">
        {/* ✅ Left: App Logo - Navigate to HostHome */}
        <div className="flex items-center">
          <button
            onClick={() => navigate("/host/home")}
            className="focus:outline-none hover:opacity-80 transition"
          >
            <img
              src={`${import.meta.env.BASE_URL}logo-left.png`}
              alt="App Logo"
              className="h-12 w-12 object-contain"
              onError={(e) => {
                // Fallback to emoji if image fails
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div class="h-12 w-12 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">🎯</div>';
              }}
            />
          </button>
        </div>

        {/* ✅ Center: Club Logo */}
        <div className="flex items-center">
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

        {/* Right: Wallet & Logout */}
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg">
            <span>₹{hostData?.walletBalance || 0}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* end */}

      {/* ✅ UPDATED PROFILE SECTION */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-1">
              <img
                src={getProfilePictureURL()}
                alt="Profile"
                className="w-full h-full rounded-full object-cover bg-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${hostData?.firstName}+${hostData?.lastName}&background=random&color=fff&size=200`;
                }}
              />
            </div>

            <button
              onClick={() => navigate("/host/profile/upload-picture")}
              className="absolute bottom-0 right-0 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-500 transition"
            >
              <span className="text-xl font-bold">+</span>
            </button>
          </div>

          <div className="flex-1">
            {/* ✅ Host Full Name */}
            <h2 className="text-2xl font-bold text-gray-800">
              {hostData?.firstName} {hostData?.lastName}
            </h2>

            {/* ✅ Host ID
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">Host ID:</span>{" "}
              {hostData?.id || hostData?._id}
            </p> */}

            {/* ✅ ID Number (first 8 digits of phone) */}
            <p className="text-gray-600 text-sm">
              <span className="font-semibold">ID Number:</span>{" "}
              {getIDNumber(hostData?.phone)}
            </p>

            {hostData?.isHost && (
              <span className="inline-block mt-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                HOST {hostData?.isHostPremium && "PREMIUM"}
              </span>
            )}
          </div>
        </div>

        {/* EARNING BALANCE */}
        <div className="bg-pink-100 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Earning Balance
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {hostData?.earningPoints || 0} Points
          </p>
          <p className="text-sm text-gray-600 mt-1">1 Point = ₹8</p>
        </div>

        {/* MY PROFILE SECTION */}
        <div className="bg-pink-100 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Profile</h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/host/account/images")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <Image className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">
                My Images
              </span>
            </button>

            <button
              onClick={() => navigate("/host/account/myvideos")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <Video className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">
                My Videos
              </span>
            </button>

            <button
              onClick={() => navigate("/host/account/kyc")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <FileText className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">My KYC</span>
            </button>

            <button
              onClick={() => navigate("/host/account/audition")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <Camera className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">
                My Audition Video
              </span>
            </button>
          </div>
        </div>

        {/* MY PAYMENT SECTION */}
        <div className="bg-pink-100 rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">My Payment</h3>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/host/account/bank")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <CreditCard className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">
                Bank Details
              </span>
            </button>

            <button
              onClick={() => navigate("/host/account/withdraw")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <IndianRupee className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">
                Withdraw
              </span>
            </button>

            <button
              onClick={() => navigate("/host/account/history")}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-pink-50 transition"
            >
              <History className="w-6 h-6 text-gray-700" />
              <span className="text-lg font-medium text-gray-800">
                Withdrawal History
              </span>
            </button>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="bg-red-50 rounded-2xl p-6 shadow-lg">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition font-semibold"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-pink-200 shadow-lg">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => navigate("/host/home")}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-600">Home</span>
          </button>

          <button
            onClick={() => navigate("/host/account")}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-6 h-6 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600">
              Account
            </span>
          </button>
        </div>
      </nav>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout? You'll need to login again to
              access your account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostAccount;
