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



const routes = [
    { path: '/',                  component: home },
    { path: '/startserver',       component: startserver, beforeEnter: [addParams] },
    { path: '/serverlist',        component: serverlist   },
    { path: '/dashboard/:servername/:passwd', name:"dashboard", component: dashboard, beforeEnter: [checkPasswd] },

    { path: '/:pathMatch(.*)*',   component: notfound },
]

function addParams(to){
   // console.log(apiconfig)   // this is the same config object as it's used in server.js via contextbridge (preload) in electron
    to.params.port = config.hostip  //how to get the SAME config object in plain node + vue

}




//ATTENTION!!! das kann auch ein remote server sein
// was machen wir hier mit "localhost"
async function checkPasswd(to){
    let res = await axios.get(`http://localhost:3000/server/control/checkpasswd/${to.params.servername}/${to.params.passwd}`)
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
