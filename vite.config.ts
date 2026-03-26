import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/ow-darts-journey/',
  plugins: [react()],
  server: {
    port: 4173,
    strictPort: false,
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
    },
  },
});
