
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'

import { createI18n } from 'vue-i18n/index'

import en from './locales/en.json'
import de from './locales/de.json'


const router = createRouter()
const vApp = createApp(App)

vApp.use(router)
vApp.config.unwrapInjectedRef = true  // should not be neccecary in future versions (suppress specific warning)


const i18n = createI18n({
    locale: 'de',
    fallbackLocale: 'en',
    messages: {
        en,
        de
      }
  })

vApp.use(i18n)

// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
    vApp.mount('#app')
})