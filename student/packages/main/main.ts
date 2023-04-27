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

import { app, BrowserWindow, powerSaveBlocker, nativeTheme} from 'electron'
import { release } from 'os'
import { disableRestrictions} from './scripts/platformrestrictions.js';
import WindowHandler from './scripts/windowhandler.js'
import CommHandler from './scripts/communicationhandler.js'
import IpcHandler from './scripts/ipchandler.js'
import config from './config.js';
import multicastClient from './scripts/multicastclient.js'
import defaultGateway from'default-gateway';
import path from 'path'
import fs from 'fs'
import fsExtra from "fs-extra"
import os from 'os'
import ip from 'ip'

if (!app.requestSingleInstanceLock()) {  // allow only one instance of the app per client
    app.quit()
    process.exit(0)
 }

config.electron = true
config.homedirectory = os.homedir()
config.workdirectory = path.join(os.homedir(), config.examdirectory)
config.tempdirectory = path.join(os.tmpdir(), 'exam-tmp')
if (!fs.existsSync(config.workdirectory)){ fs.mkdirSync(config.workdirectory); }
if (!fs.existsSync(config.tempdirectory)){ fs.mkdirSync(config.tempdirectory); }

try { //bind to the correct interface
    const {gateway, interface: iface} =  defaultGateway.v4.sync()
    config.hostip = ip.address(iface)    // this returns the ip of the interface that has a default gateway..  should work in MOST cases.  probably provide "ip-options" in UI ?
 }
 catch (e) {
   console.log(e)
   config.hostip = false
 }

app.commandLine.appendSwitch('lang', 'de')

fsExtra.emptyDirSync(config.tempdirectory)  // clean temp directory

WindowHandler.init(multicastClient, config)  // mainwindow, examwindow, blockwindow
CommHandler.init(multicastClient, config)    // starts "beacon" intervall and fetches information from the teacher - acts on it (startexam, stopexam, sendfile, getfile)
IpcHandler.init(multicastClient, config, WindowHandler, CommHandler)  //controll all Inter Process Communication

  ////////////////////////////////
 // APP handling (Backend) START
////////////////////////////////

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {  app.setAppUserModelId(app.getName())}
if (process.platform ==='darwin') {  app.dock.hide() }  // safer fullscreen



// hide certificate warnings in console.. we know we use a self signed cert and do not validate it

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const originalEmitWarning = process.emitWarning
process.emitWarning = (warning, options) => {
    if (warning && warning.includes && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {  return }
    return originalEmitWarning.call(process, warning, options)
}

app.on('window-all-closed', () => {  // if window is closed
    clearInterval( CommHandler.updateStudentIntervall )
    disableRestrictions()
    WindowHandler.mainwindow = null
    // if (process.platform !== 'darwin'){ app.quit() }
    app.quit()
})

app.on('second-instance', () => {
    if (WindowHandler.mainwindow) {
        if (WindowHandler.mainwindow.isMinimized()) WindowHandler.mainwindow.restore() // Focus on the main window if the user tried to open another
        WindowHandler.mainwindow.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) { allWindows[0].focus() } 
    else { WindowHandler.createMainWindow() }
})

app.whenReady()
.then(()=>{
    nativeTheme.themeSource = 'light'
    if (config.hostip) { multicastClient.init() }
    powerSaveBlocker.start('prevent-display-sleep')
    WindowHandler.createMainWindow()
})

  ////////////////////////////////
 // APP handling (Backend) END
////////////////////////////////