import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#2563eb",
          dark: "#0b1220",
          navy: "#0f172a",
        },
      },
      boxShadow: { card: "0 1px 2px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.05)" },
    },
  },
  plugins: [],
};
export default config;
