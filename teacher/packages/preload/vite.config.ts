import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import pkg from '../../package.json'

export default defineConfig({
  root: __dirname,
  build: {
    target: 'esnext',
    outDir: '../../dist/preload',
    emptyOutDir: true,
    lib: {
      entry: 'preload.ts',
      formats: ['cjs'],
      fileName: () => '[name].cjs',
    },
    minify: true,
    // https://github.com/caoxiemeihao/electron-vue-vite/issues/61
    sourcemap: 'inline',
    rollupOptions: {
      external: [
        'electron',
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
})
