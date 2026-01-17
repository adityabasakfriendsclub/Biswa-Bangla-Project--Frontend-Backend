// src/pages/SettingsPage.jsx - UPDATED WITH LEGAL PAGE NAVIGATION
import { useState } from "react";

export default function SettingsPage({ onBack, onDeleteAccount, onNavigate }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ✅ Legal & Policy Settings Options
  const settingsOptions = [
    {
      id: "privacy-policy",
      title: "Privacy Policy",
      icon: "🔒",
      page: "privacy-policy",
    },
    {
      id: "terms-conditions",
      title: "Terms & Conditions",
      icon: "📋",
      page: "terms-and-conditions",
    },
    {
      id: "shipping-policy",
      title: "Delivery, Cancellation & Refund",
      icon: "📦",
      page: "shipping-policy",
    },
    {
      id: "community-guidelines",
      title: "Community Guidelines",
      icon: "👥",
      page: "community-guidelines",
    },
    {
      id: "children-minors",
      title: "Children and Minors Prohibited",
      icon: "🚫",
      page: "children-and-minors",
    },
    {
      id: "contact-us",
      title: "Contact Us",
      icon: "📧",
      page: "contact-us",
    },
  ];

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (
      confirm(
        "⚠️ Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      onDeleteAccount?.();
    }
    setShowDeleteConfirm(false);
  };

  // ✅ Handle navigation to legal pages
  const handleOptionClick = (page) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      console.warn("Navigation handler not provided");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-6 flex items-center sticky top-0 z-10 shadow-md">
        <button
          onClick={onBack}
          className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
        >
          <svg
            className="w-6 h-6"
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
        </button>

        <h1 className="text-2xl font-bold text-white flex-1 ml-4">Settings</h1>
      </div>

      {/* Logo */}
      <div className="bg-white p-8 flex justify-center border-b border-gray-200">
        <img src="/logo.png" alt="BBSNC Logo" className="h-40 w-40" />
      </div>

      {/* Legal & Policy Settings */}
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Legal & Policies
        </h2>

        {settingsOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleOptionClick(option.page)}
            className="w-full bg-white hover:bg-gray-50 rounded-xl p-5 text-left transition-colors shadow-sm flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-pink-100 transition-colors">
                {option.icon}
              </div>
              <span className="text-base font-semibold text-gray-800">
                {option.title}
              </span>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:text-pink-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ))}
      </div>

      {/* Account Actions Section */}
      <div className="px-6 pb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4 mt-6">
          Account Actions
        </h2>

        {/* Delete Account Button */}
        <button
          onClick={handleDeleteClick}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete Account
        </button>
      </div>

      {/* Footer */}
      <div className="bottom-0 left-0 right-0 bg-white px-6 py-4 text-center text-xs text-gray-600 space-y-1 border-t border-gray-200">
        <p>© 2025 Biswa Bangla Social Networking Services Club.</p>
        <p>All rights reserved.</p>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Account?
              </h2>
              <p className="text-gray-600">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={confirmDelete}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
