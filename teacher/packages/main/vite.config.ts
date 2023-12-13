import { builtinModules } from 'module'
import { defineConfig } from 'vite'
import pkg from '../../package.json'

export default defineConfig({
  root: __dirname,
  build: {
    outDir: '../../dist/main',
    emptyOutDir: true,

    lib: {
      entry: 'main.ts',
      formats: ['cjs'],
      fileName: () => '[name].cjs',
    },
    minify: true,
    sourcemap: true,
    rollupOptions: {
      external: [
        'electron',
        'electron-log',
        ...builtinModules,
        ...Object.keys(pkg.dependencies || {}),
      ],
    },
  },
})
