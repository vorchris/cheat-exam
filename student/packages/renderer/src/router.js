/** 
 * VUE.js Frontend - Routing 
*/
import {  createMemoryHistory,  createRouter as _createRouter,  createWebHistory ,createWebHashHistory } from 'vue-router'
import axios from 'axios'

import notfound from '/src/pages/notfound.vue'
import student from '/src/pages/student.vue'
import editor from '/src/pages/editor.vue'
import geogebra from '/src/pages/geogebra.vue'

console.log(config)  // config is exposed to the renderer (frontend) in preload.js (it's readonly here!)

// check if we run this app in electron (host is always "localhost" then)
let electron = false
const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
    electron = true
}

const routes = [
    { path: '/',                name:"index",     component: student,     beforeEnter: [addParams]             },
    { path: '/student',         name:"student",     component: student,     beforeEnter: [addParams]             },
    { path: '/editor/:token',   name:"editor",      component: editor,      beforeEnter: [addParams, checkToken] },  
    { path: '/math/:token',     name:"math",        component: geogebra,    beforeEnter: [addParams, checkToken] },
    { path: '/:pathMatch(.*)*', name:"404",         component: notfound },

    { path: '/mtest',           component:  geogebra, beforeEnter: [addParams] },  // just for testing
    { path: '/ltest',           component:  editor,   beforeEnter: [addParams] },  // just for testing
]


function addParams(to){
    to.params.version = config.version
    to.params.serverApiPort = config.serverApiPort 
    to.params.clientApiPort = config.clientApiPort
    to.params.electron = electron
    to.params.clientname = "DemoUser"
    to.params.virtualized = config.virtualized
}


/**
 * der exammode benötigt für die focusCheck funktion 
 * um rechtmässig am server den studentstatus updaten zu dürfen das student token
 */
async function checkToken(to, from){
    let status = await axios.get(`http://localhost:${config.clientApiPort}/client/control/tokencheck/${to.params.token}`)
    .then(response => {  return response.data.status  })
    .catch( err => {console.log(err)})

    if (status === "success") { 
        let clientinfo = await axios.get(`http://localhost:${config.clientApiPort}/client/control/getinfo`)
        .then(response => {  return response.data.clientinfo  })
        .catch( err => {console.log(err)})
       
        to.params.serverip = clientinfo.serverip
        to.params.servername = clientinfo.servername 
        to.params.servertoken = clientinfo.servertoken
        to.params.clientname = clientinfo.name
        return true
    }
    else {  console.log("token error"); return { path: '/student'} }
}




export function createRouter() {
  return _createRouter({ history:  createWebHashHistory(),  routes })   // use appropriate history implementation for server/client // import.meta.env.SSR is injected by Vite.
}
