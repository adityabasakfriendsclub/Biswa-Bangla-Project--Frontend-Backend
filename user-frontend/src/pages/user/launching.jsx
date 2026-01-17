// src/pages/launching.jsx -
import { useState, useEffect } from "react";

// Import Legal Page Components (you'll create these files)
import PrivacyPolicyPage from "./legal/PrivacyPolicyPage";
import TermsConditionsPage from "./legal/TermsConditionsPage";
import CommunityGuidelinesPage from "./legal/CommunityGuidelinesPage";
import ChildrenMinorsPage from "./legal/ChildrenMinorsPage";
import ShippingPolicyPage from "./legal/ShippingPolicyPage";
import ContactUsPage from "./legal/ContactUsPage";

// Import Copyright Component
import Copyright from "./Copyright";

export default function Launching() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home' | 'privacy-policy' | etc.
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 23,
    minutes: 59,
    seconds: 22,
  });

  // Countdown Timer
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10);
    const countDownDate = targetDate.getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Navigation Handler
  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ RENDER LEGAL PAGES
  if (currentPage === "privacy-policy") {
    return <PrivacyPolicyPage onBack={() => handleNavigate("home")} />;
  }
  if (currentPage === "terms-and-conditions") {
    return <TermsConditionsPage onBack={() => handleNavigate("home")} />;
  }
  if (currentPage === "community-guidelines") {
    return <CommunityGuidelinesPage onBack={() => handleNavigate("home")} />;
  }
  if (currentPage === "children-and-minors") {
    return <ChildrenMinorsPage onBack={() => handleNavigate("home")} />;
  }
  if (currentPage === "shipping-policy") {
    return <ShippingPolicyPage onBack={() => handleNavigate("home")} />;
  }
  if (currentPage === "contact-us") {
    return <ContactUsPage onBack={() => handleNavigate("home")} />;
  }

  // ✅ MAIN LAUNCHING PAGE
  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Subtle star pattern background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-purple-900/10"></div>

      {/* Maintenance Message Banner */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center pt-4 px-4">
        <p className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-base sm:text-lg md:text-xl px-4 py-2 sm:mb-4 tracking-wide font-light rounded-lg inline-block">
          Website Is Under Maintenance
        </p>
      </div>

      {/* Logo Section */}
      <div className="relative z-10 px-4 sm:px-8 lg:text-center py-6">
        <div className="flex items-center flex-col gap-3">
          <a href="/">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-40 h-40 sm:w-44 sm:h-44 lg:w-48 lg:h-48 object-cover transition-transform duration-300 hover:scale-110"
            />
          </a>

          <div className="text-white font-bold text-center">
            <div className="text-lg sm:text-xl lg:text-2xl tracking-wider">
              BISWA BANGLA
            </div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-300 font-normal">
              SOCIAL NETWORKING CLUB
            </div>
            <div className="text-xs text-gray-400 mt-1">EST. 2025 | BBSNC</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center px-4 sm:px-8 lg:px-16 py-8">
        <div className="w-full max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 sm:mb-12 lg:mb-16 tracking-tight">
            We're{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Launching
            </span>{" "}
            Soon
          </h1>

          {/* Countdown Timer */}
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-14 lg:mb-20">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-xl rounded-lg"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 sm:p-5 md:p-6 min-w-[80px] sm:min-w-[100px] md:min-w-[120px]">
                    <p className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
                      {item.value.toString().padStart(2, "0")}
                    </p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm sm:text-base md:text-lg mt-3 font-medium">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-8 sm:mb-10"></div>

          <button className="group relative overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 flex items-center gap-3 hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 text-base sm:text-lg font-medium rounded-lg mx-auto hover:shadow-lg hover:shadow-cyan-500/25">
            Learn More
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Rocket Animation */}
      <div className="relative z-10">
        <img
          src="/rocket.png"
          alt="Rocket"
          className="hidden lg:block absolute right-[10%] bottom-0 w-[250px] animate-rocket"
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* ✅ COPYRIGHT FOOTER WITH NAVIGATION */}
      <Copyright
        organizationName="Biswa Bangla Social Networking Services Club"
        showIcons={true}
        bgColor="bg-gray-950"
        textColor="text-gray-400"
        borderColor="border-gray-800"
        onNavigate={handleNavigate}
      />

      <style jsx>{`
        @keyframes rocket {
          0% {
            bottom: 0;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            bottom: 105%;
            opacity: 0;
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

        .animate-rocket {
          animation: rocket 4s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================
// 📋 LEGAL PAGE COMPONENTS (SIMPLIFIED INLINE)
// ============================================

// You can copy these into separate files or keep them inline

function PrivacyPolicyPage({ onBack }) {
  return (
    <LegalPageLayout title="Privacy Policy & Refund Policy" onBack={onBack}>
      <Section title="1. Introduction">
        <p>
          Biswa Bangla Social Networking Services respects the privacy of its
          users and is committed to protecting their personal information...
        </p>
      </Section>
      {/* Add more sections from the previous Privacy Policy artifact */}
    </LegalPageLayout>
  );
}

function TermsConditionsPage({ onBack }) {
  return (
    <LegalPageLayout
      title="Terms & Conditions And Refund Policy"
      onBack={onBack}
    >
      {/* Content from previous Terms artifact */}
    </LegalPageLayout>
  );
}

function CommunityGuidelinesPage({ onBack }) {
  return (
    <LegalPageLayout title="Community Guidelines" onBack={onBack}>
      {/* Community guidelines content */}
    </LegalPageLayout>
  );
}

function ChildrenMinorsPage({ onBack }) {
  return (
    <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
      <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-3xl font-bold text-red-400 mb-4">
          STRICTLY 18+ ONLY
        </h2>
        <p className="text-xl text-gray-200">
          Children and minors are strictly prohibited...
        </p>
      </div>
    </LegalPageLayout>
  );
}

function ShippingPolicyPage({ onBack }) {
  return (
    <LegalPageLayout title="Shipping Policy" onBack={onBack}>
      <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-8 text-center">
        <div className="text-6xl mb-4">💻</div>
        <h2 className="text-3xl font-bold text-blue-400 mb-4">
          Digital-Only Platform
        </h2>
        <p className="text-xl">No physical products or shipping...</p>
      </div>
    </LegalPageLayout>
  );
}

function ContactUsPage({ onBack }) {
  return (
    <LegalPageLayout title="Contact Us" onBack={onBack}>
      <div className="bg-cyan-500/10 border-2 border-cyan-500/50 rounded-xl p-8">
        <div className="text-6xl text-center mb-4">📧</div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Contact Information
        </h3>
        <p>Building No. Unit No- 11/W/2, Room 2</p>
        <p>Phone: 8240210845</p>
        <p>Email: customercare@biswabanglasocialnetworkingservices.com</p>
      </div>
    </LegalPageLayout>
  );
}

// Helper Components
function LegalPageLayout({ title, children, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2">
        {title}
      </h2>
      <div className="space-y-4 text-gray-300">{children}</div>
    </div>
  );
}
