# electron-vue-vite

├
├── dist                      Will be generated following the structure of "packages" directory
├   ├── main
├   ├── preload
├   ├── renderer
├
├── scripts
├   ├── build.mjs             Build script -> npm run build
├   ├── watch.mjs             Develop script -> npm run dev
├
├── packages
├   ├── main                  Electron Main-process source code
├       ├── vite.config.ts
├   ├── preload               Electron Preload-script source code
├       ├── vite.config.ts
├   ├── renderer              Renderer-process source code (Vue.js)
├       ├── vite.config.ts
├