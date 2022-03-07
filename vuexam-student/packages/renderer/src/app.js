
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'


const router = createRouter()
const app = createApp(App)

app.use(router)
app.config.unwrapInjectedRef = true  // should not be neccecary in future versions (suppress specific warning)



// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
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
