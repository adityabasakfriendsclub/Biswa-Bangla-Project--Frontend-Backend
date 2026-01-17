// src/components/UserModal.jsx
export default function UserModal({ user, onClose, onVerify, onDelete }) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">👤 User Details</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center text-2xl transition"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-medium">First Name</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.firstName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Last Name</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Phone</p>
              <p className="text-lg font-semibold text-gray-800">
                📱 {user.phone}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Gender</p>
              <p className="text-lg font-semibold text-gray-800">
                {user.gender}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Status</p>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  user.isVerified
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {user.isVerified ? "✅ Verified" : "⏳ Pending"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">User ID</p>
              <p className="text-xs font-mono text-gray-800 bg-gray-100 px-3 py-2 rounded break-all">
                {user._id}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Joined</p>
              <p className="text-lg font-semibold text-gray-800">
                📅{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Last Updated</p>
              <p className="text-lg font-semibold text-gray-800">
                🕐{" "}
                {new Date(user.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onVerify(user._id, user.isVerified)}
              className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              {user.isVerified ? "❌ Unverify User" : "✅ Verify User"}
            </button>
            <button
              onClick={() => onDelete(user._id)}
              className="flex-1 bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition font-semibold"
            >
              🗑️ Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
