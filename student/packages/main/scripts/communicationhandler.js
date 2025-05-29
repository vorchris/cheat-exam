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

'use strict'
import {disableRestrictions, enableRestrictions} from './platformrestrictions.js';
import fs from 'fs' 
import archiver from 'archiver'   // das macht krasseste racecoditions mit electron eigenen versionen - unbedingt die selbe version behalten wie electron
import extract from 'extract-zip'
import { join } from 'path'
import path from 'path';
import { screen, ipcMain, app } from 'electron'
import WindowHandler from './windowhandler.js'
import { execSync } from 'child_process';
const shell = (cmd) => execSync(cmd, { encoding: 'utf8' });

import log from 'electron-log';
import {SchedulerService} from './schedulerservice.ts'
import Tesseract from 'tesseract.js';

const __dirname = import.meta.dirname;
import crypto from 'crypto';

import https from 'https';
const agent = new https.Agent({ rejectUnauthorized: false });

import screenshot from 'screenshot-desktop-wayland';
import { Worker } from 'worker_threads';
import { pathToFileURL } from 'url';



 /**
  * Handles information fetching from the server and acts on status updates
  */
 
 class CommHandler {
    constructor () {
        this.multicastClient = null
        this.config = null
        this.updateStudentIntervall = null
        this.WindowHandler = null
        this.screenshotAbility = false
        this.screenshotFails = 0 // we count fails and deactivate on 4 consequent fails
        this.firstCheckScreenshot = true
        this.lastScreenshotBase64 = false
        this.lastScreenshot = false
        this.worker = null
        this.useWorker = true
        this.workerFails = 0
     }
 
    init (mc, config) {
        this.multicastClient = mc
        this.config = config
        this.updateScheduler = new SchedulerService(this.requestUpdate.bind(this), 5000)
        this.updateScheduler.start()
        this.screenshotScheduler = new SchedulerService(this.sendScreenshot.bind(this), this.multicastClient.clientinfo.screenshotinterval)
        this.screenshotScheduler.start()
        
   
        // check for screenshot and pre-processing capabilities on different linux setups to be more verbose and efficient
        if (process.platform === 'linux'){

            // test if image pre-processing is possible - imagemagick is required 
            if (this.imagemagickAvailable()){ this.useWorker = true;}  //worker is used for image pre-processing - without worker the image is sent unprocessed
            else { this.useWorker = false }

            // test if screenshot is possible
            if ((this.isGNOME() || this.isUNITY()) && this.isWayland()){
                this.screenshotAbility = false;  //for now - GNOME does not allow to take screenshots without sound and visual flash.. - use pagecapture as default on gnome
                log.info("communicationhandler @ init: Gnome/Unity and Wayland detected - ScreenshotAbility set to false") 
            }
            else if (this.isKDE() && this.isWayland() && this.flameshotAvailable()){   // TODO: extend screenshot-desktop-wayland to support "spectacle" because its pre-installed on KDE
                this.screenshotAbility = true;
                log.info("communicationhandler @ init: KDE-Wayland with flameshot detected - ScreenshotAbility set to true") 
            }
            else if (!this.isWayland() && this.imagemagickAvailable()){
                this.screenshotAbility = true;
                log.info("communicationhandler @ init: X11 with imagemagick detected - ScreenshotAbility set to true") 
            }
            else {
                this.screenshotAbility = false;
                log.info("communicationhandler @ init: ScreenshotAbility set to false - Using pagecapture as fallback")
            }

        }
        else {  // on windows and macos we try to use the worker and set screenshotAbility to true - if something doesn't work we fallback to pagecapture or no processing
            this.useWorker = true
            this.screenshotAbility = true
        }

        // setup the image worker
        if (!this.worker && this.useWorker){   this.setupImageWorker()  }
    }
 


    /**
     * Setup the image worker
     * uses fork to create a new child process
     * uses the imageWorkerLinux.js or imageWorkerSharp.js file
     * the worker is used to process the screenshot in a separate process
     */
    async setupImageWorker() {
        const workerFileName = process.platform === 'linux' ? 'imageWorkerLinux.js' : 'imageWorkerSharp.mjs';
        const workerPath = app.isPackaged
            ? join(process.resourcesPath, 'app.asar.unpacked', 'public', workerFileName)
            : join(__dirname, '../../public', workerFileName);
    
        // Konvertiere den absoluten Pfad in ein URL-Objekt (ohne .href)
        const workerURL = pathToFileURL(workerPath);
        
        this.worker = new Worker(workerURL, { type: 'module', env: { ...process.env } });
        log.info("communicationhandler @ setupImageWorker: ImageWorker initialized - using " + workerFileName)
        
        this.worker.on('error', error => {
            log.error('communicationhandler @ setupImageWorker: Worker error:', error);
        });
        
        this.worker.on('exit', code => {
            if (code !== 0) {
                this.workerFails += 1
                if (this.workerFails > 4){
                    this.useWorker = false
                    log.error('communicationhandler @ setupImageWorker: Worker failed 5 times - switching to no processing')
                }
                else { this.setupImageWorker(); }
            }
        });
    }


    /**
     * Process the screenshot 
     * if useWorker is true, the screenshot is processed in a separate process
     * otherwise the screenshot is not processed and the original screenshot is returned
     */
    async processImage(imgBuffer) {
        if (this.useWorker) {
            if (!this.worker) { //triple check if worker is initialized
                this.useWorker = false
                throw new Error('Worker not initialized');
            }
            this.worker.postMessage({ imgBuffer: Array.from(imgBuffer), imVersion: this.config.imVersion });
            const result = await new Promise(resolve => {
                this.worker.once('message', (message) => {
                    resolve(message);
                });
            });
            
            if (!result.success) throw new Error(result.error);
            return result; 
        } else {
            // fallback to no processing   
            const screenshotBase64 = Buffer.from(imgBuffer).toString('base64');
            const headerBase64 = screenshotBase64
            return { success: true, screenshotBase64: screenshotBase64, headerBase64: headerBase64, isblack: false, imgBuffer: imgBuffer };

        }
    }










    /**
     * checks for wayland session on linux - no screenshots here for now
     * @returns true or false
     */
    isWayland(){
        return process.env.XDG_SESSION_TYPE === 'wayland'; 
    }
    isKDE(){
        try{ 
            let output = shell('echo $XDG_CURRENT_DESKTOP')
            return output.trim() === 'KDE'
        }
        catch(error){ log.warn("communicationhandler @ isKDE: no data "); return false }
    }
    isGNOME() {
        try { 
            let desktop = shell('echo $XDG_CURRENT_DESKTOP').trim().toLowerCase();
            return desktop.includes('gnome'); // Case-insensitive Suche
        }
        catch(error) {
            log.warn("communicationhandler @ isGNOME: no data ", error);
            return false;
        }
    }
    isUNITY() {
        try { 
            let desktop = shell('echo $XDG_CURRENT_DESKTOP').trim().toLowerCase();
            return desktop.includes('unity'); // Case-insensitive Suche
        }
        catch(error) {
            log.warn("communicationhandler @ isUNITY: no data ", error);
            return false;
        }
    }

    imagemagickAvailable() {
        try {
            // Bei Version 7 liefert "magick -version" etwas – sonst lösen wir einen Fehler aus.
            shell("magick -version");
            this.config.imVersion = "7";
            log.info("communicationhandler: Found ImageMagick version 7 – using 'magick' as command.");
            return true;
        } catch (e) {
            try {
                // Fallback zu älteren Versionen: Prüfen, ob "import" verfügbar ist.
                shell("which import");
                this.config.imVersion = "<7";
                log.info("communicationhandler: Found ImageMagick version <7 – using 'import' as command.");
                return true;
            } catch (err) {
                log.error("communicationhandler @ imagemagickAvailable: ImageMagick is required to take screenshots and preprocess images on linux", err);
                return false;
            }
        }
    }



    flameshotAvailable(){
        try{ shell(`which flameshot`); return true}
        catch(error){
            log.error("communicationhandler @ flameshotAvailable: Flameshot is required to take screenshots on kde/wayland")
            return false
        }
    }

    /** 
     * Update current Serverstatus + Studenttstatus (every 5 seconds)
     */
    async requestUpdate(){
        if (this.multicastClient.clientinfo.localLockdown){return}
        // connection lost reset triggered  no serversignal for 20 seconds
        if (this.multicastClient.beaconsLost >= 5 ){  
            log.warn("communicationhandler @ requestUpdate: Connection to Teacher lost! Removing registration.") //remove server registration locally (same as 'kick')
            this.multicastClient.beaconsLost = 0
            this.resetConnection()   // this also resets serverip therefore no api calls are made afterwards
            this.killScreenlock()       // just in case screens are blocked.. let students work
        }  
        if (this.multicastClient.clientinfo.serverip) {  //check if server connected - get ip
            const clientInfo = JSON.stringify(this.multicastClient.clientinfo);
            fetch(`https://${this.multicastClient.clientinfo.serverip}:${this.config.serverApiPort}/server/control/update`, {
                method: "POST",
                cache: "no-store",
                headers: {'Content-Type': 'application/json', },
                body: JSON.stringify({ clientinfo: clientInfo }),
            })
            .then(response => {
                if (!response.ok) { throw new Error('Network response was not ok'); }
                return response.json();
            })
            .then(data => {
                if (data.status === "error") {
                    if      (data.message === "notavailable"){ log.warn('communicationhandler @ requestUpdate: Exam Instance not found!');        this.multicastClient.beaconsLost = 5; } 
                    else if (data.message === "removed"){      log.warn('communicationhandler @ requestUpdate: Student registration not found!'); this.multicastClient.beaconsLost = 5; } 
                    else {                                     log.warn("communicationhandler @ requestUpdate: 1 Heartbeat lost..");              this.multicastClient.beaconsLost += 1;} 
                } else if (data.status === "success") {
                    this.multicastClient.beaconsLost = 0; // Dies zählt ebenfalls als erfolgreicher Heartbeat - Verbindung halten
                    this.multicastClient.clientinfo.printrequest = false  //set this to false after the request left the client to prevent double triggering
                    const serverStatusDeepCopy = JSON.parse(JSON.stringify(data.serverstatus));
                    const studentStatusDeepCopy = JSON.parse(JSON.stringify(data.studentstatus));
                    this.processUpdatedServerstatus(serverStatusDeepCopy, studentStatusDeepCopy);    // Verarbeitung der empfangenen Daten
                }    
            })
            .catch(error => {
                this.multicastClient.beaconsLost += 1;
                log.error(`communicationhandler @ requestUpdate: (${this.multicastClient.beaconsLost}) ${error}`);
            });
        }
        else { // prevent focus warning block if no connection 
            this.multicastClient.clientinfo.focus = true  // if not connected but still in exam mode you could trigger a focus warning and nobody is able to unlock you
        }
    }







    async sendScreenshot(){
        if (this.multicastClient.clientinfo.localLockdown){return}
        if (this.multicastClient.beaconsLost >= 5 ){return}  // connection lost reset triggered
        if (this.multicastClient.clientinfo.serverip) {  //check if server connected - get ip
            
            let success, screenshotBase64, headerBase64, isblack; // Variablen außerhalb des if-Blocks definieren
            let imgBuffer = null;

            try {
                if (this.screenshotAbility){  
                    //grab screenshot from desktop via screenshot-desktop-wayland (flameshot, imagemagic, etc)
                    imgBuffer = await screenshot({ format: 'png' });
                    ({ success, screenshotBase64, headerBase64, isblack, imgBuffer } = await this.processImage(imgBuffer));  // kein imageBuffer mitgegeben bedeutet nutze screenshot-desktop im worker
                    if (success) { this.screenshotFails = 0;}
                    else { 
                        throw new Error("Image processing failed");
                    }
                }
                else {
                    //grab "screenshot" from appwindow
                    let currentFocusedMindow = WindowHandler.getCurrentFocusedWindow()  //returns exam window if nothing in focus or main window
                    if (currentFocusedMindow) {
                        let result = await currentFocusedMindow.webContents.capturePage()  // this should always work because it's onboard electron
                        imgBuffer = result.toPNG()
                    }
                    ({ success, screenshotBase64, headerBase64, isblack } = await this.processImage(imgBuffer)); // attention processImage  converts buffer to uint8array
                }
            }
            catch(err){
                this.screenshotFails +=1;
                log.error(`communicationhandler @ sendScreenshot: processImage failed: ${err}`)
            }

            
                
            /**
             * MACOS WORKAROUND - switch to pagecapture if no permissons are granted
             */
            if (process.platform === "darwin" && this.firstCheckScreenshot && imgBuffer !== null){  //this is for macOS because it delivers a blank background screenshot without permissions. we catch that case with a workaround
                this.firstCheckScreenshot = false   //never do this again
                const publicPath = app.isPackaged ? path.join(process.resourcesPath,'app.asar.unpacked', 'public') : path.resolve(__dirname, '../../public');
                try{
                    const { data: { text } }   = await Tesseract.recognize(imgBuffer , 'eng',{ langPath: publicPath } );
                    let appWindowVisible = text.includes("Exam")   //check if the word "Exam" can be found in screenshot - otherwise it is most likely a blank desktop - macos quirk
                    if (!appWindowVisible){
                        this.screenshotAbility=false;
                        log.warn("communicationhandler @ sendScreenshot (macos): Please check your screenshot permissions - Switching to PageCapture");
                    }
                    else { log.info("communicationhandler @ sendScreenshot (macos): MacOS screenshotpermissions check OK");}
                }catch(err){  log.error(`communicationhandler @ sendScreenshot (macos): ${err}`); }
            }


            // if something went wrong we do not have a screenshot - so do not update the server
            if (!screenshotBase64){
                if(this.screenshotFails > 4 && this.screenshotAbility){ this.screenshotAbility=false; log.error(`communicationhandler @ sendScreenshot: Screenshot error -> Switching to PageCapture`) } 
                else if (this.screenshotFails > 4 && !this.screenshotAbility){ this.useWorker = false; log.error(`communicationhandler @ sendScreenshot: PageCapture error -> Switching to No-Processing`) }   
                else if (this.screenshotFails > 4 && !this.screenshotAbility && !this.useWorker){ log.error(`communicationhandler @ sendScreenshot: no screenshot available - please fix your setup`) }
                return
            }




            //do not run colorcheck if already locked
            if ( this.multicastClient.clientinfo.exammode && !this.config.development && this.multicastClient.clientinfo.focus){
                if (isblack){
                    this.multicastClient.clientinfo.focus = false
                    log.info("communicationhandler @ sendScreenshot: Student Screenshot does not fit requirements (allblack)");
                }   
            }
        

            // Berechnen des MD5-Hashs des Base64-Strings
            let screenshothash = null
            try { screenshothash = crypto.createHash('md5').update(Buffer.from(screenshotBase64, 'base64')).digest("hex");  }  // Berechnen des MD5-Hashs des Base64-Strings
            catch(err){ log.error(`communicationhandler @ sendScreenshot: creating hash failed: ${err.message}`)  }
            
            const payload = {
                clientinfo: {...this.multicastClient.clientinfo},
                screenshot: screenshotBase64,
                screenshothash: screenshothash,
                header: headerBase64,
                screenshotfilename: this.multicastClient.clientinfo.token + ".jpg",
            };
                
            // send screenshot to server via email fetch request
            let attempt = 0;
            const maxRetries = 2;
            const url = `https://${this.multicastClient.clientinfo.serverip}:${this.config.serverApiPort}/server/control/updatescreenshot`;
            this.doScreenshotUpdate(url, payload, agent, attempt, maxRetries); // Erste Anfrage starten
        }
    }





    doScreenshotUpdate(url, payload, agent, attempt = 0, maxRetries) {
        fetch(url, {
            method: "POST",
            cache: "no-store",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            agent,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('communicationhandler @ sendScreenshot: Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.status === "error") {
                log.error("communicationhandler @ sendScreenshot: Status Error: ", data.message);
            }
        })
        .catch(error => {
            if (attempt < maxRetries - 1) {
                this.doScreenshotUpdate(url, payload, agent, attempt + 1, maxRetries); // Retry
            } else if (attempt === maxRetries - 1 && this.multicastClient.beaconsLost === 0) {
                log.error(`communicationhandler @ sendScreenshot (fetch): ${error.message}`);
            }
        });
    }











    /**
     * react to server status 
     * this currently only handle startexam & endexam
     * could also handle kick, focusrestore, and even trigger file requests
     */
    processUpdatedServerstatus(serverstatus, studentstatus){
       
        ///////////////////////////////
        // individual status updates

        if ( studentstatus && Object.keys(studentstatus).length !== 0) {  // we have status updates (tasks) - do it!
            if (studentstatus.printdenied) {
                WindowHandler.examwindow.webContents.send('denied','toomany')   //trigger, why
            }

            if (studentstatus.delfolder === true){
                log.info("communicationhandler @ processUpdatedServerstatus: cleaning exam workfolder")
                let delfolder = true
                try {
                    if (fs.existsSync(this.config.examdirectory)){   // set by server.js (desktop path + examdir)
                        fs.rmSync(this.config.examdirectory, { recursive: true });
                        fs.mkdirSync(this.config.examdirectory);
                    }
                } catch (error) { 
                    delfolder = false
                    WindowHandler.examwindow.webContents.send('fileerror', error)  
                    log.error(`communicationhandler @ processUpdatedServerstatus: Can not delete directory - ${error} `)
                }

                if (delfolder == false){  //try deleting file by file (the one that causes the problem will stay in the folder)
                    if (fs.existsSync(this.config.examdirectory)) {
                        const files = fs.readdirSync(this.config.examdirectory);

                        files.forEach(file => {
                            const filePath = join(this.config.examdirectory, file);
                            try {
                                const stats = fs.statSync(filePath);
                                if (stats.isDirectory()) { fs.rmSync(filePath, { recursive: true }); }  // Versuche, das Verzeichnis rekursiv zu löschen
                                else { fs.unlinkSync(filePath);  }// Versuche, die Datei zu löschen 
                            }
                            catch (error) {
                                log.error(`communicationhandler @ processUpdatedServerstatus: (delfolder) Fehler beim Löschen der Datei/Verzeichnis: ${filePath}`, error);
                            }
                        });
                    }
                }
                if (WindowHandler.examwindow) {  WindowHandler.examwindow.webContents.send('loadfilelist');   }
            }


            if (studentstatus.focus == false){
                this.multicastClient.clientinfo.focus = false
            }

            if (studentstatus.restorefocusstate === true){
                log.info("communicationhandler @ processUpdatedServerstatus: restoring focus state for student")
                this.multicastClient.clientinfo.focus = true
                if (WindowHandler.examwindow && !this.config.development){ 
                    WindowHandler.examwindow.setKiosk(true)
                    WindowHandler.examwindow.focus()
                }
            }
            if (studentstatus.activatePrivateSpellcheck == true && this.multicastClient.clientinfo.privateSpellcheck.activated == false  ){
                log.info("communicationhandler @ processUpdatedServerstatus: activating spellcheck for student")
                this.multicastClient.clientinfo.privateSpellcheck.activate = true  //clientinfo.privateSpellcheck will be put on this.privateSpellcheck in editor updated via fetchInfo()
                this.multicastClient.clientinfo.privateSpellcheck.activated = true
               // ipcMain.emit('activatespellcheck', serverstatus.spellchecklang ) //deprecated : nodehun
                ipcMain.emit("startLanguageTool")
            }
            if (studentstatus.activatePrivateSpellcheck == false && this.multicastClient.clientinfo.privateSpellcheck.activated == true ) {
                log.info("communicationhandler @ processUpdatedServerstatus: de-activating spellcheck for student")
                this.multicastClient.clientinfo.privateSpellcheck.activate = false
                this.multicastClient.clientinfo.privateSpellcheck.activated = false 
            }

            this.multicastClient.clientinfo.privateSpellcheck.suggestions = studentstatus.activatePrivateSuggestions

            if (studentstatus.sendexam === true){
                this.sendExamToTeacher()
            }
            if (studentstatus.fetchfiles === true){
                this.requestFileFromServer(studentstatus.files)
            }
            // this is an microsoft365 thing. check if exam mode is office, check if this is set - otherwise do not enter exammode - it will fail
            if (studentstatus.msofficeshare){
                //set or update sharing link - it will be used in "microsoft365" exam mode
                this.multicastClient.clientinfo.msofficeshare = studentstatus.msofficeshare  
            }
            if (studentstatus.group){
                //set or update group 
                this.multicastClient.clientinfo.group = studentstatus.group  
            }

        

        }


        ////////////////////////////////
        // global status updates
        if (serverstatus.screenslocked && !this.multicastClient.clientinfo.screenlock) {  this.activateScreenlock() }
        else if (!serverstatus.screenslocked ) { this.killScreenlock() }

        // screenshot safety (OCR searches for next-exam string)
        if (serverstatus.screenshotocr) { this.multicastClient.clientinfo.screenshotocr = true  }
        else { this.multicastClient.clientinfo.screenshotocr = false   }

        // Groups handling
        if (serverstatus.groups){ this.multicastClient.clientinfo.groups = true}
        else { this.multicastClient.clientinfo.groups = false}

        //update screenshotinterval
        if (serverstatus.screenshotinterval || serverstatus.screenshotinterval === 0) { //0 is the same as false or undefined but should be treated as number
            
            if (this.multicastClient.clientinfo.screenshotinterval !== serverstatus.screenshotinterval*1000 ) {
                log.info("communicationhandler @ processUpdatedServerstatus: ScreenshotInterval changed to", serverstatus.screenshotinterval*1000)
                this.multicastClient.clientinfo.screenshotinterval = serverstatus.screenshotinterval*1000
                  if ( serverstatus.screenshotinterval == 0) {
                    log.info("communicationhandler @ processUpdatedServerstatus: ScreenshotInterval disabled!")
                }
                // clear old interval and start new interval if set to something bigger than zero
                this.screenshotScheduler.stop()
                
                if (this.multicastClient.clientinfo.screenshotinterval > 0){
                    this.screenshotScheduler.interval = this.multicastClient.clientinfo.screenshotinterval
                    this.screenshotScheduler.start()
                   
                }
            }
        }
        
        if (serverstatus.exammode && !this.multicastClient.clientinfo.exammode){
            this.killScreenlock() // remove lockscreen immediately - don't wait for server info
            this.startExam(serverstatus)
        }
        else if (!serverstatus.exammode && this.multicastClient.clientinfo.exammode){
            this.killScreenlock() 
            this.endExam(serverstatus)
        }

    }


    // show temporary screenlock window
    activateScreenlock(){
        let displays = screen.getAllDisplays()
        let primary = screen.getPrimaryDisplay()
        if (!primary || primary === "" || !primary.id){ primary = displays[0] }       
       
        if (WindowHandler.screenlockwindows.length == 0){  // why do we check? because exammode is left if the server connection gets lost but students could reconnect while the exam window is still open and we don't want to create a second one
            this.multicastClient.clientinfo.screenlock = true
            for (let display of displays){
                WindowHandler.createScreenlockWindow(display)  // add blockwindows for additional displays
            } 
        }
    }

    // remove temporary screenlockwindow
    killScreenlock(){
        try {
            for (let screenlockwindow of WindowHandler.screenlockwindows){
                screenlockwindow.close(); 
                screenlockwindow.destroy(); 
                screenlockwindow = null;
            }
        } catch (e) { 
            WindowHandler.screenlockwindows = []
            log.error("communicationhandler @ killScreenlock: no functional screenlockwindow to handle")
        } 
        WindowHandler.screenlockwindows = []
        this.multicastClient.clientinfo.screenlock = false
    }














    /**
     * Starts exam mode for student
     * deletes workfolder contents (if set)
     * opens a new window in kiosk mode with the given examtype
     * enables the blur listener and activates restrictions (disable keyboarshortcuts etc.)
     * @param serverstatus contains information about exammode, examtype, and other settings from the teacher instance
     */
    async startExam(serverstatus){
  
        let displays = screen.getAllDisplays()
        let primary = screen.getPrimaryDisplay()
       
        if (!primary || primary === "" || !primary.id){ primary = displays[0] }       

        this.multicastClient.clientinfo.exammode = true
        this.multicastClient.clientinfo.cmargin = serverstatus.cmargin  // this is used to configure margin settings for the editor
        this.multicastClient.clientinfo.linespacing = serverstatus.linespacing // we try to double linespacing on demand in pdf creation
        this.multicastClient.clientinfo.audioRepeat = serverstatus.audioRepeat // restrict repetition of audio files (for listening comprehension)

        if (!WindowHandler.examwindow){  // why do we check? because exammode is left if the server connection gets lost but students could reconnect while the exam window is still open and we don't want to create a second one
            log.info("communicationhandler @ startExam: creating exam window")
            this.multicastClient.clientinfo.examtype = serverstatus.examtype
            WindowHandler.createExamWindow(serverstatus.examtype, this.multicastClient.clientinfo.token, serverstatus, primary);
        }
        else if (WindowHandler.examwindow){  //reconnect into active exam session with exam window already open
            log.error("communicationhandler @ startExam: found existing Examwindow..")
            try {  // switch existing window back to exam mode
                WindowHandler.examwindow.show() 
                if (!this.config.development) { 
                    WindowHandler.examwindow.setFullScreen(true)  //go fullscreen again
                    WindowHandler.examwindow.setAlwaysOnTop(false, "screen-saver", 1)  //make sure the window is 1 level above everything
                    enableRestrictions(WindowHandler)
                    await this.sleep(2000) // wait an additional 2 sec for windows restrictions to kick in (they steal focus)
                    WindowHandler.addBlurListener();
                }   
            }
            catch (e) { //examwindow variable is still set but the window is not managable anymore (manually closed in dev mode?)
                log.error("communicationhandler @ startExam: no functional examwindow found.. resetting")
                
                disableRestrictions(WindowHandler.examwindow)  //examwindow is given but not used in disableRestrictions
                WindowHandler.examwindow = null;
                this.multicastClient.clientinfo.exammode = false
                this.multicastClient.clientinfo.focus = true
                return  // in that case.. we are finished here !
            }
        }

        if (!this.config.development) {  // lock additional screens
            for (let display of displays){
                if ( display.id !== primary.id ) {
                    if ( !this.isApproximatelyEqual(display.bounds.x, primary.bounds.x)) {  //on kde displays may be manually positioned at 1920px or 1921px so we allow a range to identify overlapping (cloned) displays
                        log.info("create blockwin on:",display.id)
                        WindowHandler.newBlockWin(display)  // add blockwindows for additional displays
                    } 
                }
            }
            await this.sleep(1000)
            WindowHandler.blockwindows.forEach( (blockwin) => {
                blockwin.moveTop();
            })
        }
    }


    //returns true if a number is within tolerance 
    isApproximatelyEqual(x1, x2, tolerance = 4) {
        return Math.abs(x1 - x2) <= tolerance;
    }



    /**
     * Disables Exam mode
     * closes exam window
     * disables restrictions and blur 
     */
    async endExam(serverstatus){
        log.info(serverstatus)
        // delete students work on students pc (makes sense if exam is written on school property)
        if (serverstatus.delfolderonexit === true){
            log.info("communicationhandler @ endExam: cleaning exam workfolder on exit")
            try {
                if (fs.existsSync(this.config.examdirectory)){   // set by server.js (desktop path + examdir)
                    fs.rmSync(this.config.examdirectory, { recursive: true });
                    fs.mkdirSync(this.config.examdirectory);
                }
            } catch (error) { log.error("communicationhandler @ endExam: ",error); }
        }
        WindowHandler.removeBlurListener();
        disableRestrictions()

        if (WindowHandler.examwindow){ // in some edge cases in development this is set but still unusable - use try/catch   
            try {  //send save trigger to exam window
                if (!serverstatus.delfolderonexit){
                    WindowHandler.examwindow.webContents.send('save', 'exitexam') //trigger, why
                    await this.sleep(3000)  // give students time to read whats happening (and the editor time to save the content)
                }
                WindowHandler.examwindow.close(); 
                WindowHandler.examwindow.destroy(); 
            }
            catch(e){ log.error(e)}
           
            try {
                for (let blockwindow of WindowHandler.blockwindows){
                    blockwindow.close(); 
                    blockwindow.destroy(); 
                    blockwindow = null;
                }
            } catch (e) { 
                WindowHandler.blockwindows = []
                log.error("communicationhandler @ endExam: no functional blockwindow to handle")
            }  
        }
        WindowHandler.blockwindows = []
        WindowHandler.examwindow = null;
        this.multicastClient.clientinfo.exammode = false
        this.multicastClient.clientinfo.focus = true

        // ask student to quit app after finishing exam
        WindowHandler.showExitQuestion()
    }


    // this is manually  triggered if connection is lost during exam - we allow the student to get out of the kiosk mode but keep his work in the editor
    // for some reason i changed this function to also kill the exam window and therefore exit the exam completely so this is basically redundant
    gracefullyEndExam(){
        disableRestrictions()

        if (WindowHandler.examwindow){ 
            this.multicastClient.clientinfo.exammode = false
            log.warn("communicationhandler @ gracefullyEndExam: Manually Unlocking Workstation")
            try {
                // remove listener
                WindowHandler.removeBlurListener();
                WindowHandler.examwindow.close(); 
                if (WindowHandler.examwindow){ WindowHandler.examwindow.destroy(); }
                WindowHandler.examwindow = null
              
            } catch (e) { 
                WindowHandler.examwindow = null
                log.error("communicationhandler @ gracefullyEndExam: no functional examwindow to handle")
            }
          
            try {
                for (let blockwindow of WindowHandler.blockwindows){
                    blockwindow.close(); 
                    blockwindow.destroy(); 
                    blockwindow = null;
                }
            } catch (e) { 
                WindowHandler.blockwindows = []
                log.error("communicationhandler @ gracefullyEndExam: no functional blockwindow to handle")
            }   
        }
      
        WindowHandler.blockwindows = []
        WindowHandler.examwindow = null
        this.multicastClient.clientinfo.focus = true
        this.multicastClient.clientinfo.exammode = false
        this.multicastClient.clientinfo.localLockdown = false;
    }

    // reset all variables that signal or need a valid teacher connection
    resetConnection(){
        this.multicastClient.clientinfo.token = false
        this.multicastClient.clientinfo.ip = false
        this.multicastClient.clientinfo.serverip = false
        this.multicastClient.clientinfo.servername = false
        this.multicastClient.clientinfo.focus = true  // we are focused 
        //this.multicastClient.clientinfo.exammode = false   // do not set to false until exam window is manually closed
        this.multicastClient.clientinfo.timestamp = false
        this.multicastClient.clientinfo.localLockdown = false
        //this.multicastClient.clientinfo.virtualized = false  // this check happens only at the application start.. do not reset once set
    }
 



    /**
     * diese methode holt sich, die vom teacher zum download bereitgelegten dateien
     * über das update interval wird der trigger zum download und die filelist erhalten
     * @param {*} files 
     */
    requestFileFromServer(files){
        let servername = this.multicastClient.clientinfo.servername
        let serverip = this.multicastClient.clientinfo.serverip
        let token = this.multicastClient.clientinfo.token
        let backupfile = false
        for (const file of files) {
            if (file.name && file.name.includes('bak')){
                backupfile = file.name
            }
        }
        

        // Daten für den POST-Request vorbereiten
        let data = JSON.stringify({ 'files': files, 'type': 'studentfilerequest' });

        // Fetch-Request mit den entsprechenden Optionen
        fetch(`https://${serverip}:${this.config.serverApiPort}/server/data/download/${servername}/${token}`, {
            method: "POST",
            body: data,
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.arrayBuffer()) // Antwort als ArrayBuffer erhalten
        .then(buffer => {
            let absoluteFilepath = join(this.config.tempdirectory, token.concat('.zip'));
            fs.writeFile(absoluteFilepath, Buffer.from(buffer), (err) => {
                if (err) { log.error(err);  } 
                else {
                    extract(absoluteFilepath, { dir: this.config.examdirectory }) 
                    .then(() => {
                        log.info("CommunicationHandler @ requestFileFromServer: files received and extracted");
                        return fs.promises.unlink(absoluteFilepath); // Verwendung der Promise-basierten API von fs
                    })
                    .then(() => {
                        if (backupfile && WindowHandler.examwindow) {
                            WindowHandler.examwindow.webContents.send('backup', backupfile);
                            log.warn("CommunicationHandler @ requestFileFromServer: Trigger Replace Event");
                        }
                        if (WindowHandler.examwindow) {  WindowHandler.examwindow.webContents.send('loadfilelist');   }
                    })
                    .catch(err => {
                        log.error(err);
                    });
                }
            });
        })
        .catch(err => log.error(`CommunicationHandler - requestFileFromServer: ${err}`));
    }




    async sendExamToTeacher(){
        //send save trigger to exam window
        if (WindowHandler.examwindow){  //there is a running exam - save current work first!
            try {
                WindowHandler.examwindow.webContents.send('save','teacherrequest')   //trigger, why  (teacherrequest will also trigger sendToTeacher() after saving the pdf)
            }
            catch(err){ 
                log.error(`Communication handler @ sendExamToTeacher: Could not save students work. Is exammode active?`)
            }
        }
        else {  // not running exam (probably using next-exam as classroommanagment tool)
            this.sendToTeacher()   //zip directory and send to teacher api
        }

     }


      //zip config.work directory and send to teacher
     async sendToTeacher(){
        try { if (!fs.existsSync(this.config.tempdirectory)){ fs.mkdirSync(this.config.tempdirectory); }
        }catch (e){ log.error(e)}

        //fsExtra.emptyDirSync(this.config.tempdirectory)
        let zipfilename = this.multicastClient.clientinfo.name.concat('.zip')
        let servername = this.multicastClient.clientinfo.servername
        let serverip = this.multicastClient.clientinfo.serverip
        let token = this.multicastClient.clientinfo.token
        let zipfilepath = join(this.config.tempdirectory, zipfilename);
     

        let base64File = null
        try {
            await this.zipDirectory(this.config.examdirectory, zipfilepath)
            const fileContent = fs.readFileSync(zipfilepath);
            base64File = fileContent.toString('base64');
        }catch (e){  log.error(e)  }

        // sending the whole directory as zip file base64encoded via JSON isn't probably the best method but it works while all formData approaches failed with
        // fetch() while they worked with ax ios() - not even chatgpt or stackoverflow could help ^^ i think it is related to the specific formData module that cant be imported without "window error"
        const url = `https://${serverip}:${this.config.serverApiPort}/server/data/receive/${servername}/${token}`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file: base64File, filename: zipfilename }),
        })
        .then(response => response.json())
        .then(data => { log.info(`communicationhandler @ sendExamToTeacher: teacher response: ${data.message}`); })
        .catch(error => {log.error(`communicationhandler @ sendExamToTeacher: ${error}`); });
     }






    /**
     * @param {String} sourceDir: /some/folder/to/compress
     * @param {String} outPath: /path/to/created.zip
     * @returns {Promise}
     */
    zipDirectory(sourceDir, outPath) {
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
        }).catch( error => { log.error(error)});
    }






    // timeout 
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
   
 }
 
 export default new CommHandler()
 