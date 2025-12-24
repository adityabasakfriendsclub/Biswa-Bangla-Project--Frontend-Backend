import React, { useState, useEffect } from "react";

function Launching() {
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 23,
    minutes: 59,
    seconds: 22,
  });

  useEffect(() => {
    // Set countdown to a specific target date (example: 10 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 10); // 10 days from now
    const countDownDate = targetDate.getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

      {/* Logo */}
      <div className="relative z-10 px-4 sm:px-8 lg:px-16 py-6">
        <div className="flex items-center gap-3">
          {/* Logo Image */}
          <a href="">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain "
            />
          </a>

          {/* Logo Text */}
          <div className="text-white font-bold">
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
          {/* Maintenance Message */}
          <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-3 sm:mb-4 tracking-wide font-light">
            Website Is Under Maintenance
          </p>

          {/* Main Heading */}
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
                  {/* Number background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-xl rounded-lg"></div>

                  {/* Number display */}
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

          {/* Divider */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-8 sm:mb-10"></div>

          {/* CTA Button */}
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

          {/* Footer text */}
          <p className="text-gray-500 text-sm mt-10 sm:mt-12">
            Stay tuned for something amazing • Follow us for updates
          </p>
        </div>
      </div>

      {/* Rocket Animation */}
      <div className="relative z-10">
        <img
          src="/images/rocket.png"
          alt="Rocket"
          className="hidden lg:block absolute right-[10%] bottom-0 w-[250px] animate-rocket"
        />
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent"></div>

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

        .animate-pulse-delay {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 700ms;
        }
      `}</style>
      {/* end */}
    </div>
  );
}

export default Launching;
