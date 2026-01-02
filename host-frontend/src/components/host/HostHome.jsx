// // FILE: frontend/src/components/host/HostHome.jsx
// // ✅ FIXED: Proper logo image loading from public folder

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Phone, PhoneOff, Home, User, Wallet, LogOut } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { useCall } from "../../context/CallContext";
// import { hostAPI } from "../../services/api";
// import { socket, connectSocket, disconnectSocket } from "../../services/socket";
// import HostSlider from "./HostSlider";

// const HostHome = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const { incomingCall } = useCall();

//   const [isOnline, setIsOnline] = useState(false);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }

//     if (!user.isHost) {
//       alert("Access denied. Only hosts can access this page.");
//       navigate("/dashboard");
//       return;
//     }

//     loadHostData();
//     connectSocket(user.id);
//     setupSocketListeners();

//     return () => {
//       if (isOnline) {
//         updateOnlineStatus(false);
//       }
//       disconnectSocket();
//     };
//   }, [user]);

//   const loadHostData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await hostAPI.getProfile();

//       if (response.data.success) {
//         const hostData = response.data.user;
//         setWalletBalance(hostData.walletBalance || 0);
//         setIsOnline(hostData.isOnline || false);
//         setError(null);
//       }
//     } catch (error) {
//       console.error("❌ Failed to load host data:", error);
//       setError(error.response?.data?.message || "Failed to load profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupSocketListeners = () => {
//     socket.on("connect", () => {
//       console.log("✅ Socket connected");
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Socket disconnected");
//     });

//     socket.on("host-status-updated", (data) => {
//       console.log("🔄 Host status updated:", data);
//     });
//   };

//   const handleToggleStatus = async () => {
//     const newStatus = !isOnline;
//     setIsOnline(newStatus);

//     try {
//       await updateOnlineStatus(newStatus);
//       socket.emit("host-status-change", {
//         hostId: user.id,
//         isOnline: newStatus,
//       });
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       setIsOnline(!newStatus);
//     }
//   };

//   const updateOnlineStatus = async (status) => {
//     try {
//       await hostAPI.updateOnlineStatus(status);
//     } catch (error) {
//       console.error("Status update error:", error);
//     }
//   };

//   const handleLogout = () => {
//     setShowLogoutConfirm(true);
//   };

//   const confirmLogout = () => {
//     if (isOnline) {
//       updateOnlineStatus(false);
//     }
//     logout();
//     navigate("/login");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-pink-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
//         <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg
//               className="w-8 h-8 text-red-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//               />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-3">
//             Failed to Load Profile
//           </h2>
//           <p className="text-red-600 mb-6">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={loadHostData}
//               className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={() => {
//                 logout();
//                 navigate("/login");
//               }}
//               className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 pb-20">
//       {/* TOP HEADER */}
//       <header className="bg-pink-200 py-4 px-6 flex items-center justify-between shadow-md">
//         {/* ✅ Left: App Logo from public folder */}
//         <div className="flex items-center">
//           <img
//             src="/logo-left.png"
//             alt="App Logo"
//             className="h-12 w-12 object-contain"
//             onError={(e) => {
//               // Fallback to emoji if image fails
//               e.target.style.display = "none";
//               e.target.parentElement.innerHTML =
//                 '<div class="h-12 w-12 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">🎯</div>';
//             }}
//           />
//         </div>

//         {/* ✅ Center: Club Logo from public folder */}
//         <div className="flex items-center">
//           <img
//             src="/club-logo.png"
//             alt="Club Logo"
//             className="h-14 w-14 object-contain"
//             onError={(e) => {
//               // Fallback to emoji if image fails
//               e.target.style.display = "none";
//               e.target.parentElement.innerHTML =
//                 '<div class="h-14 w-14 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">♣️</div>';
//             }}
//           />
//         </div>

//         {/* Right: Wallet & Logout */}
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate("/host/account/withdraw")}
//             className="flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-yellow-500 transition"
//           >
//             <Wallet className="w-5 h-5" />
//             <span>₹{walletBalance}</span>
//           </button>

//           <button
//             onClick={handleLogout}
//             className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
//             title="Logout"
//           >
//             <LogOut className="w-5 h-5" />
//           </button>
//         </div>
//       </header>

//       {/* ONLINE/OFFLINE TOGGLE */}
//       <div className="px-6 py-6 flex items-center justify-end">
//         <div className="flex items-center gap-3">
//           <span
//             className={`text-xl font-bold ${
//               isOnline ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {isOnline ? "Online" : "Offline"}
//           </span>
//           <button
//             onClick={handleToggleStatus}
//             className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
//               isOnline ? "bg-green-500" : "bg-gray-300"
//             }`}
//           >
//             <div
//               className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
//                 isOnline ? "transform translate-x-8" : ""
//               }`}
//             ></div>
//           </button>
//         </div>
//       </div>

//       {/* ACTIVE HOSTS SLIDER */}
//       <div className="px-6 py-4">
//         <HostSlider currentUserId={user.id} />
//       </div>

//       {/* PLACEHOLDER WHEN NO CALL */}
//       {isOnline && !incomingCall && (
//         <div className="px-6 py-8 text-center">
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
//             <Phone className="w-16 h-16 mx-auto mb-4 text-green-500 animate-pulse" />
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               You're Online!
//             </h3>
//             <p className="text-gray-600">Waiting for incoming calls...</p>
//           </div>
//         </div>
//       )}

//       {!isOnline && (
//         <div className="px-6 py-8 text-center">
//           <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
//             <PhoneOff className="w-16 h-16 mx-auto mb-4 text-red-500" />
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               You're Offline
//             </h3>
//             <p className="text-gray-600">Toggle online to receive calls</p>
//           </div>
//         </div>
//       )}

//       {/* FOOTER */}
//       <footer className="absolute bottom-16 left-0 right-0 text-center px-4 py-4">
//         <p className="text-xs text-gray-600">
//           © 2025 Biswa Bangla Social Networking Services Club.
//         </p>
//         <p className="text-xs text-gray-500">All rights reserved.</p>
//       </footer>

//       {/* BOTTOM NAVIGATION */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-pink-200 shadow-lg">
//         <div className="flex items-center justify-around py-3">
//           <button
//             onClick={() => navigate("/host/home")}
//             className="flex flex-col items-center gap-1"
//           >
//             <Home className="w-6 h-6 text-yellow-600" />
//             <span className="text-xs font-semibold text-yellow-600">Home</span>
//           </button>

//           <button
//             onClick={() => navigate("/host/account")}
//             className="flex flex-col items-center gap-1"
//           >
//             <User className="w-6 h-6 text-gray-600" />
//             <span className="text-xs font-medium text-gray-600">Account</span>
//           </button>
//         </div>
//       </nav>

//       {/* LOGOUT CONFIRMATION MODAL */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
//             <h3 className="text-xl font-bold text-gray-800 mb-4">
//               Confirm Logout
//             </h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to logout? You'll need to login again to
//               receive calls.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowLogoutConfirm(false)}
//                 className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmLogout}
//                 className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HostHome;

// new2
// FILE: frontend/src/components/host/HostHome.jsx
// ✅ FIXED: Proper logo image loading from public folder

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, PhoneOff, Home, User, Wallet, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCall } from "../../context/CallContext";
import { hostAPI } from "../../services/api";
import { socket, connectSocket, disconnectSocket } from "../../services/socket";
import HostSlider from "./HostSlider";

const HostHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { incomingCall } = useCall();

  const [isOnline, setIsOnline] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.isHost) {
      alert("Access denied. Only hosts can access this page.");
      navigate("/dashboard");
      return;
    }

    loadHostData();
    connectSocket(user.id);
    setupSocketListeners();

    return () => {
      if (isOnline) {
        updateOnlineStatus(false);
      }
      disconnectSocket();
    };
  }, [user]);

  const loadHostData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hostAPI.getProfile();

      if (response.data.success) {
        const hostData = response.data.user;
        setWalletBalance(hostData.walletBalance || 0);
        setIsOnline(hostData.isOnline || false);
        setError(null);
      }
    } catch (error) {
      console.error("❌ Failed to load host data:", error);
      setError(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    socket.on("host-status-updated", (data) => {
      console.log("🔄 Host status updated:", data);
    });
  };

  const handleToggleStatus = async () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);

    try {
      await updateOnlineStatus(newStatus);
      socket.emit("host-status-change", {
        hostId: user.id,
        isOnline: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      setIsOnline(!newStatus);
    }
  };

  const updateOnlineStatus = async (status) => {
    try {
      await hostAPI.updateOnlineStatus(status);
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    if (isOnline) {
      updateOnlineStatus(false);
    }
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
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
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadHostData}
              className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50 pb-20">
      {/* TOP HEADER */}
      <header className="bg-pink-200 py-4 px-6 flex items-center justify-between shadow-md">
        {/* ✅ Left: App Logo from public folder */}
        <div className="flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}logo-left.png`}
            alt="App Logo"
            className="h-16 w-16 object-contain"
            onError={(e) => {
              // Fallback to emoji if image fails
              e.target.style.display = "none";
              e.target.parentElement.innerHTML =
                '<div class="h-12 w-12 bg-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">🎯</div>';
            }}
          />
        </div>

        {/* ✅ Center: Club Logo from public folder */}
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
          <button
            onClick={() => navigate("/host/account/withdraw")}
            className="flex items-center gap-2 bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-bold shadow-lg hover:bg-yellow-500 transition"
          >
            <Wallet className="w-5 h-5" />
            <span>₹{walletBalance}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ONLINE/OFFLINE TOGGLE */}
      <div className="px-6 py-6 flex items-center justify-end">
        <div className="flex items-center gap-3">
          <span
            className={`text-xl font-bold ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
          <button
            onClick={handleToggleStatus}
            className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
              isOnline ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                isOnline ? "transform translate-x-8" : ""
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* ACTIVE HOSTS SLIDER */}
      <div className="px-6 py-4">
        <HostSlider currentUserId={user.id} />
      </div>

      {/* PLACEHOLDER WHEN NO CALL */}
      {isOnline && !incomingCall && (
        <div className="px-6 py-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <Phone className="w-16 h-16 mx-auto mb-4 text-green-500 animate-pulse" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              You're Online!
            </h3>
            <p className="text-gray-600">Waiting for incoming calls...</p>
          </div>
        </div>
      )}

      {!isOnline && (
        <div className="px-6 py-8 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <PhoneOff className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              You're Offline
            </h3>
            <p className="text-gray-600">Toggle online to receive calls</p>
          </div>
        </div>
      )}

      {/* FOOTER */}
      {/* <footer className="absolute bottom-16 left-0 right-0 text-center px-4 py-4">
        <p className="text-xs text-gray-600">
          © 2025 Biswa Bangla Social Networking Services Club.
        </p>
        <p className="text-xs text-gray-500">All rights reserved.</p>
      </footer> */}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-pink-200 shadow-lg">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => navigate("/host/home")}
            className="flex flex-col items-center gap-1"
          >
            <Home className="w-6 h-6 text-yellow-600" />
            <span className="text-xs font-semibold text-yellow-600">Home</span>
          </button>

          <button
            onClick={() => navigate("/host/account")}
            className="flex flex-col items-center gap-1"
          >
            <User className="w-6 h-6 text-gray-600" />
            <span className="text-xs font-medium text-gray-600">Account</span>
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
              receive calls.
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

export default HostHome;
