import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  server: {
    port: 5173,
    open: false,
    fs: {
      allow: ['.']
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022'
  },
  resolve: {
    alias: {
      '/assets': path.resolve(__dirname, 'assets'),
      'assets': path.resolve(__dirname, 'assets')
    }
  }
});
