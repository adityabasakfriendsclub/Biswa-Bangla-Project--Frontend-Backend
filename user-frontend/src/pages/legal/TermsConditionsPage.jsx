// src/pages/legal/TermsConditionsPage.jsx
export default function TermsConditionsPage({ onBack }) {
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
            Terms & Conditions And Refund Policy
          </h1>
          <p className="text-lg text-gray-400">
            For Users Above 18 Years of Age Only
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          <Section title="1. Acceptance of Terms">
            <p>
              By accessing or using Biswa Bangla Social Networking Services
              ("the Platform", "we", "us", "our"), you agree to comply with and
              be bound by these Terms & Conditions.
            </p>
            <p className="text-yellow-400">
              If you do not agree, please do not use our services.
            </p>
          </Section>

          <Section title="2. Eligibility (18+ Only)">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                This Platform is strictly for individuals aged{" "}
                <strong className="text-cyan-400">18 years or above</strong>.
              </li>
              <li>
                By registering, you confirm that you are legally eligible to use
                the service.
              </li>
              <li>
                Accounts found to belong to users under 18 will be terminated
                without notice.
              </li>
            </ul>
          </Section>

          <Section title="3. Nature of Service">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                The Platform provides social networking and online friendship
                services.
              </li>
              <li>
                We do not guarantee friendships, relationships, or personal
                outcomes.
              </li>
              <li>
                All interactions are voluntary and at the user's own discretion
                and risk.
              </li>
            </ul>
          </Section>

          <Section title="4. User Responsibilities">
            <p>Users agree:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>To provide accurate and truthful information</li>
              <li>Not to impersonate others</li>
              <li>
                Not to upload or share illegal, obscene, abusive, threatening,
                misleading, or harmful content
              </li>
              <li>Not to harass, exploit, or scam other users</li>
              <li>
                Not to misuse the platform for commercial, illegal, or
                fraudulent purposes
              </li>
            </ul>
            <p className="mt-3 text-red-400">
              ⚠️ Violation of these rules may result in account suspension or
              permanent termination.
            </p>
          </Section>

          <Section title="5. User Content">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Users are solely responsible for the content they post or share.
              </li>
              <li>
                We reserve the right to remove any content that violates laws,
                morals, or platform guidelines.
              </li>
              <li>
                We are not responsible for user-generated content or offline
                interactions.
              </li>
            </ul>
          </Section>

          <Section title="6. Account Suspension & Termination">
            <p>We may suspend or terminate accounts:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>For violation of Terms & Conditions</li>
              <li>For false age or identity information</li>
              <li>For abusive or suspicious behavior</li>
              <li>For legal or regulatory compliance</li>
            </ul>
            <p className="mt-3 text-gray-400">
              No compensation will be provided for terminated accounts.
            </p>
          </Section>

          <Section title="7. Payments & Subscriptions">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Certain features may require paid subscriptions or one-time
                payments.
              </li>
              <li>Prices are displayed clearly before purchase.</li>
              <li>Payments once made are subject to our Refund Policy.</li>
            </ul>
          </Section>

          <Section title="8. Limitation of Liability">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                We are not responsible for user behavior, communications, or
                offline meetings.
              </li>
              <li>We do not guarantee uninterrupted, error-free service.</li>
              <li>Use of the platform is at your own risk.</li>
            </ul>
          </Section>

          <Divider />

          {/* Refund Policy Section */}
          <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
            Refund Policy
          </h2>

          <Section title="1. General Policy">
            <p className="text-lg">
              All payments made on the Platform are{" "}
              <strong className="text-yellow-400">non-refundable</strong>,
              except where required by law or explicitly stated otherwise.
            </p>
          </Section>

          <Section title="2. No Refund Situations">
            <p>Refunds will not be provided for:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Change of mind after purchase</li>
              <li>Inactivity or lack of usage</li>
              <li>
                Account suspension or termination due to policy violations
              </li>
              <li>
                Dissatisfaction with matches, friendships, or interactions
              </li>
              <li>Failure to read Terms & Conditions before purchase</li>
            </ul>
          </Section>

          <Section title="3. Technical Errors">
            <p>Refunds may be considered only if:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                A payment was deducted but the service was not activated due to
                a technical error
              </li>
              <li>The issue is reported within 48 hours of the transaction</li>
              <li>Proof of payment is provided</li>
            </ul>
            <p className="mt-3 text-gray-400">
              Approval of such refunds is at the sole discretion of management.
            </p>
          </Section>

          <Section title="4. Refund Processing">
            <p>If approved:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Refunds will be processed to the original payment method</li>
              <li>Processing time may take 7–10 business days</li>
            </ul>
          </Section>
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

// Helper Components
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

function Divider() {
  return (
    <div className="my-8">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
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
