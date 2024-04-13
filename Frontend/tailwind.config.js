/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors:{
        primary:{
          a: "var(--color-a)",
          b: "var(--color-b)",
          c: "var(--color-c)",
          e: "var(--color-e)",
          f: "var(--color-f)",
        },
        secondary:{
          d: "var(--color-d)",
        }
      }
    },
  },
  plugins: [],
}