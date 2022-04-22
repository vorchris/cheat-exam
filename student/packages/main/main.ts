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

import { app, BrowserWindow, shell, ipcMain, screen, globalShortcut, TouchBar, dialog } from 'electron'
import { release } from 'os'
import { join } from 'path'
import {enableRestrictions, disableRestrictions} from './scripts/platformrestrictions.js';
import config from '../server/src/config.js';
import axios from "axios";


let clientinfo = false; // we store all necessary information on this object
let fetchinfointerval; // starts with exam - ends with endexam


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {  app.setAppUserModelId(app.getName())}



if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let newwin: BrowserWindow | null = null

function newWin() {
    newwin = new BrowserWindow({
        parent: win,
        skipTaskbar:true,
        title: 'Eduvidual',
        width: 800,
        height: 600,
        closable: false,
        alwaysOnTop: true,
        icon: join(__dirname, '../../public/icons/icon.png'),
        webPreferences: { },
    });
    newwin.removeMenu() 
    newwin.loadURL('https://eduvidual.at')
    newwin.webContents.openDevTools()
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
        let choice = dialog.showMessageBoxSync(win, {
              type: 'question',
              buttons: ['Yes', 'No'],
              title: 'Exit',
              message: 'Are you sure?'
        });
        
        if(choice == 1){
            e.preventDefault();
        }
     });






    /**
     * we create custom listeners here
     * in electron frontend OR express api (import) ipcRenderer is exposed and usable to send or receive messages (see preload/index.ts)
     * we can call ipcRenderer.send('signal') to send and ipcMain to reveive in mainprocess
     */
    const blurevent = () => { 
        win?.webContents.send('blurevent'); 
        win?.show();  // we keep focus on the window.. no matter what
        win?.moveTop();
        win?.focus();
    }

    // if we receive "exam" from the express API (via ipcRenderer.send() ) - we inform our renderer (view) 
    // which sets a ipcRenderer listener for the "exam" signal to switch to the correct page (read examtype)  
    ipcMain.on("exam", (event, token, examtype) =>  {

        if (examtype === "eduvidual") { 
            fetchinfointerval = setInterval(() => { fetchInfo() }, 4000)  //always keep clientinfo object up2date
            newWin();
        }
        else {
            enableRestrictions(win)
            win?.setKiosk(true)
            win?.minimize()
            win?.focus()
            win?.webContents.send('exam', token, examtype);
            win?.addListener('blur', blurevent)  // send blurevent on blur
        } 
    })

    ipcMain.on("endexam", (event) =>  {
    
        //handle eduvidual case
        if (newwin){newwin.close()}
        clearInterval(fetchinfointerval)

        disableRestrictions()
        win?.setKiosk(false)
        win?.removeListener('blur', blurevent)  // do not send blurevent on blur
        win?.webContents.send('endexam');
    }); 


    ipcMain.on("save", () =>  {
        win?.webContents.send('save');
    }); 
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






/////////////////////////////////////
// other functions


function fetchInfo() {
    console.log("------------------")
    axios.get(`https://localhost:${config.clientApiPort}/client/control/getinfo`)
    .then( response => {
        clientinfo = response.data.clientinfo
       
       console.log(clientinfo)
        if (clientinfo && clientinfo.token){  clientinfo.online = true  }
        else { clientinfo.online = false  }
    })
    .catch( err => {console.log(err)});

    if(clientinfo && clientinfo.virtualized){informTeacher('virtualized') }
}



function informTeacher(focus){
    console.log("HOUSTON WE HAVE A CHEATER!")
    fetch(`https://${clientinfo.serverip}:${config.serverApiPort}/server/control/studentlist/statechange/${clientinfo.servername}/${clientinfo.token}/${clientinfo.focus}`)
    .then( response => response.json() )
    .then( (data) => { console.log(data); });  

    if (!focus){
        axios.get(`https://localhost:${config.clientApiPort}/client/control/focus/${clientinfo.token}/false`)
        .then( response => { this.focus = false; console.log(response.data);  })
        .catch( err => {console.log(err)});
    }
}