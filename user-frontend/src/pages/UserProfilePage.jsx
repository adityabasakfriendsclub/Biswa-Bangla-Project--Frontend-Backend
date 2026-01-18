// src/pages/UserProfilePage.jsx - NEW FILE
import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:3000/api";

export default function UserProfilePage({ user, onBack, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileData, setProfileData] = useState({
    nickname: "",
    gender: "",
    dateOfBirth: "",
    profileImage: null,
  });
  const [age, setAge] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        const userData = data.data.user;
        setProfileData({
          nickname: userData.nickname || "",
          gender: userData.gender || "",
          dateOfBirth: userData.dateOfBirth
            ? new Date(userData.dateOfBirth).toISOString().split("T")[0]
            : "",
          profileImage: userData.profileImage || null,
        });
        setAge(userData.age);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload an image file");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("profileImage", file);

      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfileData({
          ...profileData,
          profileImage: data.data.profileImage,
        });
        alert("✅ Profile image updated!");
        onUpdate?.({ ...user, profileImage: data.data.profileImage });
      } else {
        alert(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: profileData.nickname,
          gender: profileData.gender,
          dateOfBirth: profileData.dateOfBirth,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("✅ Profile updated successfully!");
        setAge(data.data.user.age);
        setIsEditing(false);
        onUpdate?.(data.data.user);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // const getProfileImageUrl = () => {
  //   if (profileData.profileImage) {
  //     return `${API_BASE_URL.replace("/api", "")}${profileData.profileImage}`;
  //   }
  //   return `https://ui-avatars.com/api/?name=${encodeURIComponent(
  //     `${user?.firstName} ${user?.lastName}`
  //   )}&background=ec4899&color=fff&size=200`;
  // };
  const getProfileImageUrl = () => {
    if (profileData.profileImage) {
      return `${window.location.origin}${profileData.profileImage}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${user?.firstName} ${user?.lastName}`,
    )}&background=ec4899&color=fff&size=200`;
  };

  // end
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-6 flex items-center justify-between sticky top-0 z-10 shadow-md">
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

        <h1 className="text-2xl font-bold text-white flex-1 ml-4">
          My Profile
        </h1>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full font-medium transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* Profile Content */}
      <div className="px-6 py-8 space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={getProfileImageUrl()}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition-colors shadow-lg">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
          {uploading && (
            <p className="text-pink-500 text-sm mt-2">Uploading...</p>
          )}
        </div>

        {isEditing ? (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nickname */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nickname (Optional)
              </label>
              <input
                type="text"
                value={profileData.nickname}
                onChange={(e) =>
                  setProfileData({ ...profileData, nickname: e.target.value })
                }
                placeholder="Enter nickname"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender *
              </label>
              <select
                value={profileData.gender}
                onChange={(e) =>
                  setProfileData({ ...profileData, gender: e.target.value })
                }
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) =>
                  setProfileData({
                    ...profileData,
                    dateOfBirth: e.target.value,
                  })
                }
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-pink-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold py-3 rounded-lg hover:from-pink-500 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        ) : (
          /* View Profile */
          <div className="space-y-4">
            {/* Name */}
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="text-xl font-bold text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
            </div>

            {/* Nickname */}
            {profileData.nickname && (
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <p className="text-sm text-gray-500 mb-1">Nickname</p>
                <p className="text-xl font-bold text-gray-800">
                  {profileData.nickname}
                </p>
              </div>
            )}

            {/* Phone */}
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="text-xl font-bold text-gray-800">{user?.phone}</p>
            </div>

            {/* Gender */}
            <div className="bg-white rounded-2xl p-5 shadow-md">
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="text-xl font-bold text-gray-800">
                {profileData.gender || "Not set"}
              </p>
            </div>

            {/* Age */}
            {age && (
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <p className="text-sm text-gray-500 mb-1">Age</p>
                <p className="text-xl font-bold text-gray-800">{age} years</p>
              </div>
            )}

            {/* Wallet Balance */}
            <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl p-5 shadow-md">
              <p className="text-sm text-gray-700 mb-1">Wallet Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{user?.walletBalance || 0}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
        <p>© 2025 Biswa Bangla Social Networking Services Club.</p>
      </div>
    </div>
  );
}
