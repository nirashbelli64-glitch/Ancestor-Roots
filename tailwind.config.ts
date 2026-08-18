import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#0A0612",
          light: "#140C24",
          card: "rgba(18, 10, 32, 0.78)",
          border: "rgba(225, 0, 255, 0.18)",
        },
        charcoal: {
          DEFAULT: "#0A0612",
          light: "#140C24",
          dark: "#06030A",
          card: "rgba(18, 10, 32, 0.78)",
          border: "rgba(225, 0, 255, 0.18)",
        },
        aurora: {
          pink: "#E100FF",
          purple: "#A855F7",
          violet: "#8B5CF6",
          magenta: "#F43F5E",
          crystal: "#F7F7F7",
          soft: "rgba(225, 0, 255, 0.15)",
        },
        ember: {
          DEFAULT: "#E100FF",
          glow: "#F472B6",
          light: "#FBCFE8",
          dark: "#C026D3",
          soft: "rgba(225, 0, 255, 0.15)",
        },
        gold: {
          DEFAULT: "#C084FC",
          light: "#E9D5FF",
          dark: "#9333EA",
          soft: "rgba(192, 132, 252, 0.15)",
        },
        teal: {
          provenance: "#38BDF8",
          soft: "rgba(56, 189, 248, 0.15)",
        },
        memory: {
          green: "#34D399",
          soft: "rgba(52, 211, 153, 0.15)",
        },
        ancestor: {
          cyan: "#C084FC",
          soft: "rgba(192, 132, 252, 0.15)",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "glow-pink": "0 0 25px rgba(225, 0, 255, 0.45), 0 0 50px rgba(225, 0, 255, 0.2)",
        "glow-purple": "0 0 25px rgba(168, 85, 247, 0.45), 0 0 50px rgba(168, 85, 247, 0.2)",
        "glow-violet": "0 0 25px rgba(139, 92, 246, 0.45), 0 0 50px rgba(139, 92, 246, 0.2)",
        "glow-ember": "0 0 25px rgba(225, 0, 255, 0.45), 0 0 50px rgba(225, 0, 255, 0.2)",
        "glow-gold": "0 0 25px rgba(192, 132, 252, 0.45), 0 0 50px rgba(192, 132, 252, 0.2)",
        "glow-green": "0 0 25px rgba(52, 211, 153, 0.45), 0 0 50px rgba(52, 211, 153, 0.2)",
        "glow-cyan": "0 0 25px rgba(56, 189, 248, 0.45), 0 0 50px rgba(56, 189, 248, 0.2)",
      },
      animation: {
        "flicker": "flicker 3s infinite alternate ease-in-out",
        "float": "float 6s infinite ease-in-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "reticle-spin": "spin 20s linear infinite",
        "sweep": "sweep 2.5s ease-in-out infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.98)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        sweep: {
          "0%": { top: "0%", opacity: "0.8" },
          "50%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
