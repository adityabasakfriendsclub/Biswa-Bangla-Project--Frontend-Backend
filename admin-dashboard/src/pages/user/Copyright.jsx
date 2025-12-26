// //  Launching page
// export default function Copyright({
//   organizationName = "Biswa Bangla Social Networking Services Club",
//   showIcons = true,
//   bgColor = "bg-gray-950",
//   textColor = "text-gray-400",
//   borderColor = "border-gray-800",
// }) {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer
//       className={`relative z-20 w-full ${bgColor} border-t ${borderColor}`}
//     >
//       {/* Government & Compliance Approvals Section - FIRST */}
//       <div className="py-8 sm:py-10 px-4 bg-gradient-to-r from-gray-950/50 via-gray-900/30 to-gray-950/50">
//         <div className="max-w-6xl mx-auto">
//           {/* Main Heading */}
//           <h3 className="text-center text-white text-sm sm:text-base font-bold mb-6 tracking-wide">
//             ✓ GOVERNMENT & REGULATORY APPROVALS
//           </h3>

//           {/* Approvals Grid */}
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
//             {/* Central Government Approved */}
//             <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
//               <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
//                 🏛️
//               </div>
//               <p className="text-white text-xs sm:text-sm font-semibold text-center">
//                 Central Government
//               </p>
//               <p className={`${textColor} text-xs mt-1 text-center font-light`}>
//                 Approved
//               </p>
//             </div>

//             {/* State Government Approved */}
//             <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
//               <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
//                 🏢
//               </div>
//               <p className="text-white text-xs sm:text-sm font-semibold text-center">
//                 State Government
//               </p>
//               <p className={`${textColor} text-xs mt-1 text-center font-light`}>
//                 Approved
//               </p>
//             </div>

//             {/* GST Approved */}
//             <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
//               <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
//                 💰
//               </div>
//               <p className="text-white text-xs sm:text-sm font-semibold text-center">
//                 GST
//               </p>
//               <p className={`${textColor} text-xs mt-1 text-center font-light`}>
//                 Approved
//               </p>
//             </div>

//             {/* MSME Approved */}
//             <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-cyan-500/50 transition duration-300 group">
//               <div className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition duration-300">
//                 🏭
//               </div>
//               <p className="text-white text-xs sm:text-sm font-semibold text-center">
//                 MSME
//               </p>
//               <p className={`${textColor} text-xs mt-1 text-center font-light`}>
//                 Approved
//               </p>
//             </div>
//           </div>

//           {/* Verification Badge */}
//           <div className="mt-6 flex items-center justify-center gap-2">
//             <div className="h-1 w-8 bg-gradient-to-r from-transparent to-cyan-500"></div>
//             <p
//               className={`${textColor} text-xs sm:text-sm font-light text-center`}
//             >
//               All certifications verified and updated regularly
//             </p>
//             <div className="h-1 w-8 bg-gradient-to-l from-transparent to-cyan-500"></div>
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <div
//         className={`w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent`}
//       ></div>

//       {/* Copyright & Organization Info - SECOND */}
//       <div className="flex items-center justify-center py-10 sm:py-12 px-4">
//         <div className="text-center max-w-4xl">
//           <p
//             className={`${textColor} text-base sm:text-lg md:text-xl font-semibold leading-relaxed`}
//           >
//             © {currentYear} {organizationName}
//           </p>
//           <p
//             className={`${textColor} text-xs sm:text-sm md:text-base mt-2 font-light`}
//           >
//             All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
// src/components/Copyright.jsx
export default function Copyright({
  organizationName = "Biswa Bangla Social Networking Services Club",
  showIcons = true,
  bgColor = "bg-gray-950",
  textColor = "text-gray-400",
  borderColor = "border-gray-800",
}) {
  const currentYear = new Date().getFullYear();

  // Certificate Data
  const certificates = [
    {
      id: 1,
      name: "UDYAM Registration",
      number: "UDYAM-WB-14-0244369",
      icon: "🏭",
      image: "/images/udyam-certificate.jpg",
      details: "Biswa Bharat Social Networking Club",
      year: "2025-26",
    },
    {
      id: 2,
      name: "GST Registration",
      number: "19BGVPM9841D1ZP",
      icon: "💰",
      image: "/images/gst-certificate.jpg",
      details: "Government of India",
      year: "Active",
    },
  ];

  return (
    <footer
      className={`relative z-20 w-full ${bgColor} border-t ${borderColor}`}
    >
      {/* Government & Compliance Approvals Section - FIRST */}
      <div className="py-8 sm:py-10 px-4 bg-gradient-to-r from-gray-950/50 via-gray-900/30 to-gray-950/50">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <h3 className="text-center text-white text-sm sm:text-base md:text-lg font-bold mb-6 tracking-wide">
            ✓ GOVERNMENT & REGULATORY APPROVALS
          </h3>

          {/* Approvals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
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
          <div className="flex items-center justify-center gap-2 mb-8">
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

      {/* Certificate Details Section */}
      <div className="py-10 sm:py-12 px-4 bg-gradient-to-b from-gray-900/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          {/* Certificate Heading */}
          <h3 className="text-center text-white text-sm sm:text-base font-bold mb-8 tracking-wide">
            📜 OFFICIAL REGISTRATION CERTIFICATES
          </h3>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {certificates.map((cert, index) => (
              <div
                key={cert.id}
                className="group bg-gray-900/50 border border-gray-700/50 rounded-lg overflow-hidden hover:border-cyan-500/50 transition duration-300"
              >
                {/* Certificate Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-800">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* Certificate Info */}
                <div className="p-4 sm:p-6">
                  {/* Certificate Name */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl sm:text-2xl">{cert.icon}</span>
                    <h4 className="text-white text-sm sm:text-base font-bold">
                      {cert.name}
                    </h4>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-2 mb-4">
                    {/* Enterprise Name */}
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 text-xs font-semibold min-w-fit mt-0.5">
                        Enterprise:
                      </span>
                      <p
                        className={`${textColor} text-xs sm:text-sm font-light`}
                      >
                        {cert.details}
                      </p>
                    </div>

                    {/* Certificate Number */}
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 text-xs font-semibold min-w-fit mt-0.5">
                        Reg. No:
                      </span>
                      <p className="text-white text-xs sm:text-sm font-semibold font-mono bg-gray-800/50 px-3 py-2 rounded border border-gray-700">
                        {cert.number}
                      </p>
                    </div>

                    {/* Year/Status */}
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 text-xs font-semibold min-w-fit mt-0.5">
                        Year:
                      </span>
                      <p
                        className={`${textColor} text-xs sm:text-sm font-light`}
                      >
                        {cert.year}
                      </p>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <p className={`${textColor} text-xs font-light`}>
                      ✓ Verified & Active
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 sm:p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <p
              className={`${textColor} text-xs sm:text-sm text-center font-light`}
            >
              🔒 All certifications are authentic and regularly verified with
              respective government authorities.
              <br />
              For certificate verification, please contact us directly.
            </p>
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
