import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@primaria': path.resolve(__dirname, './src/primaria'),
      '@secundaria': path.resolve(__dirname, './src/secundaria'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'formik', 'yup'],
  },
});
