import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: env.OPENROUTER_API_KEY
          ? {
              '/api/openrouter': {
                target: 'https://openrouter.ai',
                changeOrigin: true,
                rewrite: () => '/api/v1/chat/completions',
                headers: {
                  Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
                  'X-Title': 'Fleet Dispatch System (Local Dev Proxy)',
                },
              },
            }
          : undefined,
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      }
    };
});
