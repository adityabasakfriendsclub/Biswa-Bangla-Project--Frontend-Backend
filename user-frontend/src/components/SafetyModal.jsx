// src/components/SafetyModal.jsx
export default function SafetyModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">⚠️ Safety Notice</h3>

        <p className="text-sm text-gray-700 mb-6">
          Do not share OTP, passwords, personal details. No nudity or illegal
          activity allowed.
        </p>

        <button
          onClick={onConfirm}
          className="w-full bg-yellow-400 py-3 rounded-xl font-bold"
        >
          Continue Video Call
        </button>

        <button
          onClick={onCancel}
          className="w-full mt-3 text-sm text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
