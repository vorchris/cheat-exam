
import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

import pkg from '../../package.json'

// https://vitejs.dev/config/
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    vue()
  ],
  base: './',
 
  build: {
    sourcemap: true,
    outDir: '../../dist/renderer',
    emptyOutDir: true,
    minify: false,
    chunkSizeWarningLimit:5000
  },
  css: {   // this covers bootstrap css warnings when minifying the css code
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove();
              }
            }
          }
        }
      ]
    }
  },
  server: {
    port: pkg.env.PORT,
  },
})
