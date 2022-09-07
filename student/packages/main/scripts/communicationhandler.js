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


import axios from "axios";
import {disableRestrictions} from './platformrestrictions.js';
import fs from 'fs' 
import crypto from 'crypto';
import archiver from 'archiver'
import extract from 'extract-zip'
import screenshot from 'screenshot-desktop'
import FormData from 'form-data/lib/form_data.js';     //we need to import the file directly otherwise it will introduce a "window" variable in the backend and fail
import { join } from 'path'
import {  BrowserWindow, screen  } from 'electron'

import WindowHandler from './windowhandler.js'

 /**
  * Handles information fetching from the server and acts on status updates
  */
 
 class CommHandler {
     constructor () {
       this.multicastClient = null
       this.config = null
       this.updateStudentIntervall = null
       this.WindowHandler = null
     }
 
  
     init (mc, config) {
        this.multicastClient = mc
        this.config = config
        this.updateStudentIntervall = setInterval(() => { this.sendBeacon() }, 5000)
     }
 


    /** 
     * sends heartbeat to registered server and updates screenshot on server 
     */
    async sendBeacon(){
        if (this.multicastClient.beaconsLost >= 1){ //remove server registration locally (same as 'kick')
            console.log("Connection to Teacher lost! Removing registration.")
            this.multicastClient.beaconsLost = 0
            this.resetConnection()
            this.gracefullyEndExam()  // this should end kiosk mode, the blur listener and all (keyboard) restrictions but not kill the window
        }

        if (this.multicastClient.clientinfo.serverip) {  //check if server connected - get ip
            //create screenshot ATTENTION! "imagemagick" has to be installed for linux !!
            let img = await screenshot().catch((err) => { console.log(`SendBeacon Screenshot: ${err}`) });
            const formData = new FormData()  //create formdata
            formData.append('clientinfo', JSON.stringify(this.multicastClient.clientinfo) );   //we send the complete clientinfo object

            if (Buffer.isBuffer(img)){
                //console.log('adding image to formdata')
                let screenshotfilename = this.multicastClient.clientinfo.token +".jpg"
                
                if (this.config.electron){  // in the final electron build this is the only way to do it 
                    img =  new Blob( [ new Uint8Array(img).buffer], { type: 'image/jpeg' })   
                }
                formData.append(screenshotfilename, img, screenshotfilename );
                let hash = crypto.createHash('md5').update(img).digest("hex");
                formData.append('screenshothash', hash);
                formData.append('screenshotfilename', screenshotfilename);
            }

            axios({    //post to /studentlist/update/:token - send update and fetch server status
                method: "post", 
                url: `https://${this.multicastClient.clientinfo.serverip}:${this.config.serverApiPort}/server/control/update`, 
                data: formData, 
                headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
            })
            .then( response => {
                if (response.data && response.data.status === "error") { 
                    if(response.data.message === "notavailable"|| response.data.message === "removed"){ console.log('No Exam or registration!'); this.multicastClient.beaconsLost = 4} //server responded but exam is not available anymore (teacher removed it)
                    else { this.multicastClient.beaconsLost += 1;  console.log("beacon lost..") }
                }
                else if (response.data && response.data.status === "success") { 
                    this.multicastClient.beaconsLost = 0 
                    this.processUpdatedServerstatus(response.data.serverstatus, response.data.studentstatus)
                }
            })
            .catch(error => { console.log(`SendBeacon Axios: ${error}`); this.multicastClient.beaconsLost += 1; console.log("beacon lost..") });
        }
    }




    /**
     * react to server status 
     * this currently only handle startexam & endexam
     * could also handle kick, focusrestore, and even trigger file requests
     */
    processUpdatedServerstatus(serverstatus, studentstatus){
        // global status updates
        if (serverstatus.exammode && !this.multicastClient.clientinfo.exammode){ 
            this.startExam(serverstatus)
        }
        else if (!serverstatus.exammode && this.multicastClient.clientinfo.exammode){
            this.endExam()
        }
        // individual status updates
        if ( studentstatus && Object.keys(studentstatus).length !== 0) {  // we have status updates (tasks) - do it!
            if (studentstatus.restorefocusstate === true){
                this.multicastClient.clientinfo.focus = true
            }
            if (studentstatus.sendexam === true){
                this.sendExamToTeacher()
            }
            if (studentstatus.fetchfiles === true){
                this.requestFileFromServer(studentstatus.files)
            }
        }
    }


    /**
     * Starts exam mode for student
     * deletes workfolder contents (if set)
     * opens a new window in kiosk mode with the given examtype
     * enables the blur listener and activates restrictions (disable keyboarshortcuts etc.)
     * @param serverstatus contains information about exammode, examtype, and other settings from the teacher instance
     */
    startExam(serverstatus){
        if (serverstatus.delfolder === true){
            console.log("cleaning exam workfolder")
            if (fs.existsSync(this.config.workdirectory)){   // set by server.js (desktop path + examdir)
                fs.rmdirSync(this.config.workdirectory, { recursive: true });
                fs.mkdirSync(this.config.workdirectory);
            }
        }

        let displays = screen.getAllDisplays()
        let primary = screen.getPrimaryDisplay()


        if (!WindowHandler.examwindow){  // why do we check? because exammode is left if the server connection gets lost but students could reconnect while the exam window is still open and we don't want to create a second one
            WindowHandler.createExamWindow(serverstatus.examtype, this.multicastClient.clientinfo.token, serverstatus, primary);
        }

        if (WindowHandler.examwindow){  //broken connection - exam window still open
            WindowHandler.examwindow.setFullScreen(true)  //go fullscreen again
        }

        WindowHandler.addBlurListener();

        if (!this.config.development) {
            for (let display of displays){
                if ( display.id !== primary.id ) {
                    WindowHandler.newBlockWin(display)  // add blockwindows for additional displays
                }
            }
        }
        this.multicastClient.clientinfo.exammode = true
    }


    /**
     * Disables Exam mode
     * closes exam window
     * disables restrictions and blur 
     */
    endExam(){
        //handle eduvidual case
        if (WindowHandler.examwindow){ 
            WindowHandler.examwindow.close(); 
            WindowHandler.examwindow.destroy(); 
            WindowHandler.examwindow = null;
            for (let blockwindow of WindowHandler.blockwindows){
                blockwindow.close(); 
                blockwindow.destroy(); 
                blockwindow = null;
            }
            WindowHandler.blockwindows = []
        }
        disableRestrictions()
        this.multicastClient.clientinfo.exammode = false
        this.multicastClient.clientinfo.focus = true
    }


    // this is triggered if connection is lost during exam - we allow the student to get out of the kiosk mode but keep his work in the editor
    gracefullyEndExam(){
        if (WindowHandler.examwindow){ 
            WindowHandler.examwindow.setKiosk(false)

            WindowHandler.examwindow.setAlwaysOnTop(false)
            WindowHandler.examwindow.alwaysOnTop = false

            // remove listener
            WindowHandler.removeBlurListener();

            this.multicastClient.clientinfo.focus = true
            this.multicastClient.clientinfo.exammode = false
            disableRestrictions()
            for (let blockwindow of WindowHandler.blockwindows){
                blockwindow.close(); 
                blockwindow.destroy(); 
                blockwindow = null;
            }
            WindowHandler.blockwindows = []
        }
    }

    requestFileFromServer(files){
        let servername = this.multicastClient.clientinfo.servername
        let serverip = this.multicastClient.clientinfo.serverip
        let token = this.multicastClient.clientinfo.token
    
        let data = JSON.stringify({ 'files' : files, 'type': 'studentfilerequest'})
        axios({
            method: "post", 
            url: `https://${serverip}:${this.config.serverApiPort}/server/data/download/${servername}/${token}`, 
            data: data, 
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'application/json' }  
        })
        .then(response =>{ 
            let absoluteFilepath = join(this.config.tempdirectory, token.concat('.zip'));
            fs.writeFile(absoluteFilepath, response.data, (err) => {
                if (err){console.log(err);}
                else {
                    extract(absoluteFilepath, { dir: this.config.workdirectory }, ()=>{ 
                        console.log("files extracted")
                        fs.unlink(absoluteFilepath, (err) => { if (err) console.log(err); }); // remove zip file after extracting
                    })
                }
            });
        })
        .catch( err =>{console.log(`Main - requestFileFromServer: ${err}`) })   
    }


    resetConnection(){
        //multicastClient.clientinfo.name = "DemoUser"  // keep name on disconnect (looks weird in edtior or geogebra)
        this.multicastClient.clientinfo.token = false
        this.multicastClient.clientinfo.ip = false
        this.multicastClient.clientinfo.serverip = false
        this.multicastClient.clientinfo.servername = false
        this.multicastClient.clientinfo.focus = true  // we are focused 
        this.multicastClient.clientinfo.exammode = false
        this.multicastClient.clientinfo.timestamp = false
        this.multicastClient.clientinfo.virtualized = false  
    }
 

    async sendExamToTeacher(){
        //send save trigger to exam window
        if (WindowHandler.examwindow){
            WindowHandler.examwindow.webContents.send('save')
        }
        // give it some time
        await this.sleep(1000)  // wait one second before zipping workdirectory (give save some time - unfortunately we have no way to wait for save - we could check the filetime in a "while loop" though)
     
        //zip config.work directory
        if (!fs.existsSync(this.config.tempdirectory)){ fs.mkdirSync(this.config.tempdirectory); }
        //fsExtra.emptyDirSync(this.config.tempdirectory)
        let zipfilename = this.multicastClient.clientinfo.name.concat('.zip')
        let servername = this.multicastClient.clientinfo.servername
        let serverip = this.multicastClient.clientinfo.serverip
        let token = this.multicastClient.clientinfo.token
        let zipfilepath = join(this.config.tempdirectory, zipfilename);
     
        await this.zipDirectory(this.config.workdirectory, zipfilepath)
        let file = await fs.readFileSync(zipfilepath);
        const form = new FormData()
     
        if (this.config.electron){
            let blob =  new Blob( [ new Uint8Array(file).buffer], { type: 'application/zip' })
            form.append(zipfilename, blob, zipfilename );
        } 
        else { form.append(zipfilename, file, {contentType: 'application/zip', filename: zipfilename });   }
     
        axios({
            method: "post", 
            url: `https://${serverip}:${this.config.serverApiPort}/server/data/receive/${servername}/${token}`, 
            data: form, 
            headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }  
        })
        .then(response =>{ console.log(response.data.message)  })
        .catch( err =>{console.log(`Main - sendExam: ${err}`) })
     
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
        });
    }






    // timeout 
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
   
 }
 
 export default new CommHandler()
 