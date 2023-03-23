
import { createApp } from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import i18n from './locales/locales.js'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { msalPlugin } from "./msalutils/plugins/msalPlugin";
import { msalInstance } from "./msalutils/authConfig";
import { EventType } from "@azure/msal-browser";
import { CustomNavigationClient } from "./msalutils/NavigationClient";

// The next 2 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
const navigationClient = new CustomNavigationClient(createRouter);
msalInstance.setNavigationClient(navigationClient);

// Account selection logic is app dependent. Adjust as needed for different use cases.
const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
    msalInstance.setActiveAccount(accounts[0]);
}
msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload ;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});



const options = {
    confirmButtonColor: '#198754',
    cancelButtonColor: '#ff7674',
};


const router = createRouter()
const vApp = createApp(App)

vApp.use(router)
vApp.use(i18n)
vApp.use(msalPlugin, msalInstance);
vApp.use(VueSweetalert2, options)
vApp.config.unwrapInjectedRef = true  // should not be neccecary in future versions (suppress specific warning)


// wait until router is ready before mounting to ensure hydration match
router.isReady().then(() => {
    vApp.mount('#app')
})