import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { // Add server configuration
    proxy: {
      // Proxy requests starting with /api to your Django backend
      '/api': {
        target: 'http://127.0.0.1:8000', // Your Django backend address
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // Optional: Set to false if backend uses http
      },
    }
  }
})
