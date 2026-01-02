// // FILE: frontend/src/components/host/HostSlider.jsx
// // ✅ FIXED: Removed jsx attribute from style tag

// import React, { useState, useEffect } from "react";
// import { hostAPI } from "../../services/api";
// import { socket } from "../../services/socket";

// const HostSlider = ({ currentUserId }) => {
//   const [hosts, setHosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadHosts();
//     setupSocketListeners();
//   }, []);

//   const loadHosts = async () => {
//     try {
//       const response = await hostAPI.getAllHosts();
//       if (response.data.success) {
//         const filteredHosts = response.data.hosts
//           .filter((host) => host._id !== currentUserId)
//           .slice(0, 10);
//         setHosts(filteredHosts);
//       }
//     } catch (error) {
//       console.error("Failed to load hosts:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupSocketListeners = () => {
//     socket.on("host-status-updated", (data) => {
//       setHosts((prevHosts) =>
//         prevHosts.map((host) =>
//           host._id === data.hostId ? { ...host, isOnline: data.isOnline } : host
//         )
//       );
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex gap-4 overflow-x-auto pb-4">
//         {[1, 2, 3, 4].map((i) => (
//           <div key={i} className="flex flex-col items-center flex-shrink-0">
//             <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
//             <div className="w-16 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (hosts.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500">No other hosts available</p>
//       </div>
//     );
//   }

//   const getImageURL = (profilePicture, firstName, lastName) => {
//     if (profilePicture) {
//       const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
//       return `${baseURL}${profilePicture}`;
//     }
//     // Fallback avatar
//     return `https://ui-avatars.com/api/?name=${encodeURIComponent(
//       firstName
//     )}+${encodeURIComponent(lastName)}&background=random&color=fff&size=200`;
//   };

//   return (
//     <div className="relative">
//       <h3 className="text-lg font-bold text-gray-800 mb-4">Active Hosts</h3>

//       <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
//         {hosts.map((host) => (
//           <div
//             key={host._id}
//             className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:opacity-80 transition"
//           >
//             {/* Profile Image with Status Border */}
//             <div
//               className={`relative w-20 h-20 rounded-full p-1 ${
//                 host.isOnline
//                   ? "bg-gradient-to-r from-green-400 to-green-600"
//                   : "bg-gradient-to-r from-red-400 to-red-600"
//               }`}
//             >
//               <img
//                 src={getImageURL(
//                   host.profilePicture,
//                   host.firstName,
//                   host.lastName
//                 )}
//                 alt={`${host.firstName} ${host.lastName}`}
//                 className="w-full h-full rounded-full object-cover bg-white"
//                 onError={(e) => {
//                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
//                     host.firstName
//                   )}+${encodeURIComponent(
//                     host.lastName
//                   )}&background=random&color=fff&size=200`;
//                 }}
//               />

//               {/* Online Status Indicator */}
//               {host.isOnline && (
//                 <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
//               )}
//             </div>

//             {/* Host Name */}
//             <p className="text-sm font-semibold text-gray-800 mt-2 text-center max-w-[80px] truncate">
//               {host.firstName}
//             </p>

//             {/* Status Text */}
//             <p
//               className={`text-xs font-medium ${
//                 host.isOnline ? "text-green-600" : "text-red-600"
//               }`}
//             >
//               {host.isOnline ? "Online" : "Offline"}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* ✅ FIXED: Removed jsx attribute */}
//       <style>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default HostSlider;

// new2
// FILE: frontend/src/components/host/HostSlider.jsx
// ✅ COMPLETE VERSION - Show active hosts with online status

import React, { useState, useEffect } from "react";
import { hostAPI } from "../../services/api";
import { socket } from "../../services/socket";

const HostSlider = ({ currentUserId }) => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHosts();
    setupSocketListeners();
  }, []);

  const loadHosts = async () => {
    try {
      const response = await hostAPI.getAllHosts();
      if (response.data.success) {
        const filteredHosts = response.data.hosts
          .filter((host) => host._id !== currentUserId)
          .slice(0, 10);
        setHosts(filteredHosts);
      }
    } catch (error) {
      console.error("Failed to load hosts:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socket.on("host-status-updated", (data) => {
      setHosts((prevHosts) =>
        prevHosts.map((host) =>
          host._id === data.hostId ? { ...host, isOnline: data.isOnline } : host
        )
      );
    });
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (hosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No other hosts available</p>
      </div>
    );
  }

  const getImageURL = (profilePicture, firstName, lastName) => {
    if (profilePicture) {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      return `${baseURL}${profilePicture}`;
    }
    // Fallback avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      firstName
    )}+${encodeURIComponent(lastName)}&background=random&color=fff&size=200`;
  };

  return (
    <div className="relative">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Active Hosts ({hosts.length})
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {hosts.map((host) => (
          <div
            key={host._id}
            className="flex flex-col items-center flex-shrink-0 cursor-pointer hover:opacity-80 transition"
          >
            {/* Profile Image with Status Border */}
            <div
              className={`relative w-20 h-20 rounded-full p-1 ${
                host.isOnline
                  ? "bg-gradient-to-r from-green-400 to-green-600"
                  : "bg-gradient-to-r from-red-400 to-red-600"
              }`}
            >
              <img
                src={getImageURL(
                  host.profilePicture,
                  host.firstName,
                  host.lastName
                )}
                alt={`${host.firstName} ${host.lastName}`}
                className="w-full h-full rounded-full object-cover bg-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    host.firstName
                  )}+${encodeURIComponent(
                    host.lastName
                  )}&background=random&color=fff&size=200`;
                }}
              />

              {/* Online Status Indicator */}
              {host.isOnline && (
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>

            {/* Host Name */}
            <p className="text-sm font-semibold text-gray-800 mt-2 text-center max-w-[80px] truncate">
              {host.firstName}
            </p>

            {/* Status Text */}
            <p
              className={`text-xs font-medium ${
                host.isOnline ? "text-green-600" : "text-red-600"
              }`}
            >
              {host.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        ))}
      </div>

      {/* Hide scrollbar */}
      <style>{`
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
};

export default HostSlider;
