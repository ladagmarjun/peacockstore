import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Dev only: when VITE_API_URL is unset, the app calls /api on its own origin
  // and this proxy forwards it to the API, so session cookies stay same-origin.
  const target = env.API_PROXY_TARGET || 'http://localhost:3000';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api':     { target, changeOrigin: true },
        '/uploads': { target, changeOrigin: true },
      },
    },
  };
});
