// FILE: frontend/src/hooks/useCallTimer.js
// ✅ Custom hook for call duration tracking

import { useState, useEffect, useRef } from "react";

export const useCallTimer = (isActive = false) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);

  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

        const hrs = Math.floor(elapsed / 3600);
        const mins = Math.floor((elapsed % 3600) / 60);
        const secs = elapsed % 60;

        setHours(hrs);
        setMinutes(mins);
        setSeconds(secs);

        // Calculate points (1 point per completed minute)
        setPointsEarned(Math.floor(elapsed / 60));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const formatTime = () => {
    const pad = (num) => String(num).padStart(2, "0");

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const getTotalSeconds = () => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  const reset = () => {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setPointsEarned(0);
    startTimeRef.current = null;
  };

  return {
    seconds,
    minutes,
    hours,
    pointsEarned,
    formattedTime: formatTime(),
    totalSeconds: getTotalSeconds(),
    reset,
  };
};
