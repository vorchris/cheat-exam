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

import { app, BrowserWindow, shell, ipcMain, dialog  } from 'electron'
import { release } from 'os'
import { join } from 'path'
import config from '../server/src/config.js';
import server from "../server/src/server.js"
import multicastClient from '../server/src/classes/multicastclient.js'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}


let win: BrowserWindow | null = null

async function createWindow() {

    win = new BrowserWindow({
        title: 'Main window',
        icon: join(__dirname, '../../public/icons/icon.png'),
        width: 1000,
        height: 700,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs')
        },
    })

    if (app.isPackaged || process.env["DEBUG"]) {
        win.removeMenu() 
        win.loadFile(join(__dirname, '../renderer/index.html'))

        if (config.development) { win.webContents.openDevTools()  }

    } 
    else {
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
        win.removeMenu() 
        win.loadURL(url)
        win.webContents.openDevTools()
    }


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
                buttons: ['Ja', 'Nein'],
                title: 'Programm beenden',
                message: 'Sind sie sicher?'
            });
            
            if(choice == 1){
                e.preventDefault();
            }
        }
     });
}


// SSL/TSL: this is the self signed certificate support
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    console.log(certificate)
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});


app.on('window-all-closed', () => {
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

app.whenReady().then(()=>{
    server.listen(config.serverApiPort, () => {  
        console.log(`Express listening on https://${config.hostip}:${config.serverApiPort}`)
        console.log(`Vite-vue listening on http://${config.hostip}:${config.serverVitePort}`)
    })
})
.then(()=>{
    if (config.hostip) {
        multicastClient.init()
    }
    createWindow()
})


ipcMain.on('getconfig', (event) => {   event.returnValue = config   })
