// FILE: frontend/src/components/host/account/MyVideos.jsx
// ✅ FIXED: Proper video management with Host ID

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Upload, Trash2, Play } from "lucide-react";
import { hostAPI, getServerURL } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";

const MyVideos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    console.log("🎥 MyVideos mounted");
    console.log("👤 User:", user);
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const response = await hostAPI.getVideos();

      console.log("✅ Videos loaded:", response.data);

      if (response.data.success) {
        setVideos(response.data.videos || []);
      }
    } catch (error) {
      console.error("❌ Failed to load videos:", error);
      setError("Failed to load videos");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVideo = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Only video files are allowed");
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setError("Video size must be less than 50MB");
      return;
    }

    setError("");
    setSelectedVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRecordVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsRecording(true);

        mediaRecorderRef.current = new MediaRecorder(stream);
        chunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          chunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          setSelectedVideo(blob);
          setPreview(URL.createObjectURL(blob));
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current.start();
      }
    } catch (error) {
      console.error("❌ Camera access error:", error);
      setError("Failed to access camera. Please grant camera permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedVideo) {
      setError("Please select or record a video");
      return;
    }

    // Check video limit (10 max)
    if (videos.length >= 10) {
      setError("Maximum 10 videos allowed. Please delete a video first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("video", selectedVideo);

      console.log("📤 Uploading video...");

      const response = await hostAPI.uploadVideo(formData);

      if (response.data.success) {
        setSuccess("Video uploaded successfully!");
        setSelectedVideo(null);
        setPreview(null);

        // Reload videos
        await loadVideos();

        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      setError(error.response?.data?.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async (videoIndex) => {
    if (!window.confirm("Are you sure you want to delete this video?")) {
      return;
    }

    try {
      console.log("🗑️ Deleting video at index:", videoIndex);

      const response = await hostAPI.deleteVideo(videoIndex);

      if (response.data.success) {
        setSuccess("Video deleted successfully!");
        await loadVideos();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      setError(error.response?.data?.message || "Failed to delete video");
    }
  };

  const getVideoURL = (videoPath) => {
    if (!videoPath) return null;
    const baseURL = getServerURL();
    return `${baseURL}${videoPath}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-8">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center shadow-md">
        <button
          onClick={() => navigate("/host/account")}
          className="flex items-center gap-2 text-gray-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-800">
          My Videos
        </h1>
        <div className="w-8"></div>
      </header>

      {/* Club Logo */}
      <div className="flex justify-center py-4">
        <img
          src={`${import.meta.env.BASE_URL}club-logo.png`}
          alt="Club Logo"
          className="h-14 w-14 object-contain"
          onError={(e) => {
            // Fallback to emoji if image fails
            e.target.style.display = "none";
            e.target.parentElement.innerHTML =
              '<div class="h-14 w-14 bg-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">♣️</div>';
          }}
        />
      </div>

      {/* Video Count */}
      <div className="px-6 mb-4">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-center text-gray-700">
            <span className="font-bold text-2xl text-pink-600">
              {videos.length}
            </span>
            <span className="text-gray-600"> / 10 videos uploaded</span>
          </p>
        </div>
      </div>

      {/* Video Preview/Recording Area */}
      <div className="px-6 mb-6">
        <div
          className="bg-black rounded-2xl overflow-hidden shadow-2xl"
          style={{ aspectRatio: "16/9" }}
        >
          {preview ? (
            <video
              src={preview}
              controls
              className="w-full h-full object-cover"
            />
          ) : isRecording ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="w-16 h-16 text-gray-600" />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          {!isRecording ? (
            <>
              <button
                onClick={handleSelectVideo}
                disabled={uploading || videos.length >= 10}
                className="bg-pink-400 text-white py-4 rounded-2xl font-semibold hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Select Video
              </button>

              <button
                onClick={handleRecordVideo}
                disabled={uploading || videos.length >= 10}
                className="bg-pink-400 text-white py-4 rounded-2xl font-semibold hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Video className="w-5 h-5" />
                Record Video
              </button>
            </>
          ) : (
            <button
              onClick={stopRecording}
              className="col-span-2 bg-red-500 text-white py-4 rounded-2xl font-semibold hover:bg-red-600 flex items-center justify-center gap-2"
            >
              ⏹️ Stop Recording
            </button>
          )}
        </div>

        {/* Upload Button */}
        {selectedVideo && !isRecording && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full mt-4 bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading..." : "✓ Upload Video"}
          </button>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-6 mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
          {success}
        </div>
      )}

      {/* Uploaded Videos List */}
      <div className="px-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Uploaded Videos ({videos.length}/10)
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-pink-500 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-md">
            <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No videos uploaded yet</p>
            <p className="text-sm text-gray-400 mt-2">
              Upload or record your first video!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((video, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 shadow-md flex items-center gap-4"
              >
                {/* Video Thumbnail */}
                <div className="relative w-32 h-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                  <video
                    src={getVideoURL(video)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    Video {index + 1}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tap to view full video
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteVideo(index)}
                  className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                  title="Delete video"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Footer */}
      <footer className="text-center px-4 py-8 mt-8">
        <p className="text-xs text-gray-600">
          © 2025 Biswa Bangla Social Networking Services Club.
        </p>
        <p className="text-xs text-gray-500">All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyVideos;
