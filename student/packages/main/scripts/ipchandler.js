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


import path from 'path'
import fs from 'fs'
import ip from 'ip'
import axios from 'axios'
import i18n from '../../renderer/src/locales/locales.js'
const { t } = i18n.global
import {  ipcMain } from 'electron'
import defaultGateway from'default-gateway';
import os from 'os'

  ////////////////////////////////
 // IPC handling (Backend) START
////////////////////////////////

class IpcHandler {
    constructor () {
        this.multicastClient = null
        this.config = null
        this.WindowHandler = null
    }
    init (mc, config, wh, ch) {
        this.multicastClient = mc
        this.config = config
        this.WindowHandler = wh  
        this.CommunicationHandler = ch

        /**
         * Registers virtualized status
         */ 
        ipcMain.on('virtualized', () => {  this.multicastClient.clientinfo.virtualized = true; } )


        /**
         * Returns the main config object
         */ 
        ipcMain.on('getconfig', (event) => {   event.returnValue = this.config   })


        /**
        * Unlock Computer
        */ 
        ipcMain.on('gracefullyexit', () => {  this.CommunicationHandler.gracefullyEndExam() } )


        /**
         * re-check hostip and enable multicast client
         */ 
        ipcMain.on('checkhostip', (event) => {   
            try { //bind to the correct interface
                const {gateway, interface: iface} =  defaultGateway.v4.sync()
                this.config.hostip = ip.address(iface)    // this returns the ip of the interface that has a default gateway..  should work in MOST cases.  probably provide "ip-options" in UI ?
            }
            catch (e) {
                console.log("ipcHandler: Unable to determine default gateway")
                this.config.hostip = false
            }
            // check if multicast client is running - otherwise start it
            if (this.config.hostip) {
                let address = false
                try { address = this.multicastClient.client.address() }
                catch (e) { console.log("ipcHandler: multicastclient not running") }
                if (!address){ this.multicastClient.init()}
            }
            event.returnValue = this.config.hostip 
        })


        /**
         * Stores the ExamWindow content as PDF
         */ 
        ipcMain.on('printpdf', (event, args) => { 
            if (this.WindowHandler.examwindow){
                var options = {
                    margins: {top:0.5, right:0.5, bottom:0.5, left:0.5 },
                    pageSize: 'A4',
                    printBackground: false,
                    printSelectionOnly: false,
                    landscape: args.landscape,
                    displayHeaderFooter:true,
                    footerTemplate: "<div style='height:12px; font-size:8px; text-align: right; width:100%; margin-right: 20px;'><span class=pageNumber></span>|<span class=totalPages></span></div>",
                    headerTemplate: `<div style='height:12px; font-size:8px; text-align: right; width:100%; margin-right: 20px;'><span class=date></span>|<span>${args.clientname}</span></div>`,
                    preferCSSPageSize: false
                }

                const pdffilepath = path.join(this.config.workdirectory, args.filename);
                this.WindowHandler.examwindow.webContents.printToPDF(options).then(data => {
                    fs.writeFile(pdffilepath, data, (err) => { 
                        if (err) {
                            console.log(err.message); 
                            if (err.message.includes("permission denied")){
                                console.log("writing under different name")
                                let alternatepath = `${pdffilepath}-${this.multicastClient.clientinfo.token}.pdf`
                                fs.writeFile(alternatepath, data, function (err) { if (err) { console.log(err.message); console.log("giving up"); }  } ); 
                            }
                        
                        }  
                    } ); 
                }).catch(error => { console.log(error)});
            }
        })


        /**
         * Returns all found Servers and the information about this client
         */ 
        ipcMain.on('getinfo', (event) => {   
            let serverstatus = false
            if (this.WindowHandler.examwindow) { serverstatus = this.WindowHandler.examwindow.serverstatus }

            event.returnValue = {   
                serverlist: this.multicastClient.examServerList,
                clientinfo: this.multicastClient.clientinfo,
                serverstatus: serverstatus
            }   
        })


        /**
         * Sends a register request to the given server ip
         * @param args contains an object with  clientname:this.username, servername:servername, serverip, serverip, pin:this.pincode 
         */
        ipcMain.on('register', (event, args) => {   
            const clientname = args.clientname
            const pin = args.pin
            const serverip = args.serverip
            const servername = args.servername
            const clientip = ip.address()
            const hostname = os.hostname()
            const version = this.config.version

            if (this.multicastClient.clientinfo.token){ //#FIXME das sollte eigentlich vom server kommen 
                event.returnValue = { sender: "client", message: t("control.alreadyregistered"), status:"error" }
            }
        
            axios({ method:'get', 
                    url:`https://${serverip}:${this.config.serverApiPort}/server/control/registerclient/${servername}/${pin}/${clientname}/${clientip}/${hostname}/${version}`,
                    timeout: 8000})
            .then(response => {
                if (response.data && response.data.status == "success") { // registration successfull otherwise data would be "false"
                    this.multicastClient.clientinfo.name = clientname
                    this.multicastClient.clientinfo.serverip = serverip
                    this.multicastClient.clientinfo.servername = servername
                    this.multicastClient.clientinfo.ip = clientip
                    this.multicastClient.clientinfo.hostname = hostname
                    this.multicastClient.clientinfo.token = response.data.token // we need to store the client token in order to check against it before processing critical api calls
                    this.multicastClient.clientinfo.focus = true
                    this.multicastClient.clientinfo.pin = pin
                }
                event.returnValue = response.data
            
            }).catch(err => {
                //we return the servers error message to the ui
                console.log(err.message)
                if (err.message.includes("timeout")){err.message = t("student.timeout") }
                event.returnValue = { sender: "client", message:err.message , status:"error" } 
            })
        })



        /**
         * Store content from editor as html file - as backup - only triggered by the teacher for now (allow manual backup !!)
         * @param args contains an object with  {clientname:this.clientname, filename:`${filename}.html`, editorcontent: editorcontent }
         */
        ipcMain.on('storeHTML', (event, args) => {   
            const htmlContent = args.editorcontent
            const htmlfilename = `${this.multicastClient.clientinfo.name}.bak`
            const htmlfile = path.join(this.config.workdirectory, htmlfilename);

            if (htmlContent) { 
                console.log("saving students work to disk...")
                fs.writeFile(htmlfile, htmlContent, (err) => {if (err) console.log(err); }); 
                event.returnValue = { sender: "client", message:t("data.filestored") , status:"success" }
            }
        })


        /**
         * Store content from Geogebra as ggb file - as backup 
         * @param args contains an object with  { filename:`${this.clientname}.ggb`, content: base64 }
         */
        ipcMain.on('saveGGB', (event, args) => {   
            const content = args.content
            const filename = args.filename
            const ggbFilePath = path.join(this.config.workdirectory, filename);
            if (content) { 
                console.log("saving students work to disk...")
                const fileData = Buffer.from(content, 'base64');
                fs.writeFileSync(ggbFilePath, fileData);
                event.returnValue = { sender: "client", message:t("data.filestored") , status:"success" }
            }
        })



        /**
         * load content from ggb file and send it to the frontend 
         * @param args contains an object { filename:`${this.clientname}.ggb` }
         */
        ipcMain.on('loadGGB', (event, filename) => {   
           
            const ggbFilePath = path.join(this.config.workdirectory, filename);

            try {
                // Read the file and convert it to base64
                const fileData = fs.readFileSync(ggbFilePath);
                const base64GgbFile = fileData.toString('base64');
                event.returnValue = { sender: "client", content:base64GgbFile, status:"success" }
            } 
            catch (error) {
                event.returnValue = { sender: "client", content: false , status:"error" }
            }     
        })





        /**
         * GET PDF from EXAM directory
         * @param filename if set the content of the file is returned
         */ 
        ipcMain.on('getpdf', (event, filename) => {   
            const workdir = path.join(config.workdirectory,"/")
            if (filename) { //return content of specific file
                let filepath = path.join(workdir,filename)
                let data = fs.readFileSync(filepath)
                event.returnValue = data
            }
        })


        /**
         * GET FILE-LIST from workdirectory
         * @param filename if set the content of the file is returned
         */ 
         ipcMain.on('getfiles', (event, filename) => {   
            const workdir = path.join(config.workdirectory,"/")

            if (filename) { //return content of specific file as string (html) to replace in editor)
                let filepath = path.join(workdir,filename)
                let data = fs.readFileSync(filepath, 'utf8')
                event.returnValue = data
            }
            else {  // return file list of exam directory
                let filelist =  fs.readdirSync(workdir, { withFileTypes: true })
                    .filter(dirent => dirent.isFile())
                    .map(dirent => dirent.name)
                    .filter( file => path.extname(file).toLowerCase() === ".pdf" || path.extname(file).toLowerCase() === ".bak" || path.extname(file).toLowerCase() === ".ggb")
                
                let files = []
                filelist.forEach( file => {
                    let modified = fs.statSync(   path.join(workdir,file)  ).mtime
                    let mod = modified.getTime()
                    if  (path.extname(file).toLowerCase() === ".pdf"){ files.push( {name: file, type: "pdf", mod: mod})   }         //pdf
                    else if  (path.extname(file).toLowerCase() === ".bak"){ files.push( {name: file, type: "bak", mod: mod})   }   // editor backup
                    else if  (path.extname(file).toLowerCase() === ".ggb"){ files.push( {name: file, type: "ggb", mod: mod})   }  // gogebra
                    
                })
                this.multicastClient.clientinfo.numberOfFiles = filelist.length
                event.returnValue = files
            }
        })

         /**
         * Append PrintRequest to clientinfo  
         */ 
        ipcMain.on('sendPrintRequest', (event) => {   
            this.multicastClient.clientinfo.printrequest = true  //set this to false after the request left the client to prevent double triggering
            event.returnValue = true
        })




        ipcMain.on('checkword', async (event, selectedWord) => {
            console.log(`Received selected text: ${selectedWord}`);
            const suggestions = await this.WindowHandler.nodehun.suggest(selectedWord)
            //console.log(suggestions)
            event.returnValue = {  suggestions : suggestions }   
        });
    
        ipcMain.on('checktext', async (event, selectedText) => {
            const words = selectedText.split(/[^a-zA-ZäöüÄÖÜßéèêëôûüÔÛÜáíóúñÁÍÓÚÑàèéìòùÀÈÉÌÒÙçÇ]+/);
            const misspelledWords = [];
            for (const word of words) {
                const correct = await this.WindowHandler.nodehun.spell(word);
                if (!correct) {
                    misspelledWords.push(word);
                   // console.log(word)
                }
            }
            event.returnValue = { misspelledWords };
        });

        ipcMain.on('add-word-to-dictionary', (event, word) => {
            console.log("adding word to dictionary")
            this.WindowHandler.nodehun.add(word)
        });


    }
}
 
export default new IpcHandler()
