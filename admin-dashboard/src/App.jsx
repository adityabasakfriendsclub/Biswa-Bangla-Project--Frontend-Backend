import { useState, useEffect } from "react";
import AdminLogin from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserLogin from "./pages/user/UserLogin";
import SignUp from "./pages/user/SignUp";
import VerifyOTP from "./pages/user/VerifyOTP";
import ForgotPassword from "./pages/user/ForgotPassword";
import VerifyResetOTP from "./pages/user/VerifyResetOTP";
import UserHome from "./pages/user/UserHome";
import Launching from "./pages/user/launching";

function App() {
  const [appMode, setAppMode] = useState("user");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userPage, setUserPage] = useState("signup");
  const [userPhone, setUserPhone] = useState("");
  const [resetPhone, setResetPhone] = useState("");

  useEffect(() => {
    // OPTION 1: Comment out auto-authentication to always show login
    /*
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (adminToken) {
      setAppMode("admin");
      setIsAuthenticated(true);
    } else if (userToken) {
      setAppMode("user");
      setIsAuthenticated(true);
    }
    */

    // OPTION 2: Or clear tokens on app load (forces login every time)
    // localStorage.removeItem("adminToken");
    // localStorage.removeItem("userToken");

    setIsLoading(false);
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAuthenticated(true);
    setAppMode("admin");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setIsAuthenticated(false);
  };

  const handleUserLoginSuccess = () => {
    setIsAuthenticated(true);
    setAppMode("user");
    setUserPage("home");
  };

  const handleUserLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUserPage("login");
  };

  const handleSignUpSuccess = (phone) => {
    setUserPhone(phone);
    setUserPage("verify");
  };

  const handleVerifySuccess = () => {
    setUserPage("login");
  };

  const handleForgotPasswordSuccess = (phone) => {
    setResetPhone(phone);
    setUserPage("verify-reset");
  };

  const handleResetVerifySuccess = () => {
    setUserPage("login");
  };

  const handleExitToAdmin = () => {
    if (window.confirm("Exit to Admin Mode?")) {
      setAppMode("admin");
      setUserPage("signup");
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-600">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Admin Flow
  if (appMode === "admin") {
    return isAuthenticated ? (
      <div>
        <Dashboard onLogout={handleAdminLogout} />
        <button
          onClick={() => setAppMode("user")}
          className="fixed top-4 left-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm shadow-lg font-medium"
        >
          ← User Mode
        </button>
      </div>
    ) : (
      <div>
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
        <button
          onClick={() => setAppMode("user")}
          className="fixed top-4 left-4 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm shadow-lg font-medium"
        >
          ← User Mode
        </button>
      </div>
    );
  }

  // User Flow
  if (isAuthenticated && userPage === "home") {
    return (
      <UserHome
        onLogout={handleUserLogout}
        onExitToAdmin={() => {
          if (window.confirm("Exit to Admin Mode?")) {
            handleUserLogout();
            setAppMode("admin");
          }
        }}
      />
    );
  }

  return (
    <div>
      {userPage === "login" && (
        <UserLogin
          onLoginSuccess={handleUserLoginSuccess}
          onNavigateToSignUp={() => setUserPage("signup")}
          onNavigateToForgotPassword={() => setUserPage("forgot")}
          onExit={handleExitToAdmin}
        />
      )}
      {/* {userPage === "signup" && (
        <SignUp
          onSignUpSuccess={handleSignUpSuccess}
          onNavigateToLogin={() => setUserPage("login")}
          onExit={handleExitToAdmin}
        />
      )} */}
      {/* for lanching */}
      {userPage === "signup" && <Launching />}
      {/* end */}
      {userPage === "verify" && (
        <VerifyOTP
          phone={userPhone}
          onVerifySuccess={handleVerifySuccess}
          onExit={handleExitToAdmin}
        />
      )}
      {userPage === "forgot" && (
        <ForgotPassword
          onBackToLogin={() => setUserPage("login")}
          onNavigateToVerifyReset={handleForgotPasswordSuccess}
          onExit={handleExitToAdmin}
        />
      )}
      {userPage === "verify-reset" && (
        <VerifyResetOTP
          phone={resetPhone}
          onVerifySuccess={handleResetVerifySuccess}
          onBackToForgot={() => setUserPage("forgot")}
          onExit={handleExitToAdmin}
        />
      )}
    </div>
  );
}

export default App;
