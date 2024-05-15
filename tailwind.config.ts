import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define la tipografía que deseas utilizar
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        customGreen: "#50FF6C",
        customGray: "#EBEBEB"

      }
    },
  },
  plugins: [],
};
export default config;
