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
      {/* Copyright Text */}
      <div className="flex items-center justify-center py-10 sm:py-12 px-4">
        <div className="text-center max-w-2xl">
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

      {/* Divider */}
      <div
        className={`w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent`}
      ></div>

      {/* Icon Section */}
      {showIcons && (
        <div className="flex items-center justify-center gap-12 sm:gap-16 py-8 px-4">
          {/* Square */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded cursor-pointer hover:bg-cyan-500 transition duration-300 transform hover:scale-110"></div>

          {/* Circle */}
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 sm:border-4 border-gray-600 rounded-full cursor-pointer hover:border-cyan-500 transition duration-300 transform hover:scale-110"></div>

          {/* Triangle */}
          <div
            className="cursor-pointer hover:opacity-80 transition duration-300 transform hover:scale-110"
            style={{
              width: 0,
              height: 0,
              borderLeft: "12px solid #4b5563",
              borderTop: "8px solid transparent",
              borderBottom: "8px solid transparent",
            }}
          ></div>
        </div>
      )}

      {/* Bottom padding */}
      <div className="h-4"></div>
    </footer>
  );
}
