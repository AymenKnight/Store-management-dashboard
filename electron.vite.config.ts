import path from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
// import electron from 'vite-plugin-electron';
import svgr from 'vite-plugin-svgr';
// import dotenv from 'dotenv';

// const env = dotenv.config().parsed;

export default defineConfig(() => ({
  define: {
    'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
  },
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        // Define your module aliases here
        '@components': path.resolve(
          __dirname,
          'src/renderer/src/ui/components',
        ),
        '@buttons': path.resolve(
          __dirname,
          'src/renderer/src/ui/components/buttons',
        ),
        '@containers': path.resolve(
          __dirname,
          'src/renderer/src/ui/containers',
        ),
        '@layers': path.resolve(__dirname, 'src/renderer/src/ui/layers'),
        '@assets': path.resolve(__dirname, 'src/renderer/src/assets'),
        '@libs': path.resolve(__dirname, 'src/renderer/src/libs'),
        '@constants': path.resolve(
          __dirname,
          'src/renderer/src/utils/constants',
        ),
        '@helpers': path.resolve(__dirname, 'src/renderer/src/utils/helpers'),
        '@models': path.resolve(__dirname, 'src/renderer/src/models'),
        toSvg: path.resolve(__dirname, 'src/renderer/src/assets/svg'),
        toPng: path.resolve(__dirname, 'src/renderer/src/assets/pictures'),
        '@api': path.resolve(__dirname, 'src/renderer/src/API'),
        '@colors': path.resolve(
          __dirname,
          'src/renderer/src/assets/styles/color.ts',
        ),
        '@stores': path.resolve(__dirname, 'src/renderer/src/services/zustand'),
        '@services': path.resolve(__dirname, 'src/renderer/src/services'),
        '~styles': path.resolve(__dirname, 'src/renderer/src/assets/styles/'),
        '~font': path.resolve(__dirname, 'src/renderer/src/assets/font/'),
      },
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
      svgr({
        include: '**/*.svg',
      }),
    ],
  },
}));
