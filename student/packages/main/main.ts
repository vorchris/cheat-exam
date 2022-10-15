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

import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron'

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
 }


import { release } from 'os'
import { disableRestrictions} from './scripts/platformrestrictions.js';
import WindowHandler from './scripts/windowhandler.js'
import CommHandler from './scripts/communicationhandler.js'
import config from '../server/src/config.js';
import server from "../server/src/server.js"
import multicastClient from '../server/src/classes/multicastclient.js'
import { join } from 'path'
import fs from 'fs' 

WindowHandler.init(multicastClient, config)  // mainwindow, examwindow, blockwindow
CommHandler.init(multicastClient, config)    // starts "beacon" intervall and fetches information from the teacher - acts on it (startexam, stopexam, sendfile, getfile)

//still trying to get rid of self-signed cert errors but electron 21 ignores this switch
app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');



  ////////////////////////////////
 // APP handling (Backend) START
////////////////////////////////


// hide certificate warnings in console.. we know we use a self signed cert and do not validate it
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const originalEmitWarning = process.emitWarning
process.emitWarning = (warning, options) => {
    if (warning && warning.includes && warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')) {  return }
    return originalEmitWarning.call(process, warning, options)
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') {  app.setAppUserModelId(app.getName())}


app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});


app.on('window-all-closed', () => {  // if window is closed
    clearInterval( CommHandler.updateStudentIntervall )
    disableRestrictions()
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
        WindowHandler.createMainWindow()
    }
})

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
   server.listen(config.clientApiPort, () => {  
        console.log(`Express listening on https://${config.hostip}:${config.clientApiPort}`)
        console.log(`Vite-vue listening on http://${config.hostip}:${config.clientVitePort}`)
    })

  })
.then(()=>{
    if (config.hostip) {
        multicastClient.init()
    }

   
    WindowHandler.createMainWindow()
})

  ////////////////////////////////
 // APP handling (Backend) END
////////////////////////////////



ipcMain.on('virtualized', () => {  multicastClient.clientinfo.virtualized = true; } )
ipcMain.on('getconfig', (event) => {   event.returnValue = config   })
ipcMain.on('printpdf', (event, args) => { 
      if (WindowHandler.examwindow){
        var options = {
            margins: {top:0.5, right:0.5, bottom:0.5, left:0.5 },
            pageSize: 'A4',
            printBackground: true,
            printSelectionOnly: false,
            landscape: args.landscape,
            displayHeaderFooter:true,
            footerTemplate: "<div style='height:12px; font-size:8px; text-align: right; width:100%; margin-right: 20px;'><span class=pageNumber></span>|<span class=totalPages></span></div>",
            headerTemplate: `<div style='height:12px; font-size:8px; text-align: right; width:100%; margin-right: 20px;'><span class=date></span>|<span>${args.clientname}</span></div>`,
            preferCSSPageSize: false
        }

        const pdffilepath = join(config.workdirectory, args.filename);
        WindowHandler.examwindow.webContents.printToPDF(options).then(data => {
            fs.writeFile(pdffilepath, data, function (err) { if (err) {console.log(err); }  } );
        }).catch(error => { console.log(error)});
    }
})
