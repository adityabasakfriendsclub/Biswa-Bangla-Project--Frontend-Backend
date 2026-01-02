import React from "react";
import { Clock } from "lucide-react";
import { useCallTimer } from "../../hooks/useCallTimer";

const CallTimer = ({ isActive = false, className = "" }) => {
  const { formattedTime, pointsEarned, minutes } = useCallTimer(isActive);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Timer Display */}
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full">
        <Clock className="w-5 h-5 text-white" />
        <span className="text-2xl font-mono font-bold text-white tracking-wider">
          {formattedTime}
        </span>
      </div>

      {/* Points Counter */}
      {isActive && minutes > 0 && (
        <div className="mt-2 text-center">
          <p className="text-sm text-green-400 font-semibold animate-pulse">
            +{pointsEarned} points earned
          </p>
          <p className="text-xs text-white/60">≈ ₹{pointsEarned * 8}</p>
        </div>
      )}
    </div>
  );
};

export default CallTimer;
