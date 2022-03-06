
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'


const router = createRouter()
const app = createApp(App)

app.use(router)




// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {

  // app.created() {
  //   // Prevent blank screen in Electron builds
  //   this.$router.push('/')
  // }

  app.mount('#app')
})









// console.log('fs', window.fs)
// console.log('ipcRenderer', window.ipcRenderer)

// Usage of ipcRenderer.on
if (window.ipcRenderer ) {
  window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
  })
}
