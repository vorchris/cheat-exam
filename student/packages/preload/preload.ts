/**
 * This is used to preload packages for the renderer process of electron (the frontend)
 */


import fs from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import api from "../server/src/server.js"
import config from '../server/src/config.js';

// fetch some env vars from main process
ipcRenderer.send('env-request');



/** document ready */
function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

;(async () => {
  await domReady()
})()


// --------- Expose some API to the Renderer process. ---------
contextBridge.exposeInMainWorld('fs', fs)
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))   // this gives us an option to access the electron mainwindow with an ipc call
contextBridge.exposeInMainWorld('api', api)   // this finally runs the express API in electron (and exposes it)

// we wait for some environment variables the main process provides.. unfortunately there is no better way to get information from the mainprocess than through the eventemitter
ipcRenderer.on('env-reply', function (event, home, desktop, temp, workdirectory) {
    config.home = home; 
    config.desktop = desktop;
    config.tempdirectory = temp; 
    config.workdirectory = workdirectory;

    // create workdirectory if it doesn't exist 
    if (!fs.existsSync(workdirectory)){
        fs.mkdirSync(workdirectory);
    }

    contextBridge.exposeInMainWorld('config', config )  // expose configuration (readonly) to the renderer (frontend)


});
 
// `exposeInMainWorld` can't detect attributes and methods of `prototype`, manually patching it.
function withPrototype(obj: Record<string, any>) {
  const protos = Object.getPrototypeOf(obj)

  for (const [key, value] of Object.entries(protos)) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof value === 'function') {
      // Some native APIs, like `NodeJS.EventEmitter['on']`, don't work in the Renderer process. Wrapping them into a function.
      obj[key] = function (...args: any) {
        return value.call(obj, ...args)
      }
    } else {
      obj[key] = value
    }
  }
  return obj
}
