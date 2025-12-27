// FILE PATH: dating-app/frontend/tailwind.config.js
// Tailwind CSS configuration

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
        "dating-pink": "#ff69b4",
        "dating-purple": "#9b59b6",
        "dating-gold": "#ffd700",
      },
      fontFamily: {
        // Add custom fonts if needed
        // 'custom': ['YourFont', 'sans-serif']
      },
      spacing: {
        // Add custom spacing if needed
      },
    },
  },
  plugins: [],
};
