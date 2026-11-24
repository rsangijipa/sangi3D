import { defineConfig } from 'vite';

// Caminhos relativos: o build funciona servido na raiz ou em qualquer subdiretório (Launcher, iframe).
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
