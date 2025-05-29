/**
 * @license GPL LICENSE
 * Copyright (c) 2021 Thomas Michael Weissel
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


import { app, BrowserWindow, powerSaveBlocker, nativeTheme, globalShortcut, Menu  } from 'electron'
import { release } from 'os'
import config from './config.js';
import server from "../server/src/server.js"
import multicastClient from './scripts/multicastclient.js'
import WindowHandler from './scripts/windowhandler.js'
import IpcHandler from './scripts/ipchandler.js'
import log from 'electron-log';

// Verhindert, dass Electron das Standardmenü erstellt
Menu.setApplicationMenu(null);
//app.disableHardwareAcceleration(); 
app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('disable-gpu-vsync', 'false');
app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-threaded-compositing');
app.commandLine.appendSwitch('enable-features', 'Metal,CanvasOopRasterization');
app.commandLine.appendSwitch('force-device-scale-factor', '1');

WindowHandler.init(multicastClient, config)  // mainwindow, examwindow, blockwindow
IpcHandler.init(multicastClient, config, WindowHandler)  //controll all Inter Process Communication

/**
 * This function specifically checks for EPIPE errors and disables the console transport for the ElectronLogger if such an error occurs.
 * EPIPE errors typically happen when trying to write to a closed pipe, which can occur if the stdout stream is unexpectedly closed.
 */

process.stdout.on('error', (err) => { if (err.code === 'EPIPE') { log.transports.console.level = false } });

process.on('uncaughtException', (err) => {
    if (err.code === 'EPIPE') {
        log.transports.console.level = false;
        log.warn('main: EPIPE Error: Der stdout-Stream des ElectronLoggers wird deaktiviert.');
    } 
    else {  log.error('main:', err.message); }  // Andere Fehler protokollieren oder anzeigen
});


log.initialize(); // initialize the logger for any renderer process
let logfile = `${WindowHandler.config.workdirectory}/next-exam-teacher.log`
log.transports.file.resolvePathFn = () => { return logfile  }
log.eventLogger.startLogging();
log.errorHandler.startCatching();

log.warn(`-------------------`)
log.warn(`main: starting Next-Exam Teacher "${config.version} ${config.info}" (${process.platform})`)
log.warn(`-------------------`)
log.info(`main: Logfilelocation at ${logfile}`)
log.info('main: Next-Exam Logger initialized...');



// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())



if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

 // Optionale zusätzliche Kontrolle über Konsolenfehler
app.commandLine.appendSwitch('log-level', '3'); // 3 = WARN, 2 = ERROR, 1 = INFO

// hide certificate warnings in console.. we know we use a self signed cert and do not validate it
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const originalEmitWarning = process.emitWarning
process.emitWarning = (warning, options) => {
    if (warning && warning.includes && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {  return }
    return originalEmitWarning.call(process, warning, options)
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
        log.info(`main: Express listening on https://${config.hostip}:${config.serverApiPort}`)
    }) 
})
.then(async ()=>{
    if (config.hostip == "127.0.0.1") { config.hostip = false }
    if (config.hostip) { multicastClient.init(config.gateway)  } //multicast client only tracks other exam instances on the net
    powerSaveBlocker.start('prevent-display-sleep')
  
    app.commandLine.appendSwitch('allow-file-access-from-files');
    app.commandLine.appendSwitch('user-data-dir', config.workdirectory);

    WindowHandler.createWindow()

})