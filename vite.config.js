import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // https: true,
    proxy: {
      '/api/oauth2/token': {
        target: 'https://account.stubhub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/oauth2\/token/, '/oauth2/token'),
        secure: true,
      },
      '/api/catalog/events': {
        target: 'https://api.stubhub.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/catalog\/events/, '/catalog/events'),
        secure: true,
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove console logs and debugger statements in production
  },
});
