/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2022 Thomas Michael Weissel
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


/**
 * This is the ELECTRON main file that actually opens the electron window
 */

import { app, BrowserWindow, shell, ipcMain, ipcRenderer, screen, globalShortcut, TouchBar, dialog } from 'electron'
import { release } from 'os'
import { join } from 'path'
import {enableRestrictions, disableRestrictions} from './scripts/platformrestrictions.js';
import config from '../server/src/config.js';
import axios from "axios";
import api from "../server/src/server.js"
import multicastClient from '../server/src/classes/multicastclient.js'


  ///////////////////////////
 // APP handling (Backend)
//////////////////////////


// hide certificate warnings in console.. we know we use a self signed cert and do not validate it
const originalEmitWarning = process.emitWarning
process.emitWarning = (warning, options) => {
    if (warning && warning.includes && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {  return }
    return originalEmitWarning.call(process, warning, options)
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {  app.setAppUserModelId(app.getName())}

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

app.whenReady()
.then( () => {
    // trying to catch some keyboard shortcuts here
    globalShortcut.register('Alt+CommandOrControl+I', () => {
        console.log('Electron loves global shortcuts!')
        return false
    })
    globalShortcut.register('CommandOrControl+P', () => {
        console.log('Electron loves global shortcuts!')
        return false
    })
  })
.then(()=>{
   
    const API = api
    multicastClient.init()
    createWindow()
   
})

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});

app.on('window-all-closed', () => {  // if window is closed
    disableRestrictions()
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})


/**
 * we create custom listeners here
 * in electron frontend OR express api (import) ipcRenderer is exposed and usable to send or receive messages (see preload/index.ts)
 * we can call ipcRenderer.send('signal') to send and ipcMain to reveive in mainprocess
 */
const blurevent = () => { 
    win?.show();  // we keep focus on the window.. no matter what
    win?.moveTop();
    win?.focus();
    multicastClient.clientinfo.focus = false
}


// if we receive "exam" from the express API (via ipcRenderer.send() ) - we inform our renderer (view) 
// which sets a ipcRenderer listener for the "exam" signal to switch to the correct page (read examtype)  
ipcMain.on("exam", (event, token, examtype) =>  {
    
    // if (examtype === "eduvidual") {    // we are going to move all examtypes to the newWin method
        newWin(examtype, token);
        newwin?.setKiosk(true)
        enableRestrictions(newwin)
    // }
    // else {
    //     enableRestrictions(win)
    //     win?.setKiosk(true)
    //     win?.minimize()
    //     win?.focus()
    //     win?.webContents.send('exam', token, examtype);
    //     win?.addListener('blur', blurevent)  // send blurevent on blur
    // } 
})


ipcMain.on("endexam", (event) =>  {

    //handle eduvidual case
    if (newwin){ 
        newwin.close(); 
        newwin.destroy(); 
        newwin = null;
    }
   

    disableRestrictions()
    win?.setKiosk(false)
    win?.removeListener('blur', blurevent)  // do not send blurevent on blur
    win?.webContents.send('endexam');
}); 


ipcMain.on("save", () =>  {
    win?.webContents.send('save');
}); 






















  ///////////////////////////////////////////////////
 // Window handling (ipcRenderer Process - Frontend)
/////////////////////////////////////////////////////

let newwin: BrowserWindow | null = null

function newWin(examtype, token) {
    newwin = new BrowserWindow({
        parent: win,
        skipTaskbar:true,
        title: 'Eduvidual',
        width: 800,
        height: 600,
        closable: false,
        alwaysOnTop: true,
        icon: join(__dirname, '../../public/icons/icon.png'),
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs'),
         },
    });
    let url = ""
   
    if (examtype === "eduvidual"){ 
        url ='https://eduvidual.at'  
        newwin.loadURL(url)
    }
    else { 
        url = "ltest"
        
        if (app.isPackaged || process.env["DEBUG"]) {
            newwin.loadFile(join(__dirname, '../renderer/index.html'))
        } 
        else {
            url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/${url}`
            newwin.loadURL(url)
        }
    }

    newwin.webContents.openDevTools() 
    newwin.removeMenu() 
    newwin.show();  // we keep focus on the window.. no matter what
    newwin.moveTop();
    newwin.focus();
}




let win: BrowserWindow | null = null

async function createWindow() {
    const display = screen.getPrimaryDisplay();
    const dimensions = display.workAreaSize;

    win = new BrowserWindow({
        title: 'Main window',
        icon: join(__dirname, '../../public/icons/icon.png'),
        width: 1000,
        height: 600,
        minWidth: 760,
        minHeight: 600,
        alwaysOnTop: true,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs'),
            //webSecurity: false
        }
    })

    if (app.isPackaged || process.env["DEBUG"]) {
        win.removeMenu() 
        win.loadFile(join(__dirname, '../renderer/index.html'))
        //win.webContents.openDevTools()  // you don't want this in the final build
    } 
    else {
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        win.removeMenu() 
        win.loadURL(url)
        win.webContents.openDevTools()
    }

    //trying to fetch some common keyboardshortcuts (alt+tab strg-alt-entf is not possible)
    win.webContents.on('before-input-event', (event, input) => {
        if (input.alt || input.key.toLowerCase() === "alt") {
            console.log('Pressed Alt')
            event.preventDefault()
          }
        if (input.key.toLocaleLowerCase() === "meta" || input.key.toLocaleLowerCase() === "super"|| input.key.toLocaleLowerCase() === "cmd" ) {
            console.log('Pressed meta')
            event.preventDefault()
          }

        if ( (input.key.toLowerCase() === "meta" || input.key.toLowerCase() === "super"|| input.key.toLowerCase() === "cmd" ) && input.key.toLowerCase() === "p"   ) {
            console.log('Pressed meta')
            event.preventDefault()
          }  
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    win.webContents.session.setCertificateVerifyProc((request, callback) => {
        var { hostname, certificate, validatedCertificate, verificationResult, errorCode } = request;
        callback(0);
    });

    win.on('close', async  (e) => {   //ask before closing
        if (!config.development) {
            let choice = dialog.showMessageBoxSync(win, {
                type: 'question',
                buttons: ['Yes', 'No'],
                title: 'Exit',
                message: 'Are you sure?'
            });
            if(choice == 1){
                e.preventDefault();
            }
        }
    });
}






const updateStudentIntervall = setInterval(() => { this.sendBeacon() }, 5000)





/** 
 * sends heartbeat to registered server and updates screenshot on server 
 */
function sendBeacon(){
    //check if server connected - get ip
    if (multicastClient.clientinfo.serverip) {
    
        //create screenshot
        screenshot().then(async (img) => {
            let screenshotfilename = multicastClient.clientinfo.token +".jpg"
            //create formdata
            const formData = new FormData()
            
            if (config.electron){
                let blob =  new Blob( [ new Uint8Array(img).buffer], { type: 'image/jpeg' })
                formData.append(screenshotfilename, blob, screenshotfilename );
            }
            else {
                formData.append(screenshotfilename, img, screenshotfilename );
            }
            //update timestamp
            multicastClient.clientinfo.timestamp =  new Date().getTime()
            formData.append('clientinfo', JSON.stringify(multicastClient.clientinfo) );

            //post to /studentlist/update/:token
            axios({
                method: "post", 
                url: `https://${multicastClient.clientinfo.serverip}:${config.serverApiPort}/server/control/studentlist/update`, 
                data: formData, 
                headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
            })
            .then( response => {
                //console.log(`MulticastClient: ${response.data.message}`)
                if (response.data && response.data.status === "error") { 
                    if(response.data.message === "notavailable"){ multicastClient.beaconsLost = 4} //server responded but exam is not available anymore (teacher removed it)
                    multicastClient.beaconsLost += 1; 
                    console.log("beacon lost..") 
                }

                if (response.data && response.data.status === "success") { 
                    multicastClient.beaconsLost = 0 
                    let serverStatusObject = response.data.data

                    /////////////////////////
                    //react to server status 
                    /////////////////////////

                    if (serverStatusObject.exammode && !multicastClient.clientinfo.exammode){ 
                        startExam(serverStatusObject)
                    }
                    else if (!serverStatusObject.exammode && multicastClient.clientinfo.exammode){
                        endExam()
                    }
                }
            })
            .catch(error => {
                console.log(`MulticastClient: ${error}`) 
                multicastClient.beaconsLost += 1; console.log("beacon lost..")
            });  //on kick there is a racecondition that leads to a failed fetch here because values are already "false"


            if (multicastClient.beaconsLost >= 4){ //remove server registration
                console.log("Connection to Teacher lost! Removing registration.")
                multicastClient.beaconsLost = 0
                multicastClient.clientinfo.serverip = false
                multicastClient.clientinfo.servername = false
                multicastClient.clientinfo.token = false
                // for (const [key, value] of Object.entries(this.clientinfo)) {
                //     this.clientinfo[key] = false   
                // }
            }

        })
        .catch((err) => {
            console.log(`MulticastClient: ${err}`)
        });
    }
}







