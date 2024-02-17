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
      backgroundColor:{
        skin:{
          icon: 'var(--icon-color)',
          overlayBG: 'var(--background-color)',
          body: 'var(--body-color)',
          foreground : 'var(--foreground-color)',
          button: 'var(--button-color)',
          opaque : 'var(--opaque-color)',
          bar: 'var(--bar-color)',
          narrator: 'var(--narrator-color)',
        }
      },
      colors:{
        skin:{
          icon: 'var(--icon-color)',
          base: 'var(--text-color)',
          hover : 'var(--hover-text-color)',
          narrator: 'var(--narrator-color)',
          invert: 'var(--invert-text-color)',
        }
      },
      boxShadowColor:{
        skin:{
          base: 'var(--shadow-color)',
        }
      },
      borderColor:{
        skin:{
          base: 'var(--border-color)',
        }
      }
    },
  },
  plugins: [],
}