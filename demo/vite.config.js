import { resolve } from 'node:path';

import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_']);

  const config = {
    define: {
      'process.env': env,
    },
    base: '/recycling-locator',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
          welsh: resolve(__dirname, 'welsh.html'),
          branded: resolve(__dirname, 'branded.html'),
        },
      },
    },
  };

  return config;
});
