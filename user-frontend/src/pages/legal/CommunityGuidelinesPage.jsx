// // src/pages/legal/CommunityGuidelinesPage.jsx

// export function CommunityGuidelinesPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Community Guidelines" onBack={onBack}>
//       <Section title="1. Age Requirement">
//         <p>
//           Biswa Bangla Social Networking Services is strictly intended only for
//           individuals who are{" "}
//           <strong className="text-cyan-400">18 years of age or older</strong>.
//         </p>
//         <p>
//           By accessing or using this platform, users confirm that they meet the
//           minimum age requirement.
//         </p>
//       </Section>

//       <Section title="2. Responsible Use">
//         <p>Users are expected to:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Use the platform respectfully and lawfully</li>
//           <li>
//             Avoid harassment, abuse, hate speech, or inappropriate behavior
//           </li>
//           <li>
//             Share accurate information and refrain from misleading or fraudulent
//             activity
//           </li>
//           <li>Respect the privacy and consent of other members</li>
//         </ul>
//       </Section>

//       <Section title="3. Prohibited Activities">
//         <p>The following activities are not allowed:</p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>Use of the service by anyone under 18 years of age</li>
//           <li>Posting or sharing illegal, obscene, or offensive content</li>
//           <li>Impersonation, scams, or misuse of personal information</li>
//           <li>Any activity that violates applicable laws or regulations</li>
//         </ul>
//       </Section>

//       <Section title="4. Account Responsibility">
//         <p>
//           Each user is responsible for maintaining the confidentiality of their
//           account details and for all activities conducted through their
//           account.
//         </p>
//       </Section>

//       <Section title="5. Reporting & Support">
//         <p>
//           For any queries, concerns, or complaints, users may contact customer
//           support using the contact details provided below.
//         </p>
//       </Section>
//     </LegalPageLayout>
//   );
// }
// export default CommunityGuidelinesPage;

// new2
// src/pages/legal/CommunityGuidelinesPage.jsx - COMPLETE VERSION
export default function CommunityGuidelinesPage({ onBack }) {
  return (
    <LegalPageLayout title="Community Guidelines" onBack={onBack}>
      <Section title="1. Age Requirement">
        <p>
          Biswa Bangla Social Networking Services is strictly intended only for
          individuals who are{" "}
          <strong className="text-cyan-400">18 years of age or older</strong>.
        </p>
        <p className="mt-3">
          By accessing or using this platform, users confirm that they meet the
          minimum age requirement.
        </p>
      </Section>

      <Section title="2. Responsible Use">
        <p className="mb-3">Users are expected to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the platform respectfully and lawfully</li>
          <li>
            Avoid harassment, abuse, hate speech, or inappropriate behavior
          </li>
          <li>
            Share accurate information and refrain from misleading or fraudulent
            activity
          </li>
          <li>Respect the privacy and consent of other members</li>
          <li>Treat all users with dignity and courtesy</li>
          <li>Report any suspicious or harmful behavior immediately</li>
        </ul>
      </Section>

      <Section title="3. Prohibited Activities">
        <p className="mb-3 text-yellow-400">
          ⚠️ The following activities are strictly not allowed:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use of the service by anyone under 18 years of age</li>
          <li>Posting or sharing illegal, obscene, or offensive content</li>
          <li>Impersonation, scams, or misuse of personal information</li>
          <li>Any activity that violates applicable laws or regulations</li>
          <li>Harassment, bullying, or threatening behavior</li>
          <li>Sharing explicit adult content or nudity</li>
          <li>Spam, commercial solicitation, or advertising</li>
          <li>Attempting to hack or compromise platform security</li>
        </ul>
        <p className="mt-3 text-red-400">
          ⚠️ Violation of these rules may result in immediate account suspension
          or permanent termination.
        </p>
      </Section>

      <Section title="4. Account Responsibility">
        <p>
          Each user is responsible for maintaining the confidentiality of their
          account details and for all activities conducted through their
          account.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Keep your password secure and do not share it with others</li>
          <li>
            You are responsible for all activity on your account, even if
            unauthorized
          </li>
          <li>
            Report any unauthorized access immediately to our support team
          </li>
          <li>Do not create multiple accounts or use fake identities</li>
        </ul>
      </Section>

      <Section title="5. Content Standards">
        <p className="mb-3">When posting content or communicating:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Be respectful and considerate of others</li>
          <li>Do not post misleading or false information</li>
          <li>Respect intellectual property rights</li>
          <li>Avoid posting personal information of others without consent</li>
          <li>Keep conversations friendly and appropriate</li>
        </ul>
      </Section>

      <Section title="6. Safety & Privacy">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Never share:</strong> OTP codes, passwords, bank details, or
            credit card information
          </li>
          <li>Be cautious when sharing personal information</li>
          <li>Report suspicious users or behavior immediately</li>
          <li>
            Use the platform's built-in features for communication and payments
          </li>
          <li>
            Do not arrange physical meetings without proper safety precautions
          </li>
        </ul>
      </Section>

      <Section title="7. Reporting & Support">
        <p>
          For any queries, concerns, or complaints, users may contact customer
          support using the contact details provided below.
        </p>
        <p className="mt-3">
          If you encounter inappropriate behavior, use the{" "}
          <strong className="text-cyan-400">Report</strong> feature or contact
          us immediately.
        </p>
      </Section>

      <Section title="8. Enforcement">
        <p>We reserve the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-3">
          <li>Remove any content that violates these guidelines</li>
          <li>Suspend or terminate accounts that breach our policies</li>
          <li>Report illegal activity to law enforcement</li>
          <li>Take legal action when necessary</li>
        </ul>
      </Section>

      <Section title="9. Changes to Guidelines">
        <p>
          We may update these Community Guidelines from time to time. Continued
          use of the platform after changes constitutes acceptance of the
          updated guidelines.
        </p>
      </Section>
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        </div>
      </div>
    </div>
  );
}
