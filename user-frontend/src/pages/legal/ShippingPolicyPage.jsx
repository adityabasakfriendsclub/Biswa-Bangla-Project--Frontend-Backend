// // ✅ PAGE 5: SHIPPING POLICY
// // src/pages/legal/ShippingPolicyPage.jsx

// export function ShippingPolicyPage({ onBack }) {
//   return (
//     <LegalPageLayout title="Shipping Policy" onBack={onBack}>
//       <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-8 text-center mb-8">
//         <div className="text-6xl mb-4">💻</div>
//         <h2 className="text-3xl font-bold text-blue-400 mb-4">
//           Digital-Only Platform
//         </h2>
//         <p className="text-xl text-gray-200 leading-relaxed">
//           Biswa Bangla Social Networking Services is a{" "}
//           <strong>digital-only platform</strong>.
//         </p>
//       </div>

//       <Section title="No Physical Products">
//         <ul className="list-disc pl-6 space-y-2">
//           <li>
//             We do <strong>not</strong> sell, ship, or deliver any physical
//             products
//           </li>
//           <li>
//             There is <strong>no shipping policy</strong>, as no physical goods
//             are offered or dispatched
//           </li>
//           <li>All services provided are online and virtual in nature only</li>
//           <li>
//             Therefore, shipping, delivery timelines, courier services, or
//             logistics do not apply
//           </li>
//         </ul>
//       </Section>

//       <Section title="Service Delivery">
//         <p>
//           All features, subscriptions, and services are delivered instantly
//           through our online platform.
//         </p>
//         <ul className="list-disc pl-6 space-y-2 mt-2">
//           <li>✅ Instant access after payment</li>
//           <li>✅ No waiting for physical delivery</li>
//           <li>✅ Available 24/7 online</li>
//         </ul>
//       </Section>

//       <Section title="Age Restriction">
//         <p className="text-yellow-400">
//           ⚠️ This platform is strictly intended only for individuals who are{" "}
//           <strong>18 years of age or older</strong>. Children and minors are not
//           permitted to use this service.
//         </p>
//       </Section>
//     </LegalPageLayout>
//   );
// }
// new 2
// src/pages/legal/ShippingPolicyPage.jsx - COMPLETE VERSION
export default function ShippingPolicyPage({ onBack }) {
  return (
    <LegalPageLayout
      title="Delivery, Cancellation & Refund Policy"
      onBack={onBack}
    >
      <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-xl p-8 text-center mb-8">
        <div className="text-6xl mb-4">💻</div>
        <h2 className="text-3xl font-bold text-blue-400 mb-4">
          Digital-Only Platform
        </h2>
        <p className="text-xl text-gray-200 leading-relaxed">
          Biswa Bangla Social Networking Services is a{" "}
          <strong>digital-only platform</strong>.
        </p>
      </div>

      <Section title="No Physical Products">
        <ul className="list-disc pl-6 space-y-2">
          <li>
            We do <strong>not</strong> sell, ship, or deliver any physical
            products
          </li>
          <li>
            There is <strong>no shipping policy</strong>, as no physical goods
            are offered or dispatched
          </li>
          <li>All services provided are online and virtual in nature only</li>
          <li>
            Therefore, shipping, delivery timelines, courier services, or
            logistics do not apply
          </li>
        </ul>
      </Section>

      <Section title="Service Delivery">
        <p>
          All features, subscriptions, and services are delivered instantly
          through our online platform.
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>✅ Instant access after payment</li>
          <li>✅ No waiting for physical delivery</li>
          <li>✅ Available 24/7 online</li>
        </ul>
      </Section>

      <Section title="Refund Policy">
        <p className="mb-3">
          <strong>All payments made on the Platform are non-refundable</strong>,
          except where required by law or explicitly stated otherwise.
        </p>

        <h3 className="text-xl font-semibold text-white mb-2 mt-4">
          No Refund Situations
        </h3>
        <p>Refunds will not be provided for:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Change of mind after purchase</li>
          <li>Inactivity or lack of usage</li>
          <li>Account suspension or termination due to policy violations</li>
          <li>Dissatisfaction with matches, friendships, or interactions</li>
          <li>Failure to read Terms & Conditions before purchase</li>
        </ul>

        <h3 className="text-xl font-semibold text-white mb-2 mt-4">
          Technical Errors
        </h3>
        <p>Refunds may be considered only if:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            A payment was deducted but the service was not activated due to a
            technical error
          </li>
          <li>The issue is reported within 48 hours of the transaction</li>
          <li>Proof of payment is provided</li>
        </ul>
        <p className="mt-3 text-gray-400">
          Approval of such refunds is at the sole discretion of management.
        </p>
      </Section>

      <Section title="Cancellation Policy">
        <p>Users may cancel their subscription at any time. However:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>
            No refunds will be provided for unused portions of subscriptions
          </li>
          <li>
            Cancellation takes effect at the end of the current billing period
          </li>
          <li>Access to premium features continues until the period ends</li>
        </ul>
      </Section>

      <Section title="Age Restriction">
        <p className="text-yellow-400">
          ⚠️ This platform is strictly intended only for individuals who are{" "}
          <strong>18 years of age or older</strong>. Children and minors are not
          permitted to use this service.
        </p>
      </Section>
    </LegalPageLayout>
  );
}

// Shared Layout Component
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
