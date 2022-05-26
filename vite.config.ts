import { defineConfig } from 'vite';

const isProduction = process.env['NODE_ENV'] === 'production';

export default defineConfig({
  base: '',
  build: {
    outDir: 'www',
  },
  define: {
    GC_PRODUCTION: isProduction,
    GAME_BUILD_NUM: JSON.stringify(process.env.CIRCLE_BUILD_NUM),
    BRANCH: JSON.stringify(process.env.CIRCLE_BRANCH || 'develop'),
  },
  server: {
    port: 8093,
  },
});
