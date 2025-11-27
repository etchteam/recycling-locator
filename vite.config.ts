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
  const privateEnv = loadEnv(mode, process.cwd());
  const publicEnv = loadEnv(mode, process.cwd(), ['VITE_']);

  const config: UserConfig = {
    define: {
      'process.env': publicEnv,
    },

    server: {
      port: 3020,
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    plugins: [
      svgr(),
      preact({
        babel: {
          plugins: ['@babel/plugin-syntax-import-attributes'],
        },
      }),
    ],

    test: {
      include: ['tests/unit/**/*.test.ts'],
      environment: 'happy-dom',
      globals: true,
    },
  };

  if (!publicEnv.VITE_TEST) {
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

  if (mode === 'production' && publicEnv.VITE_SENTRY_DSN) {
    config.plugins.push(
      sentryVitePlugin({
        authToken: privateEnv.SENTRY_AUTH_TOKEN,
        org: privateEnv.SENTRY_ORG,
        project: privateEnv.SENTRY_PROJECT,
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
