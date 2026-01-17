// ✅ PAGE 6: CONTACT US
// src/pages/legal/ContactUsPage.jsx

export function ContactUsPage({ onBack }) {
  return (
    <LegalPageLayout title="Contact Us" onBack={onBack}>
      <div className="bg-cyan-500/10 border-2 border-cyan-500/50 rounded-xl p-8 text-center mb-8">
        <div className="text-6xl mb-4">📧</div>
        <h2 className="text-3xl font-bold text-cyan-400 mb-4">Get In Touch</h2>
        <p className="text-xl text-gray-200 leading-relaxed">
          Biswa Bangla Social Networking Services is an online friendship and
          social networking platform strictly for users aged{" "}
          <strong>18 years and above</strong>.
        </p>
      </div>

      <Section title="Contact Information">
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Biswa Bangla Social Networking Club
          </h3>

          <div className="space-y-4 text-gray-300">
            <div>
              <p className="text-cyan-400 font-semibold mb-2">
                📍 Registered Address:
              </p>
              <p>Building No. Unit No- 11/W/2, Room 2</p>
              <p>Road Street – Action Area II/04</p>
              <p>Street No. 373, Manicasadona</p>
              <p>Newtown, Kolkata</p>
              <p>
                <strong>West Bengal – 700161</strong>
              </p>
            </div>

            <div>
              <p className="text-cyan-400 font-semibold mb-2">
                📧 Email Support:
              </p>
              <p>
                <a
                  href="mailto:care@biswabanglasocialnetworkingservices.com"
                  className="hover:text-cyan-300 underline"
                >
                  care@biswabanglasocialnetworkingservices.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:customercare@biswabanglasocialnetworkingservices.com"
                  className="hover:text-cyan-300 underline"
                >
                  customercare@biswabanglasocialnetworkingservices.com
                </a>
              </p>
              <p>
                <a
                  href="mailto:customercarebiswabanglasocialn@gmail.com"
                  className="hover:text-cyan-300 underline"
                >
                  customercarebiswabanglasocialn@gmail.com
                </a>
              </p>
            </div>

            <div>
              <p className="text-cyan-400 font-semibold mb-2">
                📞 Customer Care:
              </p>
              <p className="text-2xl font-bold">
                <a href="tel:8240210845" className="hover:text-cyan-300">
                  8240210845
                </a>
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Customer Support Hours">
        <p>Our customer support team is available:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM IST
          </li>
          <li>
            <strong>Saturday:</strong> 10:00 AM - 4:00 PM IST
          </li>
          <li>
            <strong>Sunday:</strong> Closed
          </li>
        </ul>
        <p className="mt-3 text-gray-400">
          For urgent queries, please email us and we'll respond within 24-48
          hours.
        </p>
      </Section>
    </LegalPageLayout>
  );
}

// ============================================
// 🔧 SHARED LAYOUT COMPONENT
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
export default ContactUsPage;
