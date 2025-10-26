import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Determine if we are in production
const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.VITE_API_URL || 'http://localhost:8080';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  base: './', // important for Vercel deployment

  build: {
    outDir: 'dist', // default, optional
  },

  server: {
    proxy: !isProduction
      ? {
          // Local dev proxy
          '/api': API_URL,
        }
      : undefined,
  },
});
