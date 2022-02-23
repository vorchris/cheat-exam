import {  createMemoryHistory,  createRouter as _createRouter,  createWebHistory } from 'vue-router'

import home from '/src/pages/home.vue'
import notfound from '/src/pages/notfound.vue'
import student from '/src/pages/student.vue'
import editor from '/src/pages/editor.vue'
import startserver from '/src/pages/startserver.vue'
import dashboard from '/src/pages/dashboard.vue'
import serverlist from '/src/pages/serverlist.vue'
import config from '/src/config.js';


const routes = [
  { path: '/',  component: home },
  { path: '/student',  component: student },
  { path: '/editor/:id',  component: editor,  beforeEnter: [checkId],},
  { path: '/startserver',  component: startserver },
  { path: '/serverlist',  component: serverlist },
  { path: '/dashboard',  component: dashboard },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: notfound },
]


function checkId(to){
  console.log(config)
  console.log(to.params.id)
  return true
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
