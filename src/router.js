import {  createMemoryHistory,  createRouter as _createRouter,  createWebHistory } from 'vue-router'
import axios from 'axios'

import home from '/src/pages/home.vue'
import notfound from '/src/pages/notfound.vue'
import student from '/src/pages/student.vue'
import editor from '/src/pages/editor.vue'
import startserver from '/src/pages/startserver.vue'
import dashboard from '/src/pages/dashboard.vue'
import serverlist from '/src/pages/serverlist.vue'

const routes = [
    { path: '/',                  component: home },
    { path: '/student',           component: student },
    { path: '/editor/:token',     component: editor,  beforeEnter: [checkToken]},
    { path: '/startserver',       component: startserver },
    { path: '/serverlist',        component: serverlist },
    { path: '/dashboard/:servername/:passwd', component: dashboard, beforeEnter: [checkPasswd] },
    { path: '/:pathMatch(.*)*',   component: notfound },
]


async function checkToken(to, from){
    let status = await axios.get(`http://localhost:3000/client/control/tokencheck/${to.params.token}`)
    .then(response => {  return response.data.status  })
    .catch( err => {console.log(err)})

    if (status === "success") { console.log("token ok"); return true}
    else {  console.log("token error"); return { path: '/student'} }
}



async function checkPasswd(to){
    let res = await axios.get(`http://localhost:3000/server/control/checkpasswd/${to.params.servername}/${to.params.passwd}`)
    .then(response => {  return response.data  })
    .catch( err => {console.log(err)})

    if (res.status === "success") { 
        to.params.pin = res.data.pin; 
        to.params.servertoken = res.data.servertoken; 
        to.params.serverip = res.data.serverip; 
        console.log("password ok"); 
        return true }
    else {  
        console.log("password error"); 
        return { path: '/serverlist'}
    }
}


//do not allow requests from external hosts
function requestSourceAllowed(req,res){
  if (req.ip !== "::1" && req.ip !== "127.0.0.1"){ 
    console.log("Blocked request from remote Host"); 
    return false
  }   
  return true
}



export function createRouter() {
  return _createRouter({ history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),  routes })   // use appropriate history implementation for server/client // import.meta.env.SSR is injected by Vite.
}
