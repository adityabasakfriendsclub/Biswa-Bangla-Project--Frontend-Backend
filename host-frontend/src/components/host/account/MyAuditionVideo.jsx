import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, Eye } from "lucide-react";
import { hostAPI } from "../../../services/api";

const MyAuditionVideo = () => {
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingVideo, setExistingVideo] = useState(null);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    loadAuditionVideo();
  }, []);

  const loadAuditionVideo = async () => {
    try {
      const response = await hostAPI.getAuditionVideo();
      if (response.data.success && response.data.auditionVideo) {
        setExistingVideo(response.data.auditionVideo.url);
        setStatus(response.data.auditionVideo.status);
      }
    } catch (error) {
      console.error("Failed to load audition video");
    }
  };

  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["video/mp4", "video/webm"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only MP4 and WebM videos are allowed");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("Video size must be less than 50MB");
      return;
    }

    setError("");
    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setVideo(blob);
        setPreview(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      setError("Failed to access camera");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUpload = async () => {
    if (!video) {
      setError("Please select or record a video");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("auditionVideo", video);

      const response = await hostAPI.uploadAuditionVideo(formData);

      if (response.data.success) {
        setSuccess("Audition video uploaded successfully!");
        setTimeout(() => navigate("/host/account"), 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5E6D3] to-[#FFE4E1] pb-8">
      <header className="bg-white px-6 py-4 flex items-center shadow-md">
        <button onClick={() => navigate("/host/account")}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-xl font-bold">
          My Audition Video
        </h1>
      </header>

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

      {status && (
        <div
          className={`mx-6 mb-4 p-4 rounded-xl ${
            status === "approved"
              ? "bg-green-100"
              : status === "rejected"
              ? "bg-red-100"
              : "bg-yellow-100"
          }`}
        >
          <p>
            Status: <span className="font-semibold capitalize">{status}</span>
          </p>
        </div>
      )}

      <div className="px-6 mb-6">
        <div
          className="bg-black rounded-2xl overflow-hidden"
          style={{ aspectRatio: "16/9" }}
        >
          {preview ? (
            <video src={preview} controls className="w-full h-full" />
          ) : existingVideo ? (
            <video
              src={`http://localhost:3000${existingVideo}`}
              controls
              className="w-full h-full"
            />
          ) : (
            <video ref={videoRef} className="w-full h-full" />
          )}
        </div>
      </div>

      <div className="px-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <label className="bg-pink-300 text-white text-center py-4 rounded-2xl font-semibold cursor-pointer hover:bg-pink-400 flex items-center justify-center gap-2">
            <Video className="w-5 h-5" />
            Select Video
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoSelect}
              className="hidden"
              disabled={uploading || status === "approved"}
            />
          </label>

          <button
            onClick={recording ? stopRecording : startRecording}
            className="bg-pink-300 text-white py-4 rounded-2xl font-semibold hover:bg-pink-400 flex items-center justify-center gap-2"
            disabled={uploading || status === "approved"}
          >
            <Video className="w-5 h-5" />
            {recording ? "Stop" : "Record Video"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-100 text-green-700 rounded-xl">
            {success}
          </div>
        )}

        {status !== "approved" && (
          <button
            onClick={handleUpload}
            disabled={uploading || !video}
            className="w-full bg-pink-400 text-white text-lg font-bold py-4 rounded-2xl hover:bg-pink-500 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        )}
      </div>

      <footer className="text-center px-4 py-8">
        <p className="text-xs text-gray-600">
          © 2025 Biswa Bangla Social Networking Services Club.
        </p>
        <p className="text-xs text-gray-500">All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyAuditionVideo;
