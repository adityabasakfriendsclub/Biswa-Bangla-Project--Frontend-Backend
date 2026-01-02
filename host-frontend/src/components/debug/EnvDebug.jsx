// FILE: frontend/src/components/debug/EnvDebug.jsx
// PURPOSE: Temporary component to verify environment variables are loaded
// ⚠️ DELETE THIS FILE AFTER DEBUGGING

import React from "react";

const EnvDebug = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-100 border-b-4 border-yellow-500 p-4 z-50">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        🔍 Environment Debug Info
      </h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold">Mode:</p>
          <code className="bg-gray-200 px-2 py-1 rounded">
            {import.meta.env.MODE}
          </code>
        </div>

        <div>
          <p className="font-semibold">DEV:</p>
          <code className="bg-gray-200 px-2 py-1 rounded">
            {String(import.meta.env.DEV)}
          </code>
        </div>

        <div>
          <p className="font-semibold">VITE_API_URL:</p>
          <code className="bg-gray-200 px-2 py-1 rounded">
            {import.meta.env.VITE_API_URL || "❌ NOT SET"}
          </code>
        </div>

        <div>
          <p className="font-semibold">VITE_SOCKET_URL:</p>
          <code className="bg-gray-200 px-2 py-1 rounded">
            {import.meta.env.VITE_SOCKET_URL || "❌ NOT SET"}
          </code>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white rounded">
        <p className="font-semibold mb-2">All Environment Variables:</p>
        <pre className="text-xs overflow-auto max-h-40">
          {JSON.stringify(import.meta.env, null, 2)}
        </pre>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>✅ If VITE_API_URL shows a URL, your .env is working correctly</p>
        <p>❌ If it shows "NOT SET", your .env file is missing or not loaded</p>
        <p>🔄 After fixing .env, restart dev server with: npm run dev</p>
      </div>
    </div>
  );
};

export default EnvDebug;
