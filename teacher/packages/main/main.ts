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

/**
 * This is the ELECTRON main file that actually opens the electron window
 */

import { app, BrowserWindow, powerSaveBlocker, nativeTheme  } from 'electron'
import { release } from 'os'
import config from './config.js';
import server from "../server/src/server.js"
import multicastClient from './scripts/multicastclient.js'


import WindowHandler from './scripts/windowhandler.js'
import IpcHandler from './scripts/ipchandler.js'

WindowHandler.init(multicastClient, config)  // mainwindow, examwindow, blockwindow
IpcHandler.init(multicastClient, config, WindowHandler)  //controll all Inter Process Communication



// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
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
    WindowHandler.mainwindow = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (WindowHandler.mainwindow) {
        // Focus on the main window if the user tried to open another
        if (WindowHandler.mainwindow.isMinimized()) WindowHandler.mainwindow.restore()
        WindowHandler.mainwindow.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        WindowHandler.createWindow()
    }
})

app.whenReady().then(()=>{
    nativeTheme.themeSource = 'light'
    server.listen(config.serverApiPort, () => {  
        console.log(`Express listening on https://${config.hostip}:${config.serverApiPort}`)
        console.log(`Vite-vue listening on http://${config.hostip}:${config.serverVitePort}`)
    }) 
})
.then(()=>{
    if (config.hostip) {
        multicastClient.init()
    }
    powerSaveBlocker.start('prevent-display-sleep')
    WindowHandler.createWindow()
})