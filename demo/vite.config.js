import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const config = {
    define: {
      'process.env': env,
    },
    base: '/recycling-locator',
  };

  return config;
});
