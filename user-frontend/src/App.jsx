import React, { useState, useEffect } from "react";
import WelcomeSplash from "./pages/WelcomeSplash";

// User Pages
import UserLogin from "./pages/user/UserLogin";
import SignUp from "./pages/user/SignUp";
import VerifyOTP from "./pages/user/VerifyOTP";
import ForgotPassword from "./pages/user/ForgotPassword";
import VerifyResetOTP from "./pages/user/VerifyResetOTP";
import HomePage from "./pages/HomePage";
import VideoCallPage from "./pages/VideoCallPage";
import AccountPage from "./pages/AccountPage";
import UserProfilePage from "./pages/UserProfilePage";
import TalktimePage from "./pages/TalktimePage";
import TalktimeTransactionPage from "./pages/TalktimeTransactionPage";
import GrievanceFormPage from "./pages/GrievanceFormPage";
import SettingsPage from "./pages/SettingsPage";

// ✅ Legal Pages (Accessible WITHOUT login)
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/legal/TermsConditionsPage";
import ShippingPolicyPage from "./pages/legal/ShippingPolicyPage";
import CommunityGuidelinesPage from "./pages/legal/CommunityGuidelinesPage";
import ChildrenMinorsPage from "./pages/legal/ChildrenMinorsPage";
import ContactUsPage from "./pages/legal/ContactUsPage";
import UsagePolicyPage from "./pages/legal/UsagePolicyPage";

// Admin Pages
import AdminLogin from "./pages/Login";
import AdminDashboard from "./pages/Dashboard";

export default function App() {
  const [mode, setMode] = useState("user");
  const [currentPage, setCurrentPage] = useState("login"); // ✅ Changed from "home" to "login"
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [callData, setCallData] = useState(null);
  const [tempPhone, setTempPhone] = useState("");

  // 🔥 Welcome Splash State
  const [showSplash, setShowSplash] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for admin session
        const adminToken = localStorage.getItem("adminToken");
        const adminData = localStorage.getItem("adminData");

        if (adminToken && adminData) {
          const parsedAdmin = JSON.parse(adminData);
          setAdmin(parsedAdmin);
          setMode("admin");
          setCurrentPage("dashboard");
          setShowSplash(false);
          setIsInitializing(false);
          return;
        }

        // Check for user session
        const userToken =
          localStorage.getItem("token") || localStorage.getItem("userToken");
        const userData = localStorage.getItem("userData");

        if (
          userToken &&
          userData &&
          userData !== "undefined" &&
          userData !== "null"
        ) {
          try {
            const parsedUser = JSON.parse(userData);
            console.log("✅ Loaded user from localStorage:", parsedUser);
            setUser(parsedUser);
            setCurrentPage("home"); // If logged in, go to home after splash
          } catch (parseError) {
            console.error("❌ Error parsing userData:", parseError);
            localStorage.clear();
            setCurrentPage("login"); // ✅ Changed from "home" to "login"
          }
        } else {
          localStorage.removeItem("userData");
          localStorage.removeItem("token");
          localStorage.removeItem("userToken");
          setCurrentPage("login"); // ✅ Changed from "home" to "login"
        }
      } catch (err) {
        console.error("Error initializing app state:", err);
        localStorage.clear();
        setCurrentPage("login"); // ✅ Changed from "home" to "login"
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  // ✅ Handle splash close - navigate to login page
  const handleSplashClose = () => {
    setShowSplash(false);
    // After splash closes, if user is not logged in, they'll see login page
    if (!user) {
      setCurrentPage("login");
    }
  };

  // User Auth Handlers
  const handleUserLogin = (userData) => {
    try {
      console.log("🔐 Login handler received:", userData);

      if (!userData || typeof userData !== "object") {
        console.error("Invalid user data");
        alert("❌ Invalid login data");
        return;
      }

      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem(
        "token",
        userData.token || localStorage.getItem("userToken"),
      );

      setUser(userData);
      setCurrentPage("home");

      console.log("✅ User logged in successfully:", userData);
    } catch (err) {
      console.error("Login error:", err);
      alert("Failed to save login data");
    }
  };

  const handleSignUpSuccess = (phone) => {
    setTempPhone(phone);
    setCurrentPage("verifyOTP");
  };

  const handleOTPVerified = () => {
    setCurrentPage("login");
    alert("✅ Account verified! Please login.");
  };

  const handleForgotPasswordSubmit = (phone) => {
    setTempPhone(phone);
    setCurrentPage("verifyResetOTP");
  };

  const handleResetOTPVerified = () => {
    setCurrentPage("login");
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    setUser(null);
    setCurrentPage("login"); // ✅ Changed from "home" to "login"
  };

  // Admin Auth Handlers
  const handleAdminLogin = () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const adminData = localStorage.getItem("adminData");

      if (adminToken && adminData) {
        const parsedAdmin = JSON.parse(adminData);
        setAdmin(parsedAdmin);
        setMode("admin");
        setCurrentPage("dashboard");
      }
    } catch (err) {
      console.error("Admin login error:", err);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setAdmin(null);
    setMode("user");
    setCurrentPage("login"); // ✅ Changed from "home" to "login"
  };

  // Video Call Handlers
  const handleStartCall = (data) => {
    setCallData(data);
    setCurrentPage("videoCall");
  };

  const handleEndCall = () => {
    setCallData(null);
    setCurrentPage("home");
  };

  // Navigation
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Handle user profile update
  const handleUserUpdate = (updatedUser) => {
    const newUserData = { ...user, ...updatedUser };
    setUser(newUserData);
    localStorage.setItem("userData", JSON.stringify(newUserData));
  };

  const handleBalanceUpdate = (newBalance) => {
    if (user) {
      const updatedUser = { ...user, walletBalance: newBalance };
      setUser(updatedUser);
      localStorage.setItem("userData", JSON.stringify(updatedUser));
    }
  };

  // === LOADING STATE ===
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  // === ADMIN MODE ===
  if (mode === "admin") {
    if (!admin) {
      return <AdminLogin onLoginSuccess={handleAdminLogin} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // ✅ LEGAL PAGES (Available WITHOUT login - from WelcomeSplash OR Settings)
  const legalPages = [
    "privacy-policy",
    "terms-and-conditions",
    "usage-policy",
    "shipping-policy",
    "community-guidelines",
    "children-and-minors",
    "contact-us",
  ];

  if (legalPages.includes(currentPage)) {
    // ✅ When back is clicked, return to WelcomeSplash directly
    const handleBackFromLegal = () => {
      setCurrentPage("welcome"); // Navigate back to welcome page
    };

    switch (currentPage) {
      case "usage-policy":
        return <UsagePolicyPage onBack={handleBackFromLegal} />;
      case "privacy-policy":
        return <PrivacyPolicyPage onBack={handleBackFromLegal} />;
      case "terms-and-conditions":
        return <TermsConditionsPage onBack={handleBackFromLegal} />;
      case "shipping-policy":
        return <ShippingPolicyPage onBack={handleBackFromLegal} />;
      case "community-guidelines":
        return <CommunityGuidelinesPage onBack={handleBackFromLegal} />;
      case "children-and-minors":
        return <ChildrenMinorsPage onBack={handleBackFromLegal} />;
      case "contact-us":
        return <ContactUsPage onBack={handleBackFromLegal} />;
      default:
        break;
    }
  }

  // === WELCOME SPLASH ===
  if (showSplash || currentPage === "welcome") {
    return (
      <WelcomeSplash onClose={handleSplashClose} onNavigate={navigateTo} />
    );
  }

  // === AUTH PAGES (For non-logged-in users) ===
  if (!user) {
    switch (currentPage) {
      case "login":
        return (
          <UserLogin
            onLoginSuccess={handleUserLogin}
            onNavigateToSignUp={() => navigateTo("signup")}
            onNavigateToForgotPassword={() => navigateTo("forgotPassword")}
            onExit={() => setMode("admin")}
          />
        );

      case "signup":
        return (
          <SignUp
            onSignUpSuccess={handleSignUpSuccess}
            onNavigateToLogin={() => navigateTo("login")}
            onExit={() => setMode("admin")}
          />
        );

      case "verifyOTP":
        return (
          <VerifyOTP
            phone={tempPhone}
            onVerifySuccess={handleOTPVerified}
            onExit={() => setMode("admin")}
          />
        );

      case "forgotPassword":
        return (
          <ForgotPassword
            onBackToLogin={() => navigateTo("login")}
            onNavigateToVerifyReset={handleForgotPasswordSubmit}
            onExit={() => setMode("admin")}
          />
        );

      case "verifyResetOTP":
        return (
          <VerifyResetOTP
            phone={tempPhone}
            onVerifySuccess={handleResetOTPVerified}
            onBackToForgot={() => navigateTo("forgotPassword")}
            onExit={() => setMode("admin")}
          />
        );

      // ✅ DEFAULT: Show login page instead of home
      default:
        return (
          <UserLogin
            onLoginSuccess={handleUserLogin}
            onNavigateToSignUp={() => navigateTo("signup")}
            onNavigateToForgotPassword={() => navigateTo("forgotPassword")}
            onExit={() => setMode("admin")}
          />
        );
    }
  }

  // === LOGGED IN USER PAGES ===
  switch (currentPage) {
    case "home":
      return (
        <HomePage
          user={user}
          onStartCall={handleStartCall}
          onNavigate={navigateTo}
          onLogout={handleUserLogout}
        />
      );

    case "videoCall":
      return (
        <VideoCallPage
          user={user}
          callData={callData}
          onEndCall={handleEndCall}
        />
      );

    case "account":
      return (
        <AccountPage
          user={user}
          onNavigate={navigateTo}
          onLogout={handleUserLogout}
        />
      );

    case "profile":
      return (
        <UserProfilePage
          user={user}
          onBack={() => navigateTo("account")}
          onUpdate={handleUserUpdate}
        />
      );

    case "talktime":
      return (
        <TalktimePage
          user={user}
          onBack={() => navigateTo("account")}
          onBalanceUpdate={handleBalanceUpdate}
        />
      );

    case "transaction":
      return (
        <TalktimeTransactionPage
          user={user}
          onBack={() => navigateTo("account")}
        />
      );

    case "report":
      return (
        <GrievanceFormPage user={user} onBack={() => navigateTo("account")} />
      );

    case "settings":
      return (
        <SettingsPage
          onBack={() => navigateTo("account")}
          onDeleteAccount={handleUserLogout}
          onNavigate={navigateTo}
        />
      );

    default:
      return (
        <HomePage
          user={user}
          onStartCall={handleStartCall}
          onNavigate={navigateTo}
          onLogout={handleUserLogout}
        />
      );
  }
}
