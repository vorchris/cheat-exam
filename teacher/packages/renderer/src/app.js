
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import i18n from './locales/locales.js'

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const options = {
    confirmButtonColor: '#198754',
    cancelButtonColor: '#ff7674',
};


const router = createRouter()
const vApp = createApp(App)

vApp.use(router)
vApp.use(i18n)
vApp.use(VueSweetalert2, options)
vApp.config.unwrapInjectedRef = true  // should not be neccecary in future versions (suppress specific warning)



// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
    vApp.mount('#app')
})