import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
   proxy:{
    "/api":{
      target: "http://localhost:5000",
      changeOrigin: true,
      secure: false,
    }
   }
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/@reduxjs') || id.includes('node_modules/react-redux')) {
            return 'vendor-state';
          }
          if (id.includes('node_modules/@tanstack')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-axios';
          }
          if (
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/@hookform') ||
            id.includes('node_modules/zod')
          ) {
            return 'vendor-forms';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('node_modules/qrcode')) {
            return 'vendor-qr';
          }
        },
      },
    },
  },
})

