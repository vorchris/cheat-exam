/** 
 * VUE.js Frontend - Routing 
*/
import { createRouter as _createRouter,  createWebHashHistory } from 'vue-router'

/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2023 Thomas Michael Weissel
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>
 */


import notfound from '/src/pages/notfound.vue'
import student from '/src/pages/student.vue'
import editor from '/src/pages/editor.vue'
import geogebra from '/src/pages/geogebra.vue'
import lock from '/src/pages/lock.vue'

//console.log(config)  // config is exposed to the renderer (frontend) in preload.js (it's readonly here!)

// check if we run this app in electron (host is always "localhost" then)
let electron = false
const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
    electron = true
}

const routes = [
    { path: '/',                name:"index",       component: student,     beforeEnter: [addParams]             },
    { path: '/student',         name:"student",     component: student,     beforeEnter: [addParams]             },
    { path: '/editor/:token',   name:"editor",      component: editor,      beforeEnter: [addParams, fetchInfo] },  
    { path: '/math/:token',     name:"math",        component: geogebra,    beforeEnter: [addParams, fetchInfo] },
    { path: '/lock',            name:"lock",        component: lock },
    { path: '/:pathMatch(.*)*', name:"404",         component: notfound },   // to load a specific view just replace the error view and load an unknown component at path: /
]


function addParams(to){
    to.params.version = config.version
    to.params.serverApiPort = config.serverApiPort 
    to.params.clientApiPort = config.clientApiPort
    to.params.electron = electron
    to.params.config = config
}


/**
 * der exammode benötigt für die focusCheck funktion 
 * um rechtmässig am server den studentstatus updaten zu dürfen das student token
 */
async function fetchInfo(to, from){
    let response = ipcRenderer.sendSync('getinfo')
    let clientinfo = response.clientinfo
    
    to.params.serverip = clientinfo.serverip
    to.params.servername = clientinfo.servername 
    to.params.servertoken = clientinfo.servertoken
    to.params.clientname = clientinfo.name
    to.params.pincode = clientinfo.pin
    to.params.cmargin = clientinfo.cmargin
    return true
}




export function createRouter() {
    return _createRouter({ history:  createWebHashHistory(),  routes })   // use appropriate history implementation for server/client // import.meta.env.SSR is injected by Vite.
}
