/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          "ironman-red": "#E62429",
          "ironman-gold": "#FFD700",
          "ironman-blue": "#00BFFF",
          "dark-bg": "#0A0A0A",
        },
      },
    },
    plugins: [],
  };