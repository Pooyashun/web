import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Bind on all interfaces so the sandbox proxy can reach the dev server.
    host: true,
    port: 5173,
    strictPort: true,
  },
});
