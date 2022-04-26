/** 
 * VUE.js Frontend - Routing 
*/
import {  createMemoryHistory,  createRouter as _createRouter,  createWebHistory ,createWebHashHistory } from 'vue-router'
import axios from 'axios'
import notfound from '/src/pages/notfound.vue'
import startserver from '/src/pages/startserver.vue'
import dashboard from '/src/pages/dashboard.vue'
import serverlist from '/src/pages/serverlist.vue'


console.log(config)  // config is exposed to the renderer (frontend) in preload.js (it's readonly here!)


// check if we run this app in electron (host is always "localhost" then)
let electron = false
const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
    electron = true
}

const routes = [
    { path: '/',                  component: startserver, beforeEnter: [addParams] },
    { path: '/startserver',       component: startserver, beforeEnter: [addParams] },
    { path: '/serverlist',        component: serverlist,   beforeEnter: [addParams]},
    { path: '/dashboard/:servername/:passwd', name:"dashboard", component: dashboard, beforeEnter: [addParams, checkPasswd] },
    { path: '/:pathMatch(.*)*',   component: notfound },
]

function addParams(to){
    to.params.version = config.version
    to.params.serverApiPort = config.serverApiPort 
    to.params.clientApiPort = config.clientApiPort
    to.params.electron = electron
    to.params.workdirectory = config.workdirectory   //attention.. this is the server base workdirectory > we add servername to get the actual exam workdirectory in the view
}




//we double check the password for now..  use proper auth process in the future ;-)
async function checkPasswd(to){
    let hostname = electron ? "localhost" : window.location.hostname

    let res = await axios.get(`https://${hostname}:${config.serverApiPort}/server/control/checkpasswd/${to.params.servername}/${to.params.passwd}`)
    .then(response => {  return response.data  })
    .catch( err => {console.log(err)})

    if (res.status === "success") { 
        to.params.pin = res.data.pin; 
        to.params.servertoken = res.data.servertoken; 
        to.params.serverip = res.data.serverip; 
        console.log("password ok"); 
        return true 
    }
    else {  
        console.log("password error"); 
        return { path: '/startserver'}
    }
}


export function createRouter() {
  return _createRouter({ history:  createWebHashHistory(),  routes })   // use appropriate history implementation for server/client // import.meta.env.SSR is injected by Vite.
}
