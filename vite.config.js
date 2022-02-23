import vuePlugin from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

/**
 * @type {import('vite').UserConfig}
 */


export default  {
  plugins: [
    vuePlugin(),
    vueJsx(),
  ],
  build: {
    minify: false
  }
}