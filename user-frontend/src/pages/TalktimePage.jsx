// // new2
// // src/pages/TalktimePage.jsx - UPDATED VERSION
// import { useState } from "react";

// const RAZORPAY_KEY_ID = "rzp_live_ROvZlFRfYLsKLh";
// const API_BASE_URL = "http://localhost:3000/api";

// // Load Razorpay script
// const loadRazorpayScript = () => {
//   return new Promise((resolve) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

// const TALKTIME_PLANS = [
//   { amount: 25, minutes: 1 },
//   { amount: 50, minutes: 2 },
//   { amount: 100, minutes: 4 },
//   { amount: 200, minutes: 7 },
//   { amount: 400, minutes: 10 },
//   { amount: 800, minutes: 13 },
//   { amount: 1600, minutes: 18 },
//   { amount: 2300, minutes: 27 },
//   { amount: 4500, minutes: 60 },
// ];

// export default function TalktimePage({ user, onBack, onBalanceUpdate }) {
//   const [processing, setProcessing] = useState(false);
//   const walletBalance = user?.walletBalance || 0;

//   // Calculate available talktime (₹25 per minute)
//   const availableTalktime = Math.floor(walletBalance / 25);

//   const handlePay = async (amount) => {
//     if (processing) return;

//     const scriptLoaded = await loadRazorpayScript();
//     if (!scriptLoaded) {
//       alert(
//         "❌ Failed to load Razorpay. Please check your internet connection.",
//       );
//       return;
//     }

//     setProcessing(true);

//     try {
//       const token =
//         localStorage.getItem("token") || localStorage.getItem("userToken");

//       console.log("📤 Creating Razorpay order...");
//       const orderResponse = await fetch(`${API_BASE_URL}/wallet/create-order`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount }),
//       });

//       const orderData = await orderResponse.json();
//       console.log("📥 Order Response:", orderData);

//       if (!orderData.success) {
//         throw new Error(orderData.message || "Failed to create order");
//       }

//       const options = {
//         key: RAZORPAY_KEY_ID,
//         amount: orderData.data.amount,
//         currency: "INR",
//         name: "Biswa Bangla Video Call",
//         description: `Add ₹${amount} Talktime`,
//         order_id: orderData.data.orderId,

//         handler: async function (response) {
//           console.log("✅ Payment Success:", response);

//           try {
//             const verifyResponse = await fetch(
//               `${API_BASE_URL}/wallet/verify-payment`,
//               {
//                 method: "POST",
//                 headers: {
//                   Authorization: `Bearer ${token}`,
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({
//                   razorpay_order_id: response.razorpay_order_id,
//                   razorpay_payment_id: response.razorpay_payment_id,
//                   razorpay_signature: response.razorpay_signature,
//                   amount,
//                 }),
//               },
//             );

//             const verifyData = await verifyResponse.json();
//             console.log("📥 Verification Response:", verifyData);

//             if (verifyData.success) {
//               alert(`✅ Payment Successful! ₹${amount} added to your wallet.`);
//               onBalanceUpdate?.(verifyData.data.newBalance);
//             } else {
//               alert("❌ Payment verification failed. Please contact support.");
//             }
//           } catch (error) {
//             console.error("❌ Verification error:", error);
//             alert("❌ Payment verification failed. Please contact support.");
//           } finally {
//             setProcessing(false);
//           }
//         },

//         prefill: {
//           name: `${user?.firstName || ""} ${user?.lastName || ""}`,
//           contact: user?.phone || "",
//           email: user?.email || "",
//         },

//         theme: {
//           color: "#ec4899",
//         },

//         modal: {
//           ondismiss: function () {
//             console.log("❌ Payment cancelled by user");
//             setProcessing(false);
//           },
//         },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (error) {
//       console.error("❌ Payment error:", error);
//       alert("Failed to initiate payment. Please try again.");
//       setProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-pink-200 to-pink-100">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-pink-300 to-pink-400 p-6 flex items-center justify-between sticky top-0 z-10 shadow-md">
//         <button
//           onClick={onBack}
//           className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//         </button>

//         <h1 className="text-2xl font-bold text-white flex-1 ml-4">Talktime</h1>

//         <div className="bg-yellow-300 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 border-2 border-yellow-400">
//           <span>💰</span>
//           <span>₹{walletBalance}</span>
//         </div>
//       </div>

//       {/* Balance & Talktime Info */}
//       <div className="p-6 space-y-4">
//         {/* Wallet Balance Card */}
//         <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-3xl p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-gray-700 text-sm font-medium mb-1">
//                 Wallet Balance
//               </p>
//               <p className="text-4xl font-bold text-gray-900">
//                 ₹{walletBalance}
//               </p>
//             </div>
//             <div className="text-6xl">💰</div>
//           </div>
//         </div>

//         {/* Available Talktime Card */}
//         <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-3xl p-6 shadow-lg">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-white text-sm font-medium mb-1">
//                 Available Talktime
//               </p>
//               <p className="text-4xl font-bold text-white">
//                 {availableTalktime}{" "}
//                 {availableTalktime === 1 ? "minute" : "minutes"}
//               </p>
//               <p className="text-white text-xs mt-2 opacity-90">
//                 @ ₹25 per minute
//               </p>
//             </div>
//             <div className="text-6xl">⏱️</div>
//           </div>
//         </div>

//         {/* Info Text */}
//         <div className="bg-white/80 rounded-2xl p-4 text-center">
//           <p className="text-sm text-gray-600 mb-2">
//             💡 Recharge your wallet to enjoy uninterrupted video calls
//           </p>
//           <p className="text-xs text-gray-500">
//             Each minute of video call costs ₹25
//           </p>
//         </div>
//       </div>

//       {/* Talktime Plans Grid */}
//       <div className="px-6 pb-24">
//         <h2 className="text-xl font-bold text-gray-800 mb-4">Recharge Plans</h2>
//         <div className="grid grid-cols-3 gap-4">
//           {TALKTIME_PLANS.map((plan) => (
//             <div
//               key={plan.amount}
//               className="bg-white rounded-3xl shadow-lg overflow-hidden"
//             >
//               {/* Price & Duration */}
//               <div className="p-6 text-center bg-gradient-to-b from-white to-gray-50">
//                 <p className="text-3xl font-bold text-gray-800 mb-2">
//                   ₹{plan.amount}
//                 </p>
//                 <p className="text-lg font-semibold text-gray-600">
//                   {plan.minutes >= 60
//                     ? `${plan.minutes / 60} hr`
//                     : `${plan.minutes} min`}
//                 </p>
//               </div>

//               {/* Pay Button */}
//               <button
//                 onClick={() => handlePay(plan.amount)}
//                 disabled={processing}
//                 className="w-full bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white font-bold py-4 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {processing ? "Processing..." : `Pay ₹${plan.amount}`}
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Footer Info */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
//         <p>🔒 Secured by Razorpay • Talk time will be added instantly</p>
//         <p className="mt-1">
//           © 2025 Biswa Bangla Social Networking Services Club.
//         </p>
//       </div>
//     </div>
//   );
// }

// demo mode
// src/pages/TalktimePage.jsx - RAZORPAY DEMO MODE IMPLEMENTATION
import { useState } from "react";

// ==================== RAZORPAY CONFIGURATION ====================
const API_BASE_URL = "http://localhost:3000/api";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ==================== TALKTIME PLANS ====================
const TALKTIME_PLANS = [
  { amount: 25, minutes: 1 },
  { amount: 50, minutes: 2 },
  { amount: 100, minutes: 4 },
  { amount: 200, minutes: 7 },
  { amount: 400, minutes: 10 },
  { amount: 800, minutes: 13 },
  { amount: 1600, minutes: 18 },
  { amount: 2300, minutes: 27 },
  { amount: 4500, minutes: 60 },
];

// ==================== MAIN COMPONENT ====================
export default function TalktimePage({ user, onBack, onBalanceUpdate }) {
  const [processing, setProcessing] = useState(false);
  const walletBalance = user?.walletBalance || 0;

  // Calculate available talktime (₹25 per minute)
  const availableTalktime = Math.floor(walletBalance / 25);

  // ==================== HANDLE PAYMENT ====================
  const handlePay = async (amount) => {
    if (processing) return;

    // Step 1: Load Razorpay SDK
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert(
        "❌ Failed to load Razorpay. Please check your internet connection.",
      );
      return;
    }

    setProcessing(true);

    try {
      const token =
        localStorage.getItem("token") || localStorage.getItem("userToken");

      // Step 2: Create Order on Backend
      console.log("📤 Creating Razorpay order (DEMO MODE)...");
      const orderResponse = await fetch(`${API_BASE_URL}/wallet/create-order`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const orderData = await orderResponse.json();
      console.log("📥 Order Response (DEMO):", orderData);

      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Step 3: Configure Razorpay Options (DEMO MODE)
      const options = {
        key: orderData.data.keyId, // ✅ Get from backend response
        amount: orderData.data.amount, // Amount in paise
        currency: "INR",
        name: "Biswa Bangla Video Call",
        description: `Add ₹${amount} Talktime (DEMO)`,
        order_id: orderData.data.orderId,
        image: "/logo.png", // Optional: Your logo

        // Step 4: Payment Success Handler
        handler: async function (response) {
          console.log("✅ Payment Success (DEMO):", response);

          try {
            // Verify payment on backend
            const verifyResponse = await fetch(
              `${API_BASE_URL}/wallet/verify-payment`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount,
                }),
              },
            );

            const verifyData = await verifyResponse.json();
            console.log("📥 Verification Response (DEMO):", verifyData);

            if (verifyData.success) {
              // ✅ Success - Update wallet balance
              const newBalance = verifyData.data.newBalance;
              const newTalktime = Math.floor(newBalance / 25);

              alert(
                `✅ Payment Successful! ₹${amount} added to your wallet.\n\n💰 New Balance: ₹${newBalance}\n⏱️ Available Talktime: ${newTalktime} minutes`,
              );

              // Update balance in parent component
              onBalanceUpdate?.(newBalance);
            } else {
              alert("❌ Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("❌ Verification error:", error);
            alert("❌ Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },

        // Step 5: Prefill User Data
        prefill: {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`,
          contact: user?.phone || "",
          email: user?.email || "",
        },

        // Step 6: UI Customization
        theme: {
          color: "#ec4899", // Pink color
        },

        // Step 7: Payment Modal Closed Handler
        modal: {
          ondismiss: function () {
            console.log("❌ Payment cancelled by user (DEMO)");
            setProcessing(false);
          },
        },

        // ✅ DEMO MODE NOTES
        notes: {
          mode: "demo",
          description: "Test payment - No real money deducted",
        },
      };

      // Step 8: Open Razorpay Payment Modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
      setProcessing(false);
    }
  };

  // ==================== RENDER UI ====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-pink-100">
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
          Talktime (DEMO MODE)
        </h1>

        <div className="bg-yellow-300 text-gray-800 px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 border-2 border-yellow-400">
          <span>💰</span>
          <span>₹{walletBalance}</span>
        </div>
      </div>

      {/* Demo Mode Banner */}
      <div className="bg-yellow-400 text-gray-900 px-4 py-3 text-center font-medium">
        🧪 DEMO MODE: Use test cards - No real money will be charged
      </div>

      {/* Balance & Talktime Info */}
      <div className="p-6 space-y-4">
        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium mb-1">
                Wallet Balance
              </p>
              <p className="text-4xl font-bold text-gray-900">
                ₹{walletBalance}
              </p>
              <p className="text-xs text-gray-600 mt-1">💳 Demo Wallet</p>
            </div>
            <div className="text-6xl">💰</div>
          </div>
        </div>

        {/* Available Talktime Card */}
        <div className="bg-gradient-to-r from-pink-300 to-pink-400 rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-medium mb-1">
                Available Talktime
              </p>
              <p className="text-4xl font-bold text-white">
                {availableTalktime}{" "}
                {availableTalktime === 1 ? "minute" : "minutes"}
              </p>
              <p className="text-white text-xs mt-2 opacity-90">
                @ ₹25 per minute
              </p>
            </div>
            <div className="text-6xl">⏱️</div>
          </div>
        </div>

        {/* Test Card Info */}
        <div className="bg-blue-500/10 border-2 border-blue-500/50 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-700 mb-2 font-semibold">
            🔐 Test Card Details (DEMO)
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Card: 4111 1111 1111 1111</p>
            <p>CVV: Any 3 digits</p>
            <p>Expiry: Any future date</p>
          </div>
        </div>

        {/* Info Text */}
        <div className="bg-white/80 rounded-2xl p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            💡 Recharge your wallet to enjoy uninterrupted video calls
          </p>
          <p className="text-xs text-gray-500">
            Each minute of video call costs ₹25
          </p>
        </div>
      </div>

      {/* Talktime Plans Grid */}
      <div className="px-6 pb-24">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recharge Plans (DEMO)
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {TALKTIME_PLANS.map((plan) => (
            <div
              key={plan.amount}
              className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform"
            >
              {/* Price & Duration */}
              <div className="p-6 text-center bg-gradient-to-b from-white to-gray-50">
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  ₹{plan.amount}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  {plan.minutes >= 60
                    ? `${plan.minutes / 60} hr`
                    : `${plan.minutes} min`}
                </p>
              </div>

              {/* Pay Button */}
              <button
                onClick={() => handlePay(plan.amount)}
                disabled={processing}
                className="w-full bg-gradient-to-r from-pink-300 to-pink-400 hover:from-pink-400 hover:to-pink-500 text-white font-bold py-4 text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? "Processing..." : `Pay ₹${plan.amount}`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="fixed bottom-0 left-0 right-0 bg-white px-6 py-4 text-center text-xs text-gray-600 border-t border-gray-200">
        <p>🔒 Secured by Razorpay (DEMO MODE) • Talktime added instantly</p>
        <p className="mt-1">
          © 2026 Biswa Bangla Social Networking Services Club.
        </p>
      </div>
    </div>
  );
}
