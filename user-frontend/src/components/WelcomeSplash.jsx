// src/components/WelcomeSplash.jsx
import { useState } from "react";

export default function WelcomeSplash({ onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={` inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 text-gray-400 hover:text-white transition-colors duration-300 group"
        aria-label="Close"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 relative"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center animate-fadeIn">
          {/* Company Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              <img
                src="/logo.png"
                alt="Biswa Bangla Social Networking Club Logo"
                className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Welcome Text */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
            Welcome To The Family Of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient">
              Biswa Bangla Social Networking Club
            </span>
          </h1>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-6 sm:my-8">
            <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <div className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>

          {/* Certification Text */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 md:mb-12 font-light px-4">
            Certified by State Government and Central Government
          </p>

          {/* Government Logos */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 mb-8">
            {/* State Government Logo */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border-2 border-green-500/30 rounded-full p-4 sm:p-6 group-hover:border-green-500/60 transition-all duration-300">
                  <img
                    src="/government-of-west-bengal-logo.png"
                    alt="State Government Logo"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 font-medium">
                State Government
              </p>
            </div>

            {/* Center Decorative Element */}
            <div className="hidden sm:flex flex-col items-center gap-2">
              <div className="w-px h-12 md:h-16 bg-gradient-to-b from-transparent via-cyan-500 to-transparent"></div>
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <div className="w-px h-12 md:h-16 bg-gradient-to-t from-transparent via-cyan-500 to-transparent"></div>
            </div>

            {/* Central Government Logo */}
            <div className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                <div className="relative bg-white/5 backdrop-blur-sm border-2 border-orange-500/30 rounded-full p-4 sm:p-6 group-hover:border-orange-500/60 transition-all duration-300">
                  <img
                    src="/government-of-india-logo.png"
                    alt="Central Government Logo"
                    className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 font-medium">
                Central Government
              </p>
            </div>
          </div>

          {/* 🔐 CERTIFICATES SECTION */}
          <div className="flex flex-col lg:flex-row gap-6 mt-10 mb-10 px-4">
            {/* Central Government Certificate (GST) */}
            <div className="flex-1 min-w-72 glass-card shadow-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/30">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-400">
                    Central Government
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm md:text-base mb-2">
                  Government of India – GST Registration Certificate
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  Form: GST REG-06 • Reg No:{" "}
                  <span className="font-mono">19BGVPM9841D1ZP</span>
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-900 mb-3">
                  <img
                    src="/gst-certificate.jpg"
                    alt="GST Registration Certificate"
                    className="object-cover w-full h-full"
                  />
                </div>
                <a
                  href="/gst-certificate.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-md"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Certificate
                </a>
                <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.707-7.707a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ✔ Verified
                </div>
              </div>
            </div>

            {/* State Government Certificate (Udyam) */}
            <div className="flex-1 min-w-72 glass-card shadow-lg rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-green-500/30">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-gray-400">
                    State Government
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm md:text-base mb-2">
                  Udyam Registration Certificate
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                  UDYAM No:{" "}
                  <span className="font-mono">UDYAM-WB-14-0244369</span>
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-900 mb-3">
                  <img
                    src="/udyams-certificates.jpg"
                    alt="Udyam Registration Certificate"
                    className="object-cover w-full h-full"
                  />
                </div>
                <a
                  href="/udyams-certificates.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Certificate
                </a>
                <div className="mt-2 flex items-center gap-1 text-xs text-blue-400">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 011.414 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.707-7.707a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  ✔ Verified
                </div>
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <button
            onClick={handleClose}
            className="group relative mt-6 sm:mt-8 overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              Enter Website
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          </button>

          {/* Bottom Badge */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-xs sm:text-sm text-gray-500 font-light">
              Verified & Certified Platform
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes twinkle {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
