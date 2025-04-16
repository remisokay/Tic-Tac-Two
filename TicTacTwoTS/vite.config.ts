import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src', // Optional: tells Vite to use 'src' as the root (if you're organizing like that)
  build: {
    outDir: '../dist', // Output folder relative to root
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Customize your dev server port
    open: true, // Opens browser on server start
  },
});