// // import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
//   Link,
// } from "react-router-dom";
// import { AuthProvider, useAuth } from "./context/AuthContext";

// /* ===================== AUTH PAGES ===================== */
// import Login from "./components/auth/Login";
// import Signup from "./components/auth/Signup";
// import ForgotPassword from "./components/auth/ForgotPassword";
// import VerifyOtp from "./components/auth/VerifyOtp";
// import VerifyReset from "./components/auth/VerifyReset";
// import HostLogin from "./components/auth/HostLogin";

// /* ===================== DASHBOARD ===================== */
// import Dashboard from "./components/Dashboard";

// /* ===================== HOST PAGES ===================== */
// import HostHome from "./components/host/HostHome";
// import HostProfilePictureUpload from "./components/profile/HostProfilePictureUpload";
// import HostAccount from "./components/host/account/HostAccount";
// import MyImages from "./components/host/account/MyImages";
// import MyKYC from "./components/host/account/MyKYC";
// import MyAuditionVideo from "./components/host/account/MyAuditionVideo";
// import BankDetails from "./components/host/account/BankDetails";
// import WithdrawMoney from "./components/host/account/WithdrawMoney";
// import WithdrawalHistory from "./components/host/account/WithdrawalHistory";
// import MyVideos from "./components/host/account/MyVideos";

// /* ===================== LOADING ===================== */
// const LoadingScreen = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <p>Loading...</p>
//   </div>
// );

// /* ===================== ROUTE GUARDS ===================== */
// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useAuth();
//   if (loading) return <LoadingScreen />;
//   return isAuthenticated() ? children : <Navigate to="/login" replace />;
// };

// const HostRoute = ({ children }) => {
//   const { isAuthenticated, user, loading } = useAuth();
//   if (loading) return <LoadingScreen />;
//   if (!isAuthenticated()) return <Navigate to="/login" replace />;
//   if (!user?.isHost) return <Navigate to="/dashboard" replace />;
//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, user, loading } = useAuth();
//   if (loading) return <LoadingScreen />;
//   if (isAuthenticated()) {
//     return user?.isHost ? (
//       <Navigate to="/host/home" replace />
//     ) : (
//       <Navigate to="/dashboard" replace />
//     );
//   }
//   return children;
// };

// const AuthRedirect = () => {
//   const { isAuthenticated, user, loading } = useAuth();
//   if (loading) return <LoadingScreen />;
//   if (!isAuthenticated()) return <Navigate to="/login" replace />;
//   return user?.isHost ? (
//     <Navigate to="/host/home" replace />
//   ) : (
//     <Navigate to="/dashboard" replace />
//   );
// };

// /* ===================== APP ===================== */
// function App() {
//   return (
//     <AuthProvider>
//       <Router basename="/host">
//         <Routes>
//           {/* PUBLIC */}
//           <Route
//             path="/login"
//             element={
//               <PublicRoute>
//                 <Login />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/signup"
//             element={
//               <PublicRoute>
//                 <Signup />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/forgot-password"
//             element={
//               <PublicRoute>
//                 <ForgotPassword />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/verify-otp"
//             element={
//               <PublicRoute>
//                 <VerifyOtp />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/verify-reset"
//             element={
//               <PublicRoute>
//                 <VerifyReset />
//               </PublicRoute>
//             }
//           />
//           <Route
//             path="/host-login"
//             element={
//               <PublicRoute>
//                 <HostLogin />
//               </PublicRoute>
//             }
//           />

//           {/* USER */}
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* HOST */}
//           <Route
//             path="/host/home"
//             element={
//               <HostRoute>
//                 <HostHome />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account"
//             element={
//               <HostRoute>
//                 <HostAccount />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/profile/upload-picture"
//             element={
//               <HostRoute>
//                 <HostProfilePictureUpload />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account/images"
//             element={
//               <HostRoute>
//                 <MyImages />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account/kyc"
//             element={
//               <HostRoute>
//                 <MyKYC />
//               </HostRoute>
//             }
//           />
//           {/* for videos */}
//           <Route
//             path="/host/account/myvideos"
//             element={
//               <HostRoute>
//                 <MyVideos />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account/audition"
//             element={
//               <HostRoute>
//                 <MyAuditionVideo />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account/bank"
//             element={
//               <HostRoute>
//                 <BankDetails />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account/withdraw"
//             element={
//               <HostRoute>
//                 <WithdrawMoney />
//               </HostRoute>
//             }
//           />
//           <Route
//             path="/host/account/history"
//             element={
//               <HostRoute>
//                 <WithdrawalHistory />
//               </HostRoute>
//             }
//           />

//           {/* ROOT */}
//           <Route path="/" element={<AuthRedirect />} />

//           {/* 404 */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

// new2
// FILE: frontend/src/App.jsx
// ✅ COMPLETE VERSION - With CallProvider and Video Call Routes

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CallProvider } from "./context/CallContext"; // ✅ Import CallProvider

/* ===================== AUTH PAGES ===================== */
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import VerifyOtp from "./components/auth/VerifyOtp";
import VerifyReset from "./components/auth/VerifyReset";
import HostLogin from "./components/auth/HostLogin";

/* ===================== DASHBOARD ===================== */
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";

/* ===================== HOST PAGES ===================== */
import HostHome from "./components/host/HostHome";
import HostProfilePictureUpload from "./components/profile/HostProfilePictureUpload";
import HostAccount from "./components/host/account/HostAccount";
import MyImages from "./components/host/account/MyImages";
import MyKYC from "./components/host/account/MyKYC";
import MyAuditionVideo from "./components/host/account/MyAuditionVideo";
import BankDetails from "./components/host/account/BankDetails";
import WithdrawMoney from "./components/host/account/WithdrawMoney";
import WithdrawalHistory from "./components/host/account/WithdrawalHistory";
import MyVideos from "./components/host/account/MyVideos";

/* ===================== VIDEO CALL COMPONENTS ===================== */
import VideoCallScreen from "./components/video/VideoCallScreen";
import IncomingCallModal from "./components/video/IncomingCallModal";
import UserDashboard from "./components/user/UserDashboard";

/* ===================== LOADING UI ===================== */
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

/* ===================== PROTECTED ROUTE ===================== */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

/* ===================== HOST ONLY ROUTE ===================== */
const HostRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isHost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">Only hosts can access this page.</p>
          <Link
            to="/dashboard"
            className="bg-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

/* ===================== PUBLIC ROUTE ===================== */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (isAuthenticated()) {
    return user?.isHost ? (
      <Navigate to="/host/home" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return children;
};

/* ===================== SMART ROOT REDIRECT ===================== */
const AuthRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return user?.isHost ? (
    <Navigate to="/host/home" replace />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

/* ===================== APP ===================== */
function App() {
  return (
    <AuthProvider>
      <CallProvider>
        {" "}
        {/* ✅ Wrap entire app with CallProvider */}
        <Router basename="/host">
          {/* ✅ IncomingCallModal shows automatically when host receives call */}
          <IncomingCallModal />

          <Routes>
            {/* -------- PUBLIC ROUTES -------- */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              }
            />

            <Route
              path="/verify-reset"
              element={
                <PublicRoute>
                  <VerifyReset />
                </PublicRoute>
              }
            />

            <Route
              path="/host-login"
              element={
                <PublicRoute>
                  <HostLogin />
                </PublicRoute>
              }
            />

            {/* -------- USER DASHBOARD -------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ NEW: User Dashboard with Video Call Features */}
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* ✅ NEW: Video Call Screen */}
            <Route
              path="/video-call"
              element={
                <ProtectedRoute>
                  <VideoCallScreen />
                </ProtectedRoute>
              }
            />

            {/* -------- HOST ROUTES -------- */}
            <Route
              path="/host/home"
              element={
                <HostRoute>
                  <HostHome />
                </HostRoute>
              }
            />

            <Route
              path="/host/account"
              element={
                <HostRoute>
                  <HostAccount />
                </HostRoute>
              }
            />

            <Route
              path="/host/profile/upload-picture"
              element={
                <HostRoute>
                  <HostProfilePictureUpload />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/images"
              element={
                <HostRoute>
                  <MyImages />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/myvideos"
              element={
                <HostRoute>
                  <MyVideos />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/kyc"
              element={
                <HostRoute>
                  <MyKYC />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/audition"
              element={
                <HostRoute>
                  <MyAuditionVideo />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/bank"
              element={
                <HostRoute>
                  <BankDetails />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/withdraw"
              element={
                <HostRoute>
                  <WithdrawMoney />
                </HostRoute>
              }
            />

            <Route
              path="/host/account/history"
              element={
                <HostRoute>
                  <WithdrawalHistory />
                </HostRoute>
              }
            />

            {/* -------- ROOT -------- */}
            <Route path="/" element={<AuthRedirect />} />

            {/* -------- 404 -------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CallProvider>{" "}
      {/* ✅ Close CallProvider */}
    </AuthProvider>
  );
}

export default App;
