import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://103.45.235.153',
        changeOrigin: true,
        secure: false,
      },
      // 👇 Thêm proxy WebSocket cho Socket.IO
      '/socket.io': {
        target: 'http://103.45.235.153',
        ws: true,             // Bắt buộc để hỗ trợ WebSocket
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
  base: '/',
});
