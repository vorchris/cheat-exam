/** 
 * VUE.js Frontend - Routing 
*/
import {  createMemoryHistory,  createRouter as _createRouter,  createWebHistory ,createWebHashHistory } from 'vue-router'
import axios from 'axios'
import home from '/src/pages/home.vue'
import notfound from '/src/pages/notfound.vue'
import startserver from '/src/pages/startserver.vue'
import dashboard from '/src/pages/dashboard.vue'
import serverlist from '/src/pages/serverlist.vue'
import config from '../../server/src/config'


// check if we run this app in electron (host is always "localhost" then)
let electron = false
const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
    electron = true
}

 // console.log(apiconfig)   // running in electron this is the very same config object as it's used in server.js via contextbridge (preload) in electron - just in case

const routes = [
    { path: '/',                  component: startserver, beforeEnter: [addParams] },
    { path: '/startserver',       component: startserver, beforeEnter: [addParams] },
    { path: '/serverlist',        component: serverlist,   beforeEnter: [addParams]},
    { path: '/dashboard/:servername/:passwd', name:"dashboard", component: dashboard, beforeEnter: [addParams, checkPasswd] },
    { path: '/:pathMatch(.*)*',   component: notfound },
]

function addParams(to){
    to.params.serverApiPort = config.serverApiPort 
    to.params.clientApiPort = config.clientApiPort
    to.params.electron = electron
}





async function checkPasswd(to){
    let hostname = electron ? "localhost" : window.location.hostname

    let res = await axios.get(`http://${hostname}:${config.serverApiPort}/server/control/checkpasswd/${to.params.servername}/${to.params.passwd}`)
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
