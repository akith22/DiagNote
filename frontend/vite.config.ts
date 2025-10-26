import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  base: './',

  build: {
    outDir: 'dist',
  },

  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
        secure: false,
      }
    }
  },
});