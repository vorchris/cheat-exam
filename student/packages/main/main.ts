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

import { app, BrowserWindow, shell, ipcMain, screen, globalShortcut, dialog, Menu, MenuItem } from 'electron'
import { release } from 'os'
import { join } from 'path'
import {enableRestrictions, disableRestrictions} from './scripts/platformrestrictions.js';
import config from '../server/src/config.js';
import axios from "axios";
import server from "../server/src/server.js"
import multicastClient from '../server/src/classes/multicastclient.js'
import screenshot from 'screenshot-desktop'
import FormData from 'form-data/lib/form_data.js';     //we need to import the file directly otherwise it will introduce a "window" variable in the backend and fail
import fs from 'fs' 
import crypto from 'crypto';
import archiver from 'archiver'
import extract from 'extract-zip'





  ////////////////////////////////
 // APP handling (Backend) START
////////////////////////////////


// hide certificate warnings in console.. we know we use a self signed cert and do not validate it
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
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

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
});

app.on('window-all-closed', () => {  // if window is closed
    clearInterval( updateStudentIntervall )
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
    server.listen(config.clientApiPort, () => {  
        console.log(`Express listening on https://${config.hostip}:${config.clientApiPort}`)
        console.log(`Vite-vue listening on http://${config.hostip}:${config.clientVitePort}`)
    })
    multicastClient.init()
    createWindow()
})

  ////////////////////////////////
 // APP handling (Backend) END
////////////////////////////////





















  ////////////////////////////////////////////////////////////
 // Window handling (ipcRenderer Process - Frontend) START
////////////////////////////////////////////////////////////
let blockwindows = []

function newBlockWin(display) {
   
    let blockwin = new BrowserWindow({
        x: display.bounds.x + 0,
        y: display.bounds.y + 0,
        parent: newwin,
        skipTaskbar:true,
        title: 'Next-Exam',
        width: display.bounds.width,
        height: display.bounds.height,
        closable: false,
        alwaysOnTop: true,
        focusable: false,   //doesn't work with kiosk mode (no kiosk mode possible.. why?)
        minimizable: false,
        resizable:false,
        movable: false,
        icon: join(__dirname, '../../public/icons/icon.png'),
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs'),
         },
    });
   
    let url = "notfound"
    if (app.isPackaged) {
        let path = join(__dirname, `../renderer/index.html`)
        blockwin.loadFile(path, {hash: `#/${url}/`})
    } 
    else {
        url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/${url}/`
        blockwin.loadURL(url)
    }
    blockwin.removeMenu() 
    blockwin?.moveTop();
    blockwin?.setKiosk(true)
    blockwin?.show()
    return blockwin
}






let newwin: BrowserWindow | null = null

function newWin(examtype, token) {
    newwin = new BrowserWindow({
        parent: win,
        //modal: true,  // this blocks the main window on windows while the exam window is open
        skipTaskbar:true,
        title: 'Exam',
        width: 800,
        height: 600,
        closable: false,
        alwaysOnTop: true,
        show: false,
        icon: join(__dirname, '../../public/icons/icon.png'),
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs'),
            spellcheck: true
         },
    });
   
    if (examtype === "eduvidual"){    //external page
        let url ='https://eduvidual.at'  
        newwin.loadURL(url)
    }
    else { 
        let url = examtype   // editor || math || tbd.
        if (app.isPackaged) {
            let path = join(__dirname, `../renderer/index.html`)
            newwin.loadFile(path, {hash: `#/${url}/${token}`})
        } 
        else {
            url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}/#/${url}/${token}/`
            newwin.loadURL(url)
        }
    }
    newwin.webContents.openDevTools() 
    newwin.removeMenu() 
    newwin.once('ready-to-show', () => {
        newwin?.show()
        newwin?.moveTop();
        newwin?.focus();
    })
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
        show: false,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.cjs'),
            spellcheck: false
        }
    })

    if (app.isPackaged || process.env["DEBUG"]) {
        win.removeMenu() 
        win.loadFile(join(__dirname, '../renderer/index.html'))
        win.webContents.openDevTools()  // you don't want this in the final build
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

    win.once('ready-to-show', () => {
        win?.show()
        win?.moveTop();
        win?.focus();
    })
}
  ////////////////////////////////////////////////////////////
 // Window handling (ipcRenderer Process - Frontend) END
////////////////////////////////////////////////////////////






















  //////////////////////////////////////////////////////////////
 // Functions - Student UPDATE handler - Exam handlers  START
///////////////////////////////////////////////////////////////

ipcMain.on('virtualized', () => {  multicastClient.clientinfo.virtualized = true; } )
ipcMain.on('getconfig', (event) => {   event.returnValue = config   })






const updateStudentIntervall = setInterval(() => { sendBeacon() }, 5000)

function resetConnection(){
    //multicastClient.clientinfo.name = "DemoUser"  // keep name on disconnect (looks weird in edtior or geogebra)
    multicastClient.clientinfo.token = false
    multicastClient.clientinfo.ip = false
    multicastClient.clientinfo.serverip = false
    multicastClient.clientinfo.servername = false
    multicastClient.clientinfo.focus = true  // we are focused 
    multicastClient.clientinfo.exammode = false
    multicastClient.clientinfo.timestamp = false
    multicastClient.clientinfo.virtualized = false  
}

/** 
 * sends heartbeat to registered server and updates screenshot on server 
 */
function sendBeacon(){
    if (multicastClient.beaconsLost >= 4){ //remove server registration locally (same as 'kick')
        console.log("Connection to Teacher lost! Removing registration.")
        multicastClient.beaconsLost = 0
        resetConnection()
        gracefullyEndExam()  // this should end kiosk mode, the blur listener and all (keyboard) restrictions but not kill the window
    }

    if (multicastClient.clientinfo.serverip) {  //check if server connected - get ip
        //create screenshot
        screenshot().then(async (img) => {
            let screenshotfilename = multicastClient.clientinfo.token +".jpg"
            const formData = new FormData()  //create formdata
            formData.append('clientinfo', JSON.stringify(multicastClient.clientinfo) );   //we send the complete clientinfo object
            if (config.electron){  // in the final electron build this is the only way to do it 
                img =  new Blob( [ new Uint8Array(img).buffer], { type: 'image/jpeg' })   
            }
            formData.append(screenshotfilename, img, screenshotfilename );

            let hash = crypto.createHash('md5').update(img).digest("hex");
            formData.append('screenshothash', hash);
            formData.append('screenshotfilename', screenshotfilename);

            axios({    //post to /studentlist/update/:token - send update and fetch server status
                method: "post", 
                url: `https://${multicastClient.clientinfo.serverip}:${config.serverApiPort}/server/control/update`, 
                data: formData, 
                headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
            })
            .then( response => {
                if (response.data && response.data.status === "error") { 
                    if(response.data.message === "notavailable"|| response.data.message === "removed"){ console.log('No Exam or registration!'); multicastClient.beaconsLost = 4} //server responded but exam is not available anymore (teacher removed it)
                    else { multicastClient.beaconsLost += 1;  console.log("beacon lost..") }
                }
                else if (response.data && response.data.status === "success") { 
                    multicastClient.beaconsLost = 0 
                    processUpdatedServerstatus(response.data.serverstatus, response.data.studentstatus)
                }
            })
            .catch(error => { console.log(`SendBeacon Axios: ${error}`); multicastClient.beaconsLost += 1; console.log("beacon lost..") });
        })
        .catch((err) => { console.log(`SendBeacon Screenshot: ${err}`) });
    }
}


/**
 * react to server status 
 * this currently only handle startexam & endexam
 * could also handle kick, focusrestore, and even trigger file requests
 */
function processUpdatedServerstatus(serverstatus, studentstatus){
    // global status updates
    if (serverstatus.exammode && !multicastClient.clientinfo.exammode){ 
        startExam(serverstatus)
    }
    else if (!serverstatus.exammode && multicastClient.clientinfo.exammode){
        endExam()
    }
    // individual status updates
    if ( studentstatus && Object.keys(studentstatus).length !== 0) {  // we have status updates (tasks) - do it!
        if (studentstatus.restorefocusstate === true){
            multicastClient.clientinfo.focus = true
        }
        if (studentstatus.sendexam === true){
            sendExamToTeacher()
        }
        if (studentstatus.fetchfiles === true){
            requestFileFromServer(studentstatus.files)
        }
    }
}


function requestFileFromServer(files){
    let servername = multicastClient.clientinfo.servername
    let serverip = multicastClient.clientinfo.serverip
    let token = multicastClient.clientinfo.token

    let data = JSON.stringify({ 'files' : files, 'type': 'studentfilerequest'})
    axios({
        method: "post", 
        url: `https://${serverip}:${config.serverApiPort}/server/data/download/${servername}/${token}`, 
        data: data, 
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' }  
    })
    .then(response =>{ 
        let absoluteFilepath = join(config.tempdirectory, token.concat('.zip'));
        fs.writeFile(absoluteFilepath, response.data, (err) => {
            if (err){console.log(err);}
            else {
                extract(absoluteFilepath, { dir: config.workdirectory }, ()=>{ 
                    console.log("files extracted")
                    fs.unlink(absoluteFilepath, (err) => { if (err) console.log(err); }); // remove zip file after extracting
                })
            }
        });
    })
    .catch( err =>{console.log(`Main - requestFileFromServer: ${err}`) })   
}


/**
 * Starts exam mode for student
 * deletes workfolder contents (if set)
 * opens a new window in kiosk mode with the given examtype
 * enables the blur listener and activates restrictions (disable keyboarshortcuts etc.)
 * @param serverstatus contains information about exammode, examtype, and other settings from the teacher instance
 */
function startExam(serverstatus){
    if (serverstatus.delfolder === true){
        console.log("cleaning exam workfolder")
        if (fs.existsSync(config.workdirectory)){   // set by server.js (desktop path + examdir)
            fs.rmdirSync(config.workdirectory, { recursive: true });
            fs.mkdirSync(config.workdirectory);
        }
    }

    if (!newwin){  // why do we check? because exammode is left if the server connection gets lost but students could reconnect while the exam window is still open
        newWin(serverstatus.examtype, multicastClient.clientinfo.token);
    }
    newwin?.setKiosk(true)
    enableRestrictions(newwin)
    newwin?.addListener('blur', blurevent)

    let displays = screen.getAllDisplays()
    let primary = screen.getPrimaryDisplay()
    if (!config.development) {
        for (let display of displays){
            if ( display.id !== primary.id ) {
                let newblockwindow = newBlockWin(display)
                blockwindows.push(newblockwindow)
            }
        }
    }
    if (serverstatus.spellcheck){
        console.log(serverstatus.spellchecklang)
        newwin?.webContents.session.setSpellCheckerLanguages([serverstatus.spellchecklang])
        newwin?.webContents.session.setSpellCheckerDictionaryDownloadURL('https://localhost:11411/dicts/')
        // newwin?.webContents.on('context-menu', (event, params) => {
        //     const menu = new Menu()
          
        //     // Add each spelling suggestion
        //     for (const suggestion of params.dictionarySuggestions) {
        //       menu.append(new MenuItem({
        //         label: suggestion,
        //         click: () => newwin?.webContents.replaceMisspelling(suggestion)
        //       }))
        //     }
        //     menu.popup()
        // })
    }
    else {
        newwin?.webContents.session.setSpellCheckerLanguages([])
    }

    multicastClient.clientinfo.exammode = true
}

/**
 * Disables Exam mode
 * closes exam window
 * disables restrictions and blur 
 */
function endExam(){
    //handle eduvidual case
    if (newwin){ 
        newwin.close(); 
        newwin.destroy(); 
        newwin = null;

        for (let blockwindow of blockwindows){
            blockwindow.close(); 
            blockwindow.destroy(); 
            blockwindow = null;
        }
       blockwindows = []
    }
    disableRestrictions()
    multicastClient.clientinfo.exammode = false
    multicastClient.clientinfo.focus = true
}


function gracefullyEndExam(){
    if (newwin){ 
        newwin.setKiosk(false)
        newwin.removeListener('blur', blurevent)  // do not send blurevent on blur
        multicastClient.clientinfo.focus = true
        multicastClient.clientinfo.exammode = false
        disableRestrictions()
    }
}

const blurevent = () => { 
    console.log("blur")
    win?.show();  // we keep focus on the window.. no matter what
    win?.moveTop();
    win?.focus();
    multicastClient.clientinfo.focus = false
}


async function sendExamToTeacher(){
   //send save trigger to exam window
   let windows  = BrowserWindow.getAllWindows()
   for (let win of windows){
       win.webContents.send('save')
   } 
   // give it some time
   await sleep(1000)  // wait one second before zipping workdirectory (give save some time - unfortunately we have no way to wait for save - we could check the filetime in a "while loop" though)

   //zip config.work directory
   if (!fs.existsSync(config.tempdirectory)){ fs.mkdirSync(config.tempdirectory); }
   //fsExtra.emptyDirSync(config.tempdirectory)
   let zipfilename = multicastClient.clientinfo.name.concat('.zip')
   let servername = multicastClient.clientinfo.servername
   let serverip = multicastClient.clientinfo.serverip
   let token = multicastClient.clientinfo.token
   let zipfilepath = join(config.tempdirectory, zipfilename);

   await zipDirectory(config.workdirectory, zipfilepath)
   let file = await fs.readFileSync(zipfilepath);
   const form = new FormData()

   if (config.electron){
       let blob =  new Blob( [ new Uint8Array(file).buffer], { type: 'application/zip' })
       form.append(zipfilename, blob, zipfilename );
   } 
   else {
       form.append(zipfilename, file, {contentType: 'application/zip', filename: zipfilename });
   }

   axios({
       method: "post", 
       url: `https://${serverip}:${config.serverApiPort}/server/data/receive/${servername}/${token}`, 
       data: form, 
       headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }  
   })
   .then(response =>{ console.log(response.data.message)  })
   .catch( err =>{console.log(`Main - sendExam: ${err}`) })

}

// timeout 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);
    return new Promise((resolve, reject) => {
      archive
        .directory(sourceDir, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;
      stream.on('close', () => resolve());
      archive.finalize();
    });
}