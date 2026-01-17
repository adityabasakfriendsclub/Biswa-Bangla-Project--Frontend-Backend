// src/pages/VideoCallPage.jsx
import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export default function VideoCallPage({ callData, onEndCall }) {
  const videoRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => (videoRef.current.srcObject = stream));

    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
      if ((seconds + 1) % 60 === 0) {
        api.post("/call/billing", {
          callId: callData.callId,
          amount: 25,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-white">
      <video ref={videoRef} autoPlay muted className="w-40 h-40" />
      <p>Duration: {Math.floor(seconds / 60)} min</p>

      <button onClick={onEndCall} className="bg-red-500 px-6 py-3 rounded">
        End Call
      </button>
    </div>
  );
}
