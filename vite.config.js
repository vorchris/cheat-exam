const vuePlugin = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const virtualFile = '@virtual-file'
const virtualId = '\0' + virtualFile
const nestedVirtualFile = '@nested-virtual-file'
const nestedVirtualId = '\0' + nestedVirtualFile

/**
 * @type {import('vite').UserConfig}
 */
module.exports = {
  plugins: [
    vuePlugin(),
    vueJsx(),
  ],
  build: {
    minify: false
  }
}
