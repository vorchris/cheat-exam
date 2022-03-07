/**
 * This is used to preload packages for the renderer process of electron (the frontend)
 */


import fs from 'fs'
import { contextBridge, ipcRenderer } from 'electron'
import app from "../server/src/server.js"

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
contextBridge.exposeInMainWorld('ipcRenderer', withPrototype(ipcRenderer))
contextBridge.exposeInMainWorld('app', app)


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
