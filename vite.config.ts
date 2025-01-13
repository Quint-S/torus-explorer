import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
  },
  base: "",
  css: {
    postcss: './postcss.config.js', // If you're using PostCSS
  },
})
