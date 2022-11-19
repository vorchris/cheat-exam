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
import {disableRestrictions, enableRestrictions} from './platformrestrictions.js';
import fs from 'fs' 
import crypto from 'crypto';
import archiver from 'archiver'
import extract from 'extract-zip'
import screenshot from 'screenshot-desktop'
import FormData from 'form-data/lib/form_data.js';     //we need to import the file directly otherwise it will introduce a "window" variable in the backend and fail
import { join } from 'path'
import { screen } from 'electron'

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
        // CONNECTION LOST
        if (this.multicastClient.beaconsLost >= 4 ){ //remove server registration locally (same as 'kick')
            console.log("Connection to Teacher lost! Removing registration.")
            this.multicastClient.beaconsLost = 0
            this.resetConnection()
            if (this.multicastClient.clientinfo.exammode === true) {
                // lets try to allow students to gracefully exit exam on connection loss manually (only in geogebra and editor for now bc. we control the ui) 
                // this should lead to less irritation when the teacher connection is lost
                if (this.multicastClient.clientinfo.exammode === "eduvidual") {
                    this.gracefullyEndExam()  // this should end kiosk mode, the blur listener and all (keyboard) restrictions but not kill the window
                }else {
                    console.log("Keeping Examwindow Lockdown")
                }
            }
        }

        if (this.multicastClient.clientinfo.serverip) {  //check if server connected - get ip
            //create screenshot ATTENTION! "imagemagick" has to be installed for linux !!
            let img = await screenshot().catch((err) => { console.log(`SendBeacon Screenshot: ${err}`) });
            const formData = new FormData()  //create formdata
            formData.append('clientinfo', JSON.stringify(this.multicastClient.clientinfo) );   //we send the complete clientinfo object

            if (Buffer.isBuffer(img)){
                let screenshotfilename = this.multicastClient.clientinfo.token +".jpg"
                formData.append(screenshotfilename, img, screenshotfilename );
                let hash = crypto.createHash('md5').update(img).digest("hex");
                formData.append('screenshothash', hash);
                formData.append('screenshotfilename', screenshotfilename);
            }

            axios({    //send update and fetch server status
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

        // global status updates
        if (serverstatus.exammode && !this.multicastClient.clientinfo.exammode){ 
            this.startExam(serverstatus)
        }
        else if (!serverstatus.exammode && this.multicastClient.clientinfo.exammode){
            this.endExam()
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
            try {
                if (fs.existsSync(this.config.workdirectory)){   // set by server.js (desktop path + examdir)
                    fs.rmdirSync(this.config.workdirectory, { recursive: true });
                    fs.mkdirSync(this.config.workdirectory);
                }
            } catch (error) { console.error(error); }
        }

        let displays = screen.getAllDisplays()
        let primary = screen.getPrimaryDisplay()
        if (!primary || primary === "" || !primary.id){ primary = displays[0] }       
       
        if (!WindowHandler.examwindow){  // why do we check? because exammode is left if the server connection gets lost but students could reconnect while the exam window is still open and we don't want to create a second one
            this.multicastClient.clientinfo.examtype = serverstatus.examtype
            WindowHandler.createExamWindow(serverstatus.examtype, this.multicastClient.clientinfo.token, serverstatus, primary);
        }


        if (WindowHandler.examwindow){ 
            try {
                WindowHandler.examwindow.show()  // this is used to test if there is an exam window 
            }
            catch (e) { //examwindow variable is still set but the window is not managable anymore (manually closed ?)
                console.error("communicationhandler: no functional examwindow found.. resetting")
                WindowHandler.examwindow = null;
                disableRestrictions()
                this.multicastClient.clientinfo.exammode = false
                this.multicastClient.clientinfo.focus = true
                return
            }
        }

        if (!this.config.development) { 
            if (WindowHandler.examwindow){  //broken connection - exam window still open
                WindowHandler.examwindow.setFullScreen(true)  //go fullscreen again
                WindowHandler.examwindow.setAlwaysOnTop(true, "screen-saver", 1)  //make sure the window is 1 level above everything
            }
            WindowHandler.addBlurListener();
            enableRestrictions(WindowHandler.examwindow)
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
    async endExam(){
        //handle eduvidual case
        if (WindowHandler.examwindow){ 

            //send save trigger to exam window
            WindowHandler.examwindow.webContents.send('save', 'exitexam') //trigger, why
            await this.sleep(3000)  // give students time to read whats happening (and the editor time to save the content)
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
            console.log("Unlocking Workstation")
            try {
                WindowHandler.examwindow.setKiosk(false)
                WindowHandler.examwindow.setAlwaysOnTop(false)
                WindowHandler.examwindow.alwaysOnTop = false
                  // remove listener
                WindowHandler.removeBlurListener();
                disableRestrictions()
            } catch (e) { 
                WindowHandler.examwindow = null
                console.error("communicationhandler: no functional examwindow to handle")
            }
          
            try {
                for (let blockwindow of WindowHandler.blockwindows){
                    blockwindow.close(); 
                    blockwindow.destroy(); 
                    blockwindow = null;
                }
            } catch (e) { 
                WindowHandler.blockwindows = []
                console.error("communicationhandler: no functional blockwindow to handle")
            } 
            this.multicastClient.clientinfo.focus = true
            this.multicastClient.clientinfo.exammode = false
        }
    }

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
                        console.log("CommunicationHandler - files extracted")
                        fs.unlink(absoluteFilepath, (err) => { if (err) console.log(err); }); // remove zip file after extracting
                    }).then( () => {
                        if (backupfile) {    if (WindowHandler.examwindow){ WindowHandler.examwindow.webContents.send('backup', backupfile  ); console.log("CommunicationHandler - Trigger Replace Event") } }
                        if (WindowHandler.examwindow){ WindowHandler.examwindow.webContents.send('loadfilelist')}
                    })
                }
            });
        })
        .catch( err =>{console.log(`CommunicationHandler - requestFileFromServer: ${err}`) })   
    }


    resetConnection(){
        this.multicastClient.clientinfo.token = false
        this.multicastClient.clientinfo.ip = false
        this.multicastClient.clientinfo.serverip = false
        this.multicastClient.clientinfo.servername = false
        this.multicastClient.clientinfo.focus = true  // we are focused 
        //this.multicastClient.clientinfo.exammode = false   // do not set to false until exam window is manually closed
        this.multicastClient.clientinfo.timestamp = false
        this.multicastClient.clientinfo.virtualized = false  
    }
 

    async sendExamToTeacher(){
        //send save trigger to exam window
        if (WindowHandler.examwindow){
            WindowHandler.examwindow.webContents.send('save','teacherrequest')   //trigger, why
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
        let file = fs.readFileSync(zipfilepath);
        const form = new FormData()
        form.append(zipfilename, file, {contentType: 'application/zip', filename: zipfilename });   
     
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
 