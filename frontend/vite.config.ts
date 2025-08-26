import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // String shorthand: '/api' -> 'http://localhost:8080/api'
      '/api': {
        target: 'http://localhost:8080', // Your backend server
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // Set to false if your backend is not running on HTTPS
        ws: true, // If you want to proxy websockets
      },
    },
  },
});
