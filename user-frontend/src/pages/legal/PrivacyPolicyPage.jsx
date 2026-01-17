// src/pages/legal/PrivacyPolicyPage.jsx
import { useState } from "react";

export default function PrivacyPolicyPage({ onBack }) {
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
            Privacy Policy & Refund Policy
          </h1>
          <p className="text-lg text-gray-400">
            For Users Above 18 Years of Age Only
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          <Section title="1. Introduction">
            <p>
              Biswa Bangla Social Networking Services ("we", "our", "us", or
              "the Platform") respects the privacy of its users and is committed
              to protecting their personal information. This Privacy Policy
              explains how we collect, use, store, share, and protect user data
              when you access or use our social networking and online friendship
              services.
            </p>
            <p>
              By accessing or using our website, mobile application, or related
              services, you agree to the terms of this Privacy Policy.
            </p>
          </Section>

          <Section title="2. Eligibility (18+ Only)">
            <p>
              Our services are strictly intended for individuals who are{" "}
              <strong>18 years of age or older</strong>.
            </p>
            <p>By registering or using the Platform, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>You are at least 18 years old</li>
              <li>You have the legal capacity to enter into this agreement</li>
            </ul>
            <p className="mt-3 text-yellow-400">
              ⚠️ We do not knowingly collect data from minors. Accounts found to
              belong to users under 18 may be suspended or permanently deleted.
            </p>
          </Section>

          <Section title="3. Information We Collect">
            <SubSection title="a) Personal Information">
              <ul className="list-disc pl-6 space-y-1">
                <li>Name or nickname</li>
                <li>Date of birth / age confirmation</li>
                <li>Gender</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Profile photographs</li>
                <li>Location (city/state)</li>
              </ul>
            </SubSection>

            <SubSection title="b) Account & Usage Information">
              <ul className="list-disc pl-6 space-y-1">
                <li>Login details</li>
                <li>Messages, chats, and interactions (subject to law)</li>
                <li>Preferences and interests</li>
                <li>
                  Device information (IP address, browser type, operating
                  system)
                </li>
              </ul>
            </SubSection>

            <SubSection title="c) Automatically Collected Information">
              <ul className="list-disc pl-6 space-y-1">
                <li>Cookies and similar tracking technologies</li>
                <li>Log files</li>
                <li>App or website usage statistics</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="4. Purpose of Data Collection">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Create and manage user accounts</li>
              <li>Provide social networking and friendship features</li>
              <li>Enable communication between users</li>
              <li>Improve platform functionality and user experience</li>
              <li>Ensure safety, security, and fraud prevention</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Respond to customer support queries</li>
            </ul>
          </Section>

          <Section title="5. Sharing of Information">
            <p>
              <strong>
                We do not sell or rent personal data to third parties.
              </strong>
            </p>
            <p>Information may be shared only:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                With service providers (hosting, payment, technical support)
              </li>
              <li>
                When required by law, court order, or government authority
              </li>
              <li>
                To protect our legal rights, safety, and platform integrity
              </li>
              <li>With user consent</li>
            </ul>
          </Section>

          <Section title="6. User Content & Communication">
            <p>
              Users are responsible for the content they share, including
              messages, images, and profile details.
            </p>
            <p>
              We reserve the right to monitor, remove, or restrict content that:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Violates laws</li>
              <li>Is abusive, obscene, fraudulent, or harmful</li>
              <li>Breaches our terms or community guidelines</li>
            </ul>
          </Section>

          <Section title="7. Data Security">
            <p>
              We implement reasonable technical and organizational security
              measures to protect user data against:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Unauthorized access</li>
              <li>Loss</li>
              <li>Misuse</li>
              <li>Alteration</li>
            </ul>
            <p className="mt-3 text-gray-400">
              However, no online system is 100% secure, and users share
              information at their own risk.
            </p>
          </Section>

          <Section title="8. User Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Access your personal data</li>
              <li>Update or correct information</li>
              <li>Request deletion of your account</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
            <p className="mt-3">
              Requests can be made by contacting us at the email addresses
              below.
            </p>
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
        <div className="mt-8 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">
            Contact Information
          </h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>Biswa Bangla Social Networking Club</strong>
            </p>
            <p>📍 Building No. Unit No- 11/W/2, Room 2</p>
            <p className="ml-4">
              Road Street – Action Area II/04, Street No. 373
            </p>
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

function SubSection({ title, children }) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <div className="text-gray-300">{children}</div>
    </div>
  );
}
