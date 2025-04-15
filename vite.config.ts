import path from 'node:path';

import { preact } from '@preact/preset-vite';
import typescript from '@rollup/plugin-typescript';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, loadEnv, UserConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// Vite is used for JavaScript bundling and development server
// CSS is built separately by PostCSS
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const config: UserConfig = {
    define: {
      'process.env': env,
    },

    server: {
      port: 3020,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    plugins: [svgr(), preact()],

    test: {
      include: ['tests/unit/**/*.test.ts'],
      environment: 'happy-dom',
      globals: true,
    },
  };

  if (!env.VITE_TEST) {
    config.build = {
      sourcemap: true,
      manifest: true,
      minify: true,
      reportCompressedSize: true,
      lib: {
        entry: path.resolve(__dirname, 'src/index.tsx'),
        fileName: 'index',
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        plugins: [
          typescript({
            sourceMap: false,
            declaration: true,
            outDir: 'dist',
            include: [
              'node_modules/vite/client.d.ts',
              'src/**/*.ts',
              'src/**/*.tsx',
            ],
          }),
        ] as any[],
      },
    };
  }

  if (mode === 'production' && env.VITE_SENTRY_DSN) {
    config.plugins.push(
      sentryVitePlugin({
        authToken: env.SENTRY_AUTH_TOKEN,
        org: env.SENTRY_ORG,
        project: env.SENTRY_PROJECT,
      }),
    );
  }

  if (mode === 'development') {
    config.plugins.push({
      name: 'reload-on-public-file-change',
      handleHotUpdate({ file, server }) {
        if (file.includes('public')) {
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        }
      },
    });
  }

  return config;
});
