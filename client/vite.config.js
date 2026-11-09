import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiPort = Number(process.env.PORT || env.PORT || 5000);
  const clientPort = Number(process.env.VITE_PORT || env.VITE_PORT || 3000);

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: clientPort,
      strictPort: false,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          secure: false,
        },
        '/uploads': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
