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
    </footer>
  );
}
