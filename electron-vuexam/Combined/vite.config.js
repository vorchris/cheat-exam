import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    base: path.join(__dirname, "./dist/"),
    plugins: [vue()],
    build: {
        minify: false,
        rollupOptions: {
            external: [
                "./src/assets/css/bootstrap.min.css",
                "./src/assets/js/bootstrap.bundle.min.js",
                "./src/assets/css/style-main.css"
            ]
        }
      }
})
