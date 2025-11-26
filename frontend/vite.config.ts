import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react-router-dom'],
    exclude: ['@remix-run/router'],
    esbuildOptions: {
      mainFields: ['module', 'main'],
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
