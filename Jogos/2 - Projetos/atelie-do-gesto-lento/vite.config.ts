import { defineConfig } from 'vite';

// Build estática com caminhos relativos: o launcher abre dist/index.html.
export default defineConfig({
  base: './',
  publicDir: 'public',
  server: { port: 5173, open: false },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
  },
});
