// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Phone, Video, LogOut, User as UserIcon } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { useCall } from "../../context/CallContext";
// import { hostAPI } from "../../services/api";
// import { callAPI } from "../../services/callService";

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
//   const { initiateCall } = useCall();
//   const [hosts, setHosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [callingHostId, setCallingHostId] = useState(null);

//   useEffect(() => {
//     loadHosts();
//   }, []);

//   const loadHosts = async () => {
//     try {
//       const response = await hostAPI.getAllHosts();
//       if (response.data.success) {
//         setHosts(response.data.hosts || []);
//       }
//     } catch (error) {
//       console.error("❌ Load hosts error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCallHost = async (host) => {
//     if (callingHostId) return;

//     setCallingHostId(host._id);

//     try {
//       // Check availability
//       const availabilityCheck = await callAPI.checkHostAvailability(host._id);
//       if (!availabilityCheck.available) {
//         alert("Host is currently busy or offline");
//         setCallingHostId(null);
//         return;
//       }

//       // Initiate call
//       const response = await callAPI.initiateCall(host._id);

//       if (response.success) {
//         // Set call in context
//         initiateCall(response.data);

//         // Navigate to video call screen
//         navigate("/video-call");
//       }
//     } catch (error) {
//       console.error("❌ Call host error:", error);
//       alert(error.response?.data?.message || "Failed to initiate call");
//     } finally {
//       setCallingHostId(null);
//     }
//   };

//   const getProfilePicture = (host) => {
//     if (host.profilePicture) {
//       return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${
//         host.profilePicture
//       }`;
//     }
//     return `https://ui-avatars.com/api/?name=${host.firstName}+${host.lastName}&background=random&color=fff&size=200`;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
//       {/* Header */}
//       <header className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Welcome, {user?.firstName}! 👋
//             </h1>
//             <p className="text-sm text-gray-600">Find hosts to connect with</p>
//           </div>
//           <button
//             onClick={() => {
//               logout();
//               navigate("/login");
//             }}
//             className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Info Banner */}
//         <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
//           <div className="flex items-center gap-3 mb-2">
//             <Video className="w-8 h-8" />
//             <h2 className="text-2xl font-bold">Video Call Hosts</h2>
//           </div>
//           <p className="text-blue-100">
//             Connect with verified hosts through secure video calls
//           </p>
//         </div>

//         {/* Hosts Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div
//                 key={i}
//                 className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
//               >
//                 <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
//                 <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                 <div className="h-3 bg-gray-300 rounded mb-4"></div>
//                 <div className="h-10 bg-gray-300 rounded"></div>
//               </div>
//             ))}
//           </div>
//         ) : hosts.length === 0 ? (
//           <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
//             <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">
//               No hosts available at the moment
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {hosts.map((host) => (
//               <div
//                 key={host._id}
//                 className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
//               >
//                 {/* Host Avatar */}
//                 <div className="relative mb-4">
//                   <div
//                     className={`w-24 h-24 mx-auto rounded-full p-1 ${
//                       host.isOnline
//                         ? "bg-gradient-to-r from-green-400 to-green-600"
//                         : "bg-gradient-to-r from-gray-300 to-gray-400"
//                     }`}
//                   >
//                     <img
//                       src={getProfilePicture(host)}
//                       alt={`${host.firstName} ${host.lastName}`}
//                       className="w-full h-full rounded-full object-cover bg-white"
//                     />
//                   </div>

//                   {/* Online Status */}
//                   {host.isOnline && (
//                     <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2">
//                       <span className="flex h-4 w-4">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Host Info */}
//                 <div className="text-center mb-4">
//                   <h3 className="text-xl font-bold text-gray-800 mb-1">
//                     {host.firstName} {host.lastName}
//                   </h3>
//                   <p
//                     className={`text-sm font-medium ${
//                       host.isOnline ? "text-green-600" : "text-gray-500"
//                     }`}
//                   >
//                     {host.isOnline ? "🟢 Online" : "⚪ Offline"}
//                   </p>
//                 </div>

//                 {/* Call Button */}
//                 <button
//                   onClick={() => handleCallHost(host)}
//                   disabled={!host.isOnline || callingHostId === host._id}
//                   className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
//                     host.isOnline
//                       ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
//                       : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   } ${callingHostId === host._id ? "animate-pulse" : ""}`}
//                 >
//                   <Phone className="w-5 h-5" />
//                   {callingHostId === host._id
//                     ? "Calling..."
//                     : "Start Video Call"}
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
// FILE: frontend/src/components/user/UserDashboard.jsx
// ✅ User Dashboard with Video Call Features

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Video, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCall } from "../../context/CallContext";
import { hostAPI } from "../../services/api";
import { callAPI } from "../../services/callService";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { initiateCall } = useCall();
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [callingHostId, setCallingHostId] = useState(null);

  useEffect(() => {
    loadHosts();
  }, []);

  const loadHosts = async () => {
    try {
      const response = await hostAPI.getAllHosts();
      if (response.data.success) {
        setHosts(response.data.hosts || []);
      }
    } catch (error) {
      console.error("❌ Load hosts error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallHost = async (host) => {
    if (callingHostId) return;

    setCallingHostId(host._id);

    try {
      // Check availability
      const availabilityCheck = await callAPI.checkHostAvailability(host._id);
      if (!availabilityCheck.available) {
        alert("Host is currently busy or offline");
        setCallingHostId(null);
        return;
      }

      // Initiate call
      const response = await callAPI.initiateCall(host._id);

      if (response.success) {
        // Set call in context
        initiateCall(response.data);

        // Navigate to video call screen
        navigate("/video-call");
      }
    } catch (error) {
      console.error("❌ Call host error:", error);
      alert(error.response?.data?.message || "Failed to initiate call");
    } finally {
      setCallingHostId(null);
    }
  };

  const getProfilePicture = (host) => {
    if (host.profilePicture) {
      return `${import.meta.env.VITE_API_URL || "http://localhost:3001"}${
        host.profilePicture
      }`;
    }
    return `https://ui-avatars.com/api/?name=${host.firstName}+${host.lastName}&background=random&color=fff&size=200`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {user?.firstName}! 👋
            </h1>
            <p className="text-sm text-gray-600">Find hosts to connect with</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Video Call Hosts</h2>
          </div>
          <p className="text-blue-100">
            Connect with verified hosts through secure video calls
          </p>
        </div>

        {/* Hosts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
              >
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-4"></div>
                <div className="h-10 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        ) : hosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No hosts available at the moment
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hosts.map((host) => (
              <div
                key={host._id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {/* Host Avatar */}
                <div className="relative mb-4">
                  <div
                    className={`w-24 h-24 mx-auto rounded-full p-1 ${
                      host.isOnline
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : "bg-gradient-to-r from-gray-300 to-gray-400"
                    }`}
                  >
                    <img
                      src={getProfilePicture(host)}
                      alt={`${host.firstName} ${host.lastName}`}
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>

                  {/* Online Status */}
                  {host.isOnline && (
                    <div className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2">
                      <span className="flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Host Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {host.firstName} {host.lastName}
                  </h3>
                  <p
                    className={`text-sm font-medium ${
                      host.isOnline ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {host.isOnline ? "🟢 Online" : "⚪ Offline"}
                  </p>
                </div>

                {/* Call Button */}
                <button
                  onClick={() => handleCallHost(host)}
                  disabled={!host.isOnline || callingHostId === host._id}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                    host.isOnline
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } ${callingHostId === host._id ? "animate-pulse" : ""}`}
                >
                  <Phone className="w-5 h-5" />
                  {callingHostId === host._id
                    ? "Calling..."
                    : "Start Video Call"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
