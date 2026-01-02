// FILE: frontend/src/components/common/Logo.jsx
// ✅ Reusable Logo Component with multiple fallback strategies

import React, { useState } from "react";

export const AppLogo = ({ size = "h-16 w-16" }) => {
  const [failed, setFailed] = useState(false);

  // Try multiple paths
  const imagePaths = [
    "/host/logo-left.png",
    "/logo-left.png",
    `${window.location.origin}/host/logo-left.png`,
    `${window.location.origin}/logo-left.png`,
  ];

  const [currentPath, setCurrentPath] = useState(0);

  const handleError = () => {
    if (currentPath < imagePaths.length - 1) {
      setCurrentPath((prev) => prev + 1);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div
        className={`${size} bg-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl`}
      >
        🎯
      </div>
    );
  }

  return (
    <img
      src={imagePaths[currentPath]}
      alt="App Logo"
      className={`${size} object-contain`}
      onError={handleError}
    />
  );
};

export const ClubLogo = ({ size = "h-16 w-16" }) => {
  const [failed, setFailed] = useState(false);

  const imagePaths = [
    "/host/club-logo.png",
    "/club-logo.png",
    `${window.location.origin}/host/club-logo.png`,
    `${window.location.origin}/club-logo.png`,
  ];

  const [currentPath, setCurrentPath] = useState(0);

  const handleError = () => {
    if (currentPath < imagePaths.length - 1) {
      setCurrentPath((prev) => prev + 1);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div
        className={`${size} bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl`}
      >
        ♣️
      </div>
    );
  }

  return (
    <img
      src={imagePaths[currentPath]}
      alt="Club Logo"
      className={`${size} object-contain`}
      onError={handleError}
    />
  );
};

// USAGE in HostHome.jsx:
// import { AppLogo, ClubLogo } from '../common/Logo';
//
// <AppLogo size="h-12 w-12" />
// <ClubLogo size="h-14 w-14" />
