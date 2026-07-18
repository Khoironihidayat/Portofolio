/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["index.html"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "16px",
    },
    extend: {
      colors: {
        primary: "#00f0ff",
        secondary: "#64748b",
        dark: "#0a0a0f",
        neon: {
          cyan: "#00f0ff",
          purple: "#b400ff",
          pink: "#ff00c8",
          green: "#00ff88",
        },
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          800: "#0d1117",
          900: "#0a0a0f",
          950: "#050508",
        },
      },
      screens: {
        "2xl": "1320px",
      },
      boxShadow: {
        neon: "0 0 5px #00f0ff, 0 0 10px #00f0ff, 0 0 20px #00f0ff",
        "neon-sm": "0 0 3px #00f0ff, 0 0 6px #00f0ff",
        "neon-purple": "0 0 5px #b400ff, 0 0 10px #b400ff, 0 0 20px #b400ff",
        "neon-pink": "0 0 5px #ff00c8, 0 0 10px #ff00c8, 0 0 20px #ff00c8",
        "neon-green": "0 0 5px #00ff88, 0 0 10px #00ff88",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite alternate",
        "slide-up": "slide-up 0.5s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "typewriter": "typewriter 3s steps(30) 1s forwards",
        "blink": "blink 0.7s step-end infinite",
        "matrix": "matrix 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "glow-pulse": {
          "0%": { boxShadow: "0 0 5px #00f0ff, 0 0 10px #00f0ff" },
          "100%": { boxShadow: "0 0 10px #00f0ff, 0 0 20px #00f0ff, 0 0 40px #00f0ff" },
        },
        "slide-up": {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#00f0ff" },
        },
        matrix: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};
