// src/pages/HomePage.jsx - FIXED HOST PROFILE IMAGE DISPLAY
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const API_BASE_URL = "http://localhost:3000/api";
const SOCKET_URL = "http://localhost:3000";

export default function HomePage({ user, onStartCall, onNavigate, onLogout }) {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);

  // ✅ FIXED: Helper function to get correct profile image URL
  const getHostProfileImage = (host) => {
    // If host has a profilePicture field
    if (host.profilePicture) {
      // If it's already a full URL (starts with http)
      if (host.profilePicture.startsWith("http")) {
        return host.profilePicture;
      }
      // If it's a path from backend, construct full URL
      // Remove /api from base URL and add the path
      return `http://localhost:3000${host.profilePicture}`;
    }

    // Fallback to UI Avatars with host name
    const displayName = host.name || "User";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=ec4899&color=fff&size=200`;
  };

  // Fetch hosts from API
  const fetchHosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      if (!token) {
        setError("Please login to continue");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/hosts/online`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("🔥 Hosts response:", data);

      if (data.success) {
        setHosts(data.data.hosts);
      } else {
        setError(data.message || "Failed to fetch hosts");
      }
    } catch (error) {
      console.error("❌ Error fetching hosts:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize Socket.IO
  useEffect(() => {
    if (socketRef.current?.connected) {
      return;
    }

    console.log("🔌 Initializing Socket.IO connection...");

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("host_status_change", (data) => {
      console.log("📡 Host status changed:", data);
      setHosts((prevHosts) =>
        prevHosts.map((host) =>
          host.id === data.hostId
            ? { ...host, isOnline: data.isOnline, status: data.status }
            : host
        )
      );
    });

    fetchHosts();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleCallClick = (host) => {
    if (!host.isOnline || host.status === "busy") {
      alert(
        `❌ ${host.name} is currently ${host.status}. Please try another host.`
      );
      return;
    }

    setSelectedHost(host);
    setShowSafetyModal(true);
  };

  const handleConfirmCall = async () => {
    if (!selectedHost) return;

    const userBalance = user?.walletBalance || 0;
    if (userBalance < 25) {
      alert("❌ Insufficient balance! Minimum ₹25 required.");
      setShowSafetyModal(false);
      onNavigate?.("talktime");
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/call/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hostId: selectedHost.id }),
      });

      const data = await response.json();

      if (data.success) {
        if (socketRef.current) {
          socketRef.current.emit("call_started", {
            hostId: selectedHost.id,
            userId: user.id,
          });
        }

        onStartCall({
          callId: data.data.callId,
          hostId: selectedHost.id,
          hostName: selectedHost.name,
          token: data.data.token,
        });

        setShowSafetyModal(false);
      } else {
        alert(data.message || "Failed to start call");
      }
    } catch (error) {
      console.error("❌ Error starting call:", error);
      alert("Failed to start call. Please try again.");
    }
  };

  const walletBalance = user?.walletBalance || 0;

  // Get online hosts for popular section
  const popularHosts = hosts
    .filter((h) => h.isOnline && h.status !== "busy")
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <button onClick={() => onNavigate?.("home")}>
          {/* <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg> */}
          <img
            src="/user-logo.png"
            alt="Userapp Logo"
            className="h-16 w-auto"
          />
        </button>

        <div className="flex-1 flex justify-center ">
          <a href="">
            <img src="/logo.png" alt="Logo" className="h-16 w-16" />
          </a>
        </div>

        <button
          onClick={() => onNavigate("talktime")}
          className="bg-yellow-300 text-gray-800 px-3 py-1.5 rounded-full font-bold shadow-md flex items-center gap-1.5 border-2 border-yellow-400"
        >
          <span className="text-sm">💰</span>
          <span className="text-sm">₹{walletBalance}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500 mb-4"></div>
            <p className="text-gray-600">Loading hosts...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">❌ {error}</p>
            <button
              onClick={fetchHosts}
              className="bg-pink-400 text-white px-6 py-3 rounded-full hover:bg-pink-500"
            >
              🔄 Retry
            </button>
          </div>
        ) : hosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">😔 No hosts available</p>
            <button
              onClick={fetchHosts}
              className="bg-pink-400 text-white px-6 py-3 rounded-full hover:bg-pink-500"
            >
              🔄 Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Popular Section - Horizontal Scroll */}
            {popularHosts.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-800">Popular</h2>
                  <button className="text-pink-500 text-sm font-medium">
                    View All
                  </button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {popularHosts.map((host) => (
                    <button
                      key={host.id}
                      onClick={() => handleCallClick(host)}
                      className="flex flex-col items-center flex-shrink-0"
                    >
                      <div className="relative">
                        <img
                          src={getHostProfileImage(host)}
                          alt={host.name}
                          onError={(e) => {
                            // ✅ FIXED: Fallback if image fails to load
                            console.log("Image failed to load for:", host.name);
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              host.name
                            )}&background=ec4899&color=fff&size=128`;
                          }}
                          className="w-16 h-16 rounded-full object-cover border-2 border-pink-300"
                        />
                        <div
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                            host.status === "busy"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-800 mt-1">
                        {host.name.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Host List Cards - Vertical */}
            <div className="space-y-3">
              {hosts.map((host) => (
                <div
                  key={host.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="p-4 flex gap-3">
                    {/* Left Side - Profile Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={getHostProfileImage(host)}
                        alt={host.name}
                        onError={(e) => {
                          // ✅ FIXED: Fallback if image fails to load
                          console.log("Image failed to load for:", host.name);
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            host.name
                          )}&background=ec4899&color=fff&size=128`;
                        }}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      {/* Online Status Dot */}
                      <div
                        className={`absolute bottom-1 left-1 w-3 h-3 rounded-full border-2 border-white ${
                          host.status === "busy"
                            ? "bg-yellow-500"
                            : host.isOnline
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {/* Right Side - Details */}
                    <div className="flex-1 min-w-0">
                      {/* Name & Verified Badge */}
                      <div className="flex items-center gap-1 mb-1">
                        <h3 className="text-base font-bold text-gray-800 truncate">
                          {host.name}
                        </h3>
                        {host.isOnline && (
                          <svg
                            className="w-4 h-4 text-blue-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Age & Languages */}
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <span>🇮🇳</span>
                          <span>Hindi, English</span>
                        </span>
                      </div>

                      {/* Interest/Category */}
                      <div className="text-xs text-gray-600 mb-3">
                        {host.bio || "Society & Politics, Relationships"}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleCallClick(host)}
                        disabled={!host.isOnline || host.status === "busy"}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                          host.isOnline && host.status !== "busy"
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {host.status === "busy"
                          ? "BUSY"
                          : host.isOnline
                          ? "TALK NOW"
                          : "OFFLINE"}
                      </button>
                    </div>
                  </div>

                  {/* Pricing Banner (Optional) */}
                  {host.rating > 4.5 && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-center py-2 text-sm font-bold">
                      Random Match – ₹20/min
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-8 py-3 flex items-center justify-around shadow-lg">
        <button className="flex flex-col items-center gap-1 relative">
          <div className="bg-pink-500 rounded-full p-2 shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
          <span className="text-xs font-bold text-pink-500">Home</span>
        </button>

        <button
          onClick={() => onNavigate?.("account")}
          className="flex flex-col items-center gap-1 text-gray-500 hover:text-pink-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-semibold">Account</span>
        </button>
      </div>

      {/* Safety Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Safety Notice
              </h2>
              <p className="text-gray-600 text-sm">
                🚫 Do not share OTP, passwords, or personal details
                <br />
                🚫 No nudity or illegal activity allowed
                <br />
                💰 ₹25/min will be deducted from your wallet
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirmCall}
                className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 rounded-xl hover:from-pink-500 hover:to-pink-600"
              >
                Continue Video Call
              </button>
              <button
                onClick={() => setShowSafetyModal(false)}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
