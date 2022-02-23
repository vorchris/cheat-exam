import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'


const router = createRouter()
const app = createSSRApp(App)
app.config.unwrapInjectedRef = true  // should not be neccecary in future versions (suppress specific warning)
app.use(router)


// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
  app.mount('#app')
})
