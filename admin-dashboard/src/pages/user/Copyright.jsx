//  Launching page
export default function Copyright({
  organizationName = "Biswa Bangla Social Networking Services Club",
  showIcons = true,
  bgColor = "bg-gray-950",
  textColor = "text-gray-400",
  borderColor = "border-gray-800",
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative z-20 w-full ${bgColor} border-t ${borderColor}`}
    >
      {/* Government & Compliance Approvals Section - FIRST */}
      <div className="py-8 sm:py-10 px-4 bg-gradient-to-r from-gray-950/50 via-gray-900/30 to-gray-950/50">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <h3 className="text-center text-white text-sm sm:text-base font-bold mb-6 tracking-wide">
            ✓ GOVERNMENT & REGULATORY APPROVALS
          </h3>

          {/* Approvals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Central Government Approved */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
                🏛️
              </div>
              <p className="text-white text-xs sm:text-sm font-semibold text-center">
                Central Government
              </p>
              <p className={`${textColor} text-xs mt-1 text-center font-light`}>
                Approved
              </p>
            </div>

            {/* State Government Approved */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
                🏢
              </div>
              <p className="text-white text-xs sm:text-sm font-semibold text-center">
                State Government
              </p>
              <p className={`${textColor} text-xs mt-1 text-center font-light`}>
                Approved
              </p>
            </div>

            {/* GST Approved */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
                💰
              </div>
              <p className="text-white text-xs sm:text-sm font-semibold text-center">
                GST
              </p>
              <p className={`${textColor} text-xs mt-1 text-center font-light`}>
                Approved
              </p>
            </div>

            {/* MSME Approved */}
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
              <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
                🏭
              </div>
              <p className="text-white text-xs sm:text-sm font-semibold text-center">
                MSME
              </p>
              <p className={`${textColor} text-xs mt-1 text-center font-light`}>
                Approved
              </p>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="h-1 w-8 bg-gradient-to-r from-transparent to-cyan-500"></div>
            <p
              className={`${textColor} text-xs sm:text-sm font-light text-center`}
            >
              All certifications verified and updated regularly
            </p>
            <div className="h-1 w-8 bg-gradient-to-l from-transparent to-cyan-500"></div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className={`w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent`}
      ></div>

      {/* Copyright & Organization Info - SECOND */}
      <div className="flex items-center justify-center py-10 sm:py-12 px-4">
        <div className="text-center max-w-4xl">
          <p
            className={`${textColor} text-base sm:text-lg md:text-xl font-semibold leading-relaxed`}
          >
            © {currentYear} {organizationName}
          </p>
          <p
            className={`${textColor} text-xs sm:text-sm md:text-base mt-2 font-light`}
          >
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
