import { defineConfig } from 'vite';  // เพิ่มการ import defineConfig

import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Local-Vibes-Web-app/',  
  server: {
    proxy: {
      '/api': 'http://localhost:3000' // เปลี่ยน `/api` เป็น endpoint ของคุณที่ backend ใช้
    }
  },
  css: {
    postcss: 'postcss.config.js',
  }
});



