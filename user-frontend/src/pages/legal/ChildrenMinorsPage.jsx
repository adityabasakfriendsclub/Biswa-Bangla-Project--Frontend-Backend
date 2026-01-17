// // ✅ PAGE 4: CHILDREN AND MINORS PROHIBITED
// // src/pages/legal/ChildrenMinorsPage.jsx

// export function ChildrenMinorsPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
//       <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center mb-8">
//         <div className="text-6xl mb-4">🚫</div>
//         <h2 className="text-3xl font-bold text-red-400 mb-4">
//           STRICTLY 18+ ONLY
//         </h2>
//         <p className="text-xl text-gray-200 leading-relaxed">
//           Children and minors are <strong>strictly prohibited</strong> from
//           using Biswa Bangla Social Networking Services and the online
//           friendship website.
//         </p>
//       </div>

//       <Section title="Age Verification">
//         <p>
//           This platform is intended only for individuals who are{" "}
//           <strong className="text-cyan-400">18 years of age or older</strong>.
//         </p>
//         <p className="mt-3">
//           By accessing or using this service, users confirm that they are at
//           least 18 years old.
//         </p>
//       </Section>

//       <Section title="Account Termination">
//         <p className="text-yellow-400">
//           ⚠️ Any account found to be operated by a minor may be{" "}
//           <strong>suspended or terminated without notice</strong>.
//         </p>
//       </Section>

//       <Section title="Legal Compliance">
//         <p>This policy is in compliance with:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Information Technology Act, 2000</li>
//           <li>Protection of Children from Sexual Offences (POCSO) Act, 2012</li>
//           <li>Indian child safety regulations</li>
//         </ul>
//       </Section>
//     </LegalPageLayout>
//   );
// }
// export default ChildrenMinorsPage;
// new2
// src/pages/legal/ChildrenMinorsPage.jsx - COMPLETE VERSION
export default function ChildrenMinorsPage({ onBack }) {
  return (
    <LegalPageLayout title="Children and Minors Prohibited" onBack={onBack}>
      <div className="bg-red-500/10 border-2 border-red-500/50 rounded-xl p-8 text-center mb-8">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-3xl font-bold text-red-400 mb-4">
          STRICTLY 18+ ONLY
        </h2>
        <p className="text-xl text-gray-200 leading-relaxed">
          Children and minors are <strong>strictly prohibited</strong> from
          using Biswa Bangla Social Networking Services and the online
          friendship website.
        </p>
      </div>

      <Section title="Age Verification">
        <p>
          This platform is intended only for individuals who are{" "}
          <strong className="text-cyan-400">18 years of age or older</strong>.
        </p>
        <p className="mt-3">
          By accessing or using this service, users confirm that they are at
          least 18 years old.
        </p>
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-300">
            ⚠️ <strong>Important:</strong> This is a legal requirement and
            violation may result in legal consequences.
          </p>
        </div>
      </Section>

      <Section title="Why This Restriction Exists">
        <p className="mb-3">This age restriction is in place to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Protect Children:</strong> Social networking platforms can
            expose minors to inappropriate content and interactions
          </li>
          <li>
            <strong>Legal Compliance:</strong> Indian laws require age
            verification for online platforms
          </li>
          <li>
            <strong>Safety:</strong> Adult-oriented features and conversations
            are not suitable for minors
          </li>
          <li>
            <strong>Privacy:</strong> Minors may not understand the implications
            of sharing personal information online
          </li>
        </ul>
      </Section>

      <Section title="Account Termination">
        <p className="text-yellow-400 mb-3">
          ⚠️ Any account found to be operated by a minor may be{" "}
          <strong>suspended or terminated without notice</strong>.
        </p>
        <p>If we discover that a user is under 18 years old:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>The account will be immediately suspended</li>
          <li>All account data will be deleted</li>
          <li>No refunds will be provided for any paid services</li>
          <li>The matter may be reported to appropriate authorities</li>
          <li>
            Parents/guardians will be notified if contact information is
            available
          </li>
        </ul>
      </Section>

      <Section title="Legal Compliance">
        <p className="mb-3">This policy is in compliance with:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Information Technology Act, 2000</strong> - Governs
            electronic commerce and cybersecurity in India
          </li>
          <li>
            <strong>
              Protection of Children from Sexual Offences (POCSO) Act, 2012
            </strong>{" "}
            - Protects children from sexual abuse and exploitation
          </li>
          <li>
            <strong>Indian Child Safety Regulations</strong> - Various laws
            protecting children's rights and safety
          </li>
          <li>
            <strong>Digital Personal Data Protection Act</strong> - Ensures
            special protection for children's data
          </li>
        </ul>
      </Section>

      <Section title="Parental Responsibility">
        <p className="mb-3">
          We urge parents and guardians to monitor their children's online
          activities:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ensure children do not access adult-oriented platforms</li>
          <li>Use parental control software and monitoring tools</li>
          <li>Educate children about online safety</li>
          <li>Report any suspected underage usage to us immediately</li>
        </ul>
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300">
            💡 <strong>For Parents:</strong> If you discover your child has
            created an account, please contact us immediately so we can remove
            it and prevent future access.
          </p>
        </div>
      </Section>

      <Section title="Reporting Underage Users">
        <p className="mb-3">
          If you suspect a user is under 18 years old, please report it
          immediately:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the in-app reporting feature</li>
          <li>Contact our support team with details</li>
          <li>
            Email us at:{" "}
            <a
              href="mailto:customercare@biswabanglasocialnetworkingservices.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              customercare@biswabanglasocialnetworkingservices.com
            </a>
          </li>
        </ul>
        <p className="mt-3 text-gray-400">
          All reports are taken seriously and investigated promptly.
        </p>
      </Section>

      <Section title="Verification Process">
        <p className="mb-3">We employ various methods to verify user age:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Date of birth verification during registration</li>
          <li>Government ID verification for certain features</li>
          <li>Behavioral analysis and pattern detection</li>
          <li>Community reporting and moderation</li>
        </ul>
      </Section>

      <Section title="Educational Purpose">
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
          <h3 className="text-xl font-bold text-purple-400 mb-3">
            📚 Understanding the Risks
          </h3>
          <p className="mb-3">
            Social networking platforms designed for adults can expose children
            to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Inappropriate content and conversations</li>
            <li>Potential predators and harmful individuals</li>
            <li>Privacy breaches and identity theft</li>
            <li>Psychological impact from adult-oriented interactions</li>
            <li>Cyberbullying and online harassment</li>
          </ul>
        </div>
      </Section>

      <Section title="Our Commitment">
        <p>
          Biswa Bangla Social Networking Services is committed to maintaining a
          safe, adult-only environment:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>We continuously improve our age verification systems</li>
          <li>We cooperate fully with law enforcement when necessary</li>
          <li>We educate our community about child safety</li>
          <li>We take immediate action on reported violations</li>
          <li>We maintain strict policies against child exploitation</li>
        </ul>
      </Section>

      <div className="mt-8 p-6 bg-red-500/20 border-2 border-red-500/50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="text-3xl">⛔</div>
          <div>
            <h3 className="text-xl font-bold text-red-300 mb-2">
              Zero Tolerance Policy
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              We have a <strong>zero-tolerance policy</strong> for underage
              usage. Any attempt to circumvent age verification or misrepresent
              age will result in immediate account termination and may be
              reported to authorities. We prioritize the safety and protection
              of children above all else.
            </p>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  );
}

// ============================================
// SHARED LAYOUT COMPONENT
// ============================================

function LegalPageLayout({ title, children, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
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
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-20">
        {/* Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          {children}
        </div>

        {/* Age Warning */}
        <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="text-2xl">⚠️</div>
            <div>
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Age Restriction Notice
              </h3>
              <p className="text-gray-300 text-sm">
                This platform is strictly for users{" "}
                <strong>18 years of age or older</strong>. Children and minors
                are prohibited from using this service.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <ContactInfo />
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2">
        {title}
      </h2>
      <div className="space-y-4 text-gray-300">{children}</div>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
      <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
      <div className="space-y-2 text-sm text-gray-300">
        <p>
          <strong>Biswa Bangla Social Networking Club</strong>
        </p>
        <p>📍 Building No. Unit No- 11/W/2, Room 2</p>
        <p className="ml-4">Road Street – Action Area II/04, Street No. 373</p>
        <p className="ml-4">Manicasadona, Newtown</p>
        <p className="ml-4">Kolkata, West Bengal – 700161</p>
        <div className="pt-3 space-y-1">
          <p>
            📧{" "}
            <a
              href="mailto:customercare@biswabanglasocialnetworkingservices.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              customercare@biswabanglasocialnetworkingservices.com
            </a>
          </p>
          <p>
            📧{" "}
            <a
              href="mailto:customercarebiswabanglasocialn@gmail.com"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              customercarebiswabanglasocialn@gmail.com
            </a>
          </p>
          <p>
            📞{" "}
            <a
              href="tel:8240210845"
              className="text-cyan-400 hover:text-cyan-300"
            >
              8240210845
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
