import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ bên ngoài
    port: 80, // Chạy frontend trên port 80
    allowedHosts: ['chattop1.xyz'], // Cho phép domain
    proxy: {
      '/api': {
        target: 'http://13.211.117.49:5001', // Trỏ API về backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

