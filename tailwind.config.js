/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          text: 'var(--theme-text)',
          border: 'var(--theme-border)',
          bg: 'var(--theme-bg)',
        }
      }
    },
  },
  plugins: [],
}

