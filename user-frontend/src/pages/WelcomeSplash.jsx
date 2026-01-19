// src/pages/WelcomeSplash.jsx
import { useState } from "react";

export default function WelcomeSplash({ onClose, onNavigate }) {
  const [isVisible, setIsVisible] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [gstModalOpen, setGstModalOpen] = useState(false);
  const [udyamModalOpen, setUdyamModalOpen] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 500);
  };

  const toggleAbout = () => {
    setShowAbout(!showAbout);
    if (showPolicy) setShowPolicy(false);
  };

  const togglePolicy = () => {
    setShowPolicy(!showPolicy);
    if (showAbout) setShowAbout(false);
  };

  // ✅ Handle navigation to legal pages
  const handleNavigateToPage = (page) => {
    if (onNavigate) {
      handleClose();
      setTimeout(() => {
        onNavigate(page);
      }, 500);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 transition-opacity duration-500 overflow-y-auto ${
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
      <div className="relative z-10 w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
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
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8">
            <button
              onClick={toggleAbout}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-purple-500 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showAbout ? "Hide About Us" : "About Us"}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showAbout ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </button>

            <button
              onClick={togglePolicy}
              className="group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:from-emerald-500 hover:to-teal-600 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/50 transform hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                {showPolicy ? "Hide Policies" : "Policies & Legal"}
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${showPolicy ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            </button>
          </div>
          {/* About Section - Collapsible */}
          {showAbout && (
            <div className="mb-10 animate-fadeIn">
              <div className="glass-card rounded-2xl p-6 sm:p-8 text-left max-w-4xl mx-auto border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    About Us
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="text-base sm:text-lg">
                    <span className="font-semibold text-cyan-400">
                      Biswa Bangla Social Networking Services (Club)
                    </span>{" "}
                    is one of{" "}
                    <span className="font-semibold text-white">
                      India's largest social networking services
                    </span>
                    , operating as a{" "}
                    <span className="font-semibold text-green-400">
                      fully certified organization recognized by the State
                      Government of West Bengal and the Central Government of
                      India
                    </span>
                    .
                  </p>

                  <p className="text-sm sm:text-base">
                    We are a dedicated platform exclusively for individuals{" "}
                    <span className="font-semibold text-yellow-400">
                      above 18 years of age
                    </span>
                    , designed to foster meaningful social connections,
                    responsible networking, and community engagement in a safe,
                    transparent, and regulated environment.
                  </p>

                  <p className="text-sm sm:text-base">
                    Beyond social networking,{" "}
                    <span className="font-semibold text-cyan-400">
                      Biswa Bangla Social Networking Services (Club)
                    </span>{" "}
                    is actively involved in{" "}
                    <span className="font-semibold text-blue-400">
                      social service initiatives and professional consultancy
                      services
                    </span>
                    . Our mission extends beyond connectivity—we aim to
                    contribute positively to society by supporting social
                    welfare programs, awareness campaigns, and advisory services
                    across various sectors.
                  </p>

                  <p className="text-sm sm:text-base">
                    With a strong commitment to ethics, compliance, and social
                    responsibility, we strive to build a trusted ecosystem that
                    empowers individuals, promotes collaboration, and supports
                    personal and professional growth.
                  </p>

                  {/* Vision & Mission */}
                  <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {/* Vision */}
                    <div className="bg-white/5 rounded-xl p-5 border border-cyan-500/30">
                      <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
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
                        Our Vision
                      </h3>
                      <p className="text-sm text-gray-300">
                        To create a reliable, inclusive, and socially
                        responsible networking platform that connects people
                        while contributing to nation-building.
                      </p>
                    </div>

                    {/* Mission */}
                    <div className="bg-white/5 rounded-xl p-5 border border-blue-500/30">
                      <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                          />
                        </svg>
                        Our Mission
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          To provide a secure and certified social networking
                          platform for adults
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          To promote social welfare and community development
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          To offer consultancy services that add value to
                          individuals and organizations
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">•</span>
                          To operate with transparency, integrity, and
                          compliance with government regulations
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Policies & Legal Section - Collapsible */}
          {showPolicy && (
            <div className="mb-10 animate-fadeIn">
              <div className="glass-card rounded-2xl p-6 sm:p-8 text-left max-w-4xl mx-auto border border-white/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Policies & Legal
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
                </div>

                <ul className="space-y-3 text-gray-300">
                  <li>
                    <button
                      onClick={() => handleNavigateToPage("privacy-policy")}
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-cyan-300 hover:text-cyan-100"
                      aria-label="View Privacy Policy"
                    >
                      🔐 Privacy Policy
                    </button>

                    {/* end */}
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        handleNavigateToPage("terms-and-conditions")
                      }
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-blue-300 hover:text-blue-100"
                      aria-label="View Terms & Conditions"
                    >
                      📜 Terms & Conditions
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        handleNavigateToPage("community-guidelines")
                      }
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-purple-300 hover:text-purple-100"
                      aria-label="View Community Guidelines"
                    >
                      👥 Community Guidelines
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() =>
                        handleNavigateToPage("children-and-minors")
                      }
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-amber-300 hover:text-amber-100"
                      aria-label="View Children & Minors Policy"
                    >
                      👶 Children & Minors Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPage("shipping-policy")}
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-green-300 hover:text-green-100"
                      aria-label="View Shipping Policy"
                    >
                      📦 Shipping Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPage("usage-policy")}
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-indigo-300 hover:text-indigo-100"
                      aria-label="View Usage Policy"
                    >
                      📋 Usage Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigateToPage("contact-us")}
                      className="w-full text-left block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-gray-700 hover:border-gray-500 transition-all duration-300 text-sm sm:text-base font-medium text-emerald-300 hover:text-emerald-100"
                      aria-label="Contact Us"
                    >
                      📞 Contact Us
                    </button>
                  </li>
                </ul>

                <div className="mt-6 text-xs text-gray-500 text-center">
                  <p>
                    All policies are compliant with Indian laws and regulations.
                    <br />
                    For official documentation, visit our public website.
                  </p>
                </div>
              </div>
            </div>
          )}
          div
          {/* start */}
          {/* 📜 CERTIFICATES SECTION */}
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
                <div
                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-900 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setGstModalOpen(true)}
                >
                  <img
                    src="/gst-certificate.jpg"
                    alt="GST Registration Certificate"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <svg
                      className="w-12 h-12 text-white"
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
                  </div>
                </div>
                <button
                  onClick={() => setGstModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 hover:scale-105"
                  aria-label="View GST Certificate"
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
                </button>
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
                  ✓ Verified
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
                <div
                  className="relative aspect-video rounded-lg overflow-hidden border border-gray-700 bg-gray-900 mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setUdyamModalOpen(true)}
                >
                  <img
                    src="/udyams-certificates.jpg"
                    alt="Udyam Registration Certificate"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                    <svg
                      className="w-12 h-12 text-white"
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
                  </div>
                </div>
                <button
                  onClick={() => setUdyamModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-105"
                  aria-label="View Udyam Certificate"
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
                </button>
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
                  ✓ Verified
                </div>
              </div>
            </div>
          </div>
          {/* 🔐 GST CERTIFICATE MODAL */}
          {gstModalOpen && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn"
              onClick={() => setGstModalOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setGstModalOpen(false);
              }}
              tabIndex={0}
              role="dialog"
              aria-modal="true"
              aria-label="GST Certificate Modal"
            >
              {/* Modal Content */}
              <div
                className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setGstModalOpen(false)}
                  className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl font-bold hover:bg-red-600 active:scale-95 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Close modal"
                >
                  ×
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4 text-white">
                  <h2 className="text-lg md:text-xl font-bold">
                    Government of India – GST Registration Certificate
                  </h2>
                  <p className="text-xs md:text-sm text-green-100 mt-1">
                    Form: GST REG-06 • Reg No:{" "}
                    <span className="font-mono">19BGVPM9841D1ZP</span>
                  </p>
                </div>

                {/* Image Container */}
                <div className="flex items-center justify-center p-6 bg-gray-50">
                  <img
                    src="/gst-certificate.jpg"
                    alt="GST Registration Certificate Full View"
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-gray-300 transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm font-semibold text-gray-800">
                      ✓ Verified & Certified by Central Government
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      This certificate is registered with the Government of
                      India
                    </p>
                  </div>
                  <a
                    href="/gst-certificate.jpg"
                    download="GST-Certificate.jpg"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm hover:bg-green-600 transition-all duration-300 shadow-md"
                  >
                    ⬇️ Download
                  </a>
                </div>
              </div>
            </div>
          )}
          {/* 🔐 UDYAM CERTIFICATE MODAL */}
          {udyamModalOpen && (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fadeIn"
              onClick={() => setUdyamModalOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setUdyamModalOpen(false);
              }}
              tabIndex={0}
              role="dialog"
              aria-modal="true"
              aria-label="Udyam Certificate Modal"
            >
              {/* Modal Content */}
              <div
                className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-200 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setUdyamModalOpen(false)}
                  className="absolute top-4 right-4 z-10 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-3xl font-bold hover:bg-red-600 active:scale-95 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Close modal"
                >
                  ×
                </button>

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white">
                  <h2 className="text-lg md:text-xl font-bold">
                    Udyam Registration Certificate
                  </h2>
                  <p className="text-xs md:text-sm text-blue-100 mt-1">
                    Ministry of MSME • UDYAM No:{" "}
                    <span className="font-mono">UDYAM-WB-14-0244369</span>
                  </p>
                </div>

                {/* Image Container */}
                <div className="flex items-center justify-center p-6 bg-gray-50">
                  <img
                    src="/udyams-certificates.jpg"
                    alt="Udyam Registration Certificate Full View"
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-lg border border-gray-300 transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-100 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-xs md:text-sm font-semibold text-gray-800">
                      ✓ Verified & Certified by State Government (West Bengal)
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Ministry of Micro, Small & Medium Enterprises (MSME)
                    </p>
                  </div>
                  <a
                    href="/udyams-certificates.jpg"
                    download="Udyam-Certificate.jpg"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium text-sm hover:bg-blue-600 transition-all duration-300 shadow-md"
                  >
                    ⬇️ Download
                  </a>
                </div>
              </div>
            </div>
          )}
          {/* end */}
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
          <div className=" px-6 py-4 text-center text-xm text-gray-600 space-y-1">
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
      `}</style>
    </div>
  );
}
