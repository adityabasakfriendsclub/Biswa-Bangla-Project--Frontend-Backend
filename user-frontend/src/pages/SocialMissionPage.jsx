// src/pages/SocialMissionPage.jsx
import { useState } from "react";

export default function SocialMissionPage({ onClose }) {
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
      className={` inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 transition-opacity duration-500 overflow-y-auto custom-scrollbar ${
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
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-20 text-gray-400 hover:text-white transition-colors duration-300 group"
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
      <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center animate-fadeIn">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
              <img
                src="/logo.png"
                alt="Biswa Bangla Social Networking Club Logo"
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-4">
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

          {/* Mission Statement */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-10 max-w-4xl mx-auto mb-8 border border-white/20">
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl sm:text-6xl animate-pulse">❤️</div>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              Our Social Mission
            </h2>

            <div className="space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed text-left">
              <p className="text-center">
                <span className="font-semibold text-cyan-400">
                  Biswa Bangla Social Networking Club
                </span>{" "}
                uses this online calling platform to generate revenue that helps
                support people in society who are living without{" "}
                <span className="font-semibold text-yellow-400">food</span>,{" "}
                <span className="font-semibold text-green-400">
                  medical treatment
                </span>
                , or a{" "}
                <span className="font-semibold text-blue-400">proper home</span>
                .
              </p>

              {/* Impact Areas */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                {/* Food Support */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 text-center">
                  <div className="text-4xl mb-3">🍲</div>
                  <h3 className="text-lg font-bold text-yellow-400 mb-2">
                    Food Support
                  </h3>
                  <p className="text-sm text-gray-300">
                    Providing meals to those who go hungry every day
                  </p>
                </div>

                {/* Medical Aid */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                  <div className="text-4xl mb-3">🏥</div>
                  <h3 className="text-lg font-bold text-green-400 mb-2">
                    Medical Treatment
                  </h3>
                  <p className="text-sm text-gray-300">
                    Offering healthcare to those who cannot afford it
                  </p>
                </div>

                {/* Shelter */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 text-center">
                  <div className="text-4xl mb-3">🏠</div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">
                    Proper Housing
                  </h3>
                  <p className="text-sm text-gray-300">
                    Helping people find safe and secure shelter
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl">
                <p className="text-center text-base sm:text-lg">
                  <span className="text-cyan-400 font-semibold text-xl">
                    ✨ Once you log in
                  </span>
                  , you can clearly see all the details mentioned about our
                  mission and how the platform contributes to helping the needy.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action - Continue Button */}
          <button
            onClick={handleClose}
            className="group relative mt-6 sm:mt-8 overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
              Continue to Login
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

          {/* Quote Section */}
          <div className="mt-10 sm:mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl max-w-3xl mx-auto">
            <p className="text-gray-300 italic text-sm sm:text-base">
              "The purpose of life is not to be happy. It is to be useful, to be
              honorable, to be compassionate, to have it make some difference
              that you have lived and lived well."
            </p>
            <p className="text-cyan-400 text-sm mt-3">— Ralph Waldo Emerson</p>
          </div>

          {/* Footer */}
          <div className="mt-8 px-6 py-4 text-center text-sm text-gray-400 space-y-1">
            <p>© 2026 Biswa Bangla Social Networking Club.</p>
            <p>All rights reserved.</p>
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

        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(17, 24, 39, 0.8);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #06b6d4, #3b82f6);
          border-radius: 10px;
          border: 2px solid rgba(17, 24, 39, 0.8);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #0891b2, #2563eb);
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #06b6d4 rgba(17, 24, 39, 0.8);
        }
      `}</style>
    </div>
  );
}
