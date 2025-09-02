/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        blackx: "#0B0B0B",
        gold: "#D8B63C",
        vermillion: "#C42631",
        salsa: "#03684E",
        sun: "#F6BC00",
        tortilla: "#FFF4DE"
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        caps: ['"Alfa Slab One"', "serif"],
        script: ['"Pacifico"', "cursive"],
        body: ["Poppins", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
