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

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => { // SSL/TSL: this is the self signed certificate support
    event.preventDefault(); // On certificate error we disable default behaviour (stop loading the page)
    callback(true);  // and we then say "it is all fine - true" to the callback
});

app.on('window-all-closed', () => {
    WindowHandler.mainwindow = null
    //if (process.platform !== 'darwin') app.quit()
    app.quit()
})

app.on('second-instance', () => {
    if (WindowHandler.mainwindow) {
        if (WindowHandler.mainwindow.isMinimized()) WindowHandler.mainwindow.restore()
        WindowHandler.mainwindow.focus() // Focus on the main window if the user tried to open another
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) { allWindows[0].focus()} // if there is a window - focus
    else { WindowHandler.createWindow() }       // if not create new
})

app.whenReady().then(()=>{
    nativeTheme.themeSource = 'light'  // make sure it does't apply dark system themes (we have dark icons in editor)
    server.listen(config.serverApiPort, () => {  // start express API
        console.log(`Express listening on https://${config.hostip}:${config.serverApiPort}`)
    }) 
})
.then(()=>{
    if (config.hostip) { multicastClient.init()  } //multicast client only tracks other exam instances on the net
    powerSaveBlocker.start('prevent-display-sleep')
    
    if (process.platform === 'win32') {
        import('node-prevent-sleep').then( preventSleep => {
            preventSleep.enable();
        })
    }

    WindowHandler.createWindow()
})