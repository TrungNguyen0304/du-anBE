import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // optional
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // Hoặc './' nếu bạn host ở subpath (như GitHub Pages)
})