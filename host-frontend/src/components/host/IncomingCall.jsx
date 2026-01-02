// FILE: frontend/src/components/host/IncomingCall.jsx
// PURPOSE: Incoming call notification UI with accept/reject buttons

import React from "react";
import { Phone, PhoneOff, User } from "lucide-react";

const IncomingCall = ({ caller, onAccept, onReject }) => {
  return (
    <div className="mx-6 my-4 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-6 shadow-2xl animate-pulse-slow">
      {/* Caller Info */}
      <div className="flex flex-col items-center mb-6">
        {/* Caller Avatar */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 p-1 animate-bounce-slow">
            {caller.profilePicture ? (
              <img
                src={`http://localhost:3000${caller.profilePicture}`}
                alt={caller.name}
                className="w-full h-full rounded-full object-cover bg-white"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          {/* Ringing Indicator */}
          <div className="absolute -inset-2 rounded-full border-4 border-green-500 animate-ping"></div>
        </div>

        {/* Caller Name */}
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          {caller.name || "Unknown Caller"}
        </h3>

        {/* Calling Text */}
        <p className="text-lg text-gray-600 animate-pulse">
          Calling...........
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-8">
        {/* Reject Button */}
        <button
          onClick={onReject}
          className="flex flex-col items-center gap-2 group"
          aria-label="Reject call"
        >
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-red-600 group-hover:scale-110 transition-all duration-200">
            <PhoneOff className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm font-semibold text-red-600">Reject</span>
        </button>

        {/* Accept Button */}
        <button
          onClick={onAccept}
          className="flex flex-col items-center gap-2 group"
          aria-label="Accept call"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:bg-green-600 group-hover:scale-110 transition-all duration-200 animate-pulse">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <span className="text-sm font-semibold text-green-600">Accept</span>
        </button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default IncomingCall;
