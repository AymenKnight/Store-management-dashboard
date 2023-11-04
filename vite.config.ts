import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import pkg from './package.json'
import svgr from 'vite-plugin-svgr';
import dotenv from 'dotenv';

const env = dotenv.config().parsed;

// https://vitejs.dev/config/
export default defineConfig(({ command,mode }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    define: {
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
    },
    resolve: {
      alias: {
        // Define your module aliases here
        '@components': path.resolve(__dirname, 'src/ui/components'),
        '@buttons': path.resolve(__dirname, 'src/ui/components/buttons'),
        '@containers': path.resolve(__dirname, 'src/ui/containers'),
        '@layers': path.resolve(__dirname, 'src/ui/layers'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@libs': path.resolve(__dirname, 'src/libs'),
        '@constants': path.resolve(__dirname, 'src/utils/constants'),
        '@helpers': path.resolve(__dirname, 'src/utils/helpers'),
        '@models': path.resolve(__dirname, 'src/models'),
        toSvg: path.resolve(__dirname, 'src/assets/svg'),
        toPng: path.resolve(__dirname, 'src/assets/pictures'),
        '@api': path.resolve(__dirname, 'src/API'),
        '@colors': path.resolve(__dirname, 'src/assets/styles/color.ts'),
        '@stores': path.resolve(__dirname, 'src/services/zustand'),
        '@services': path.resolve(__dirname, 'src/services'),
        '~styles': path.resolve(__dirname, 'src/assets/styles/'),
        '~font': path.resolve(__dirname, 'src/assets/font/'),
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
  
      }),
      electron([
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main/index.ts',
          onstart(options) {
            if (process.env.VSCODE_DEBUG) {
              console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')
            } else {
              options.startup()
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: 'dist-electron/main',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        },
        {
          entry: 'electron/preload/index.ts',
          onstart(options) {
            // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
            // instead of restarting the entire Electron App.
            options.reload()
          },
          vite: {
            build: {
              sourcemap: sourcemap ? 'inline' : undefined, // #332
              minify: isBuild,
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys('dependencies' in pkg ? pkg.dependencies : {}),
              },
            },
          },
        }
      ]),
      // Use Node.js API in the Renderer-process
      renderer(),
    ],
    server: process.env.VSCODE_DEBUG && (() => {
      const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
      return {
        host: url.hostname,
        port: +url.port,
      }
    })(),
    clearScreen: false,
  }
})
