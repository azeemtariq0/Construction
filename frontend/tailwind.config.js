/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Montserrat", sans-serif'],
    },
    extend: {
      colors: {
        red: {
          1: "#ce0105",
        },
        gray: {
          1: "#4b4c4c",
        },
      },
    },
  },
  plugins: [],
};
