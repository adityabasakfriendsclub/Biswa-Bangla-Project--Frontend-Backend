// src/pages/legal/UsagePolicyPage.jsx
export default function UsagePolicyPage({ onBack }) {
  return (
    <LegalPageLayout
      title="Policy for Using Biswa Bangla Social Networking Website"
      onBack={onBack}
    >
      <Section title="1. Introduction">
        <p>
          This policy governs the access and use of the Biswa Bangla Social
          Networking Website and related services operated by Biswa Bangla
          Social Networking Club. By accessing or using our platform, users
          agree to comply with this policy and all applicable laws and
          regulations.
        </p>
      </Section>

      <Section title="2. Eligibility">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Users must be at least{" "}
            <strong className="text-cyan-400">18 years of age</strong> to
            register and use the platform.
          </li>
          <li>
            By creating an account, users confirm that the information provided
            is accurate and truthful.
          </li>
        </ul>
      </Section>

      <Section title="3. User Responsibilities">
        <p className="mb-3">Users agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the platform only for lawful and ethical purposes.</li>
          <li>
            Respect other users and avoid abusive, defamatory, hateful, or
            misleading content.
          </li>
          <li>
            Not post or share content that is obscene, harmful, threatening, or
            violates any law.
          </li>
          <li>Not impersonate any individual, organization, or authority.</li>
          <li>Maintain the confidentiality of their login credentials.</li>
        </ul>
      </Section>

      <Section title="4. Prohibited Activities">
        <p className="mb-3">
          The following activities are strictly prohibited:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Posting false, misleading, or fraudulent information.</li>
          <li>Harassment, stalking, or bullying of other users.</li>
          <li>
            Sharing content that promotes violence, discrimination, or illegal
            activities.
          </li>
          <li>
            Uploading viruses, malware, or attempting to disrupt the website's
            functionality.
          </li>
          <li>
            Unauthorized collection or misuse of personal data of other users.
          </li>
        </ul>
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-300">
            ⚠️ <strong>Warning:</strong> Violation of these prohibitions may
            result in immediate account suspension or termination.
          </p>
        </div>
      </Section>

      <Section title="5. Content Ownership and Rights">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Users retain ownership of the content they post but grant Biswa
            Bangla Social Networking Club a non-exclusive right to display,
            distribute, and promote such content on the platform.
          </li>
          <li>
            The platform reserves the right to remove any content that violates
            this policy without prior notice.
          </li>
        </ul>
      </Section>

      <Section title="6. Privacy and Data Protection">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            User data will be handled in accordance with applicable data
            protection laws.
          </li>
          <li>
            Personal information will not be shared with third parties without
            user consent, except where required by law.
          </li>
        </ul>
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-blue-300">
            🔒 <strong>Your Privacy Matters:</strong> We are committed to
            protecting your personal data. For more details, please review our{" "}
            <strong>Privacy Policy</strong>.
          </p>
        </div>
      </Section>

      <Section title="7. Account Suspension or Termination">
        <p className="mb-3">
          Biswa Bangla Social Networking Club reserves the right to suspend or
          terminate any account:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>For violation of this policy</li>
          <li>For providing false information</li>
          <li>
            For engaging in activities harmful to the platform or its users
          </li>
        </ul>
        <p className="mt-3 text-yellow-400">
          ⚠️ Such action may be taken without prior notice.
        </p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p className="mb-3">
          The platform is provided on an{" "}
          <strong className="text-cyan-400">"as-is"</strong> basis. Biswa Bangla
          Social Networking Club shall not be responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>User-generated content</li>
          <li>
            Any loss, damage, or dispute arising from the use of the platform
          </li>
        </ul>
      </Section>

      <Section title="9. Policy Updates">
        <p>
          This policy may be updated or modified at any time. Continued use of
          the website after changes indicates acceptance of the revised policy.
        </p>
        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-purple-300">
            📢 <strong>Stay Informed:</strong> We recommend reviewing this
            policy periodically to stay updated on any changes.
          </p>
        </div>
      </Section>

      <div className="mt-8 p-6 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="text-3xl">✅</div>
          <div>
            <h3 className="text-xl font-bold text-cyan-300 mb-2">
              Your Agreement
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              By using the Biswa Bangla Social Networking Website, you
              acknowledge that you have read, understood, and agree to be bound
              by this policy. If you do not agree with any part of this policy,
              please discontinue use of the platform immediately.
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
