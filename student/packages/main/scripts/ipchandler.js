import path from 'path'
import fs from 'fs'
import ip from 'ip'
import axios from 'axios'
import i18n from '../../renderer/src/locales/locales.js'
const { t } = i18n.global
import {  ipcMain } from 'electron'

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
         * Stores the ExamWindow content as PDF
         */ 
        ipcMain.on('printpdf', (event, args) => { 
            if (this.WindowHandler.examwindow){
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

                const pdffilepath = path.join(this.config.workdirectory, args.filename);
                this.WindowHandler.examwindow.webContents.printToPDF(options).then(data => {
                    fs.writeFile(pdffilepath, data, function (err) { if (err) {console.log(err); }  } );
                }).catch(error => { console.log(error)});
            }
        })


        /**
         * Returns all found Servers and the information about this client
         */ 
        ipcMain.on('getinfo', (event) => {   
            event.returnValue = {   
                serverlist: this.multicastClient.examServerList,
                clientinfo: this.multicastClient.clientinfo
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
            const version = this.config.version

            if (this.multicastClient.clientinfo.token){
                event.returnValue = { sender: "client", message: t("control.alreadyregistered"), status:"error" }
            }
        
            axios({ method:'get', 
                    url:`https://${serverip}:${this.config.serverApiPort}/server/control/registerclient/${servername}/${pin}/${clientname}/${clientip}/${version}`,
                    timeout: 10000})
            .then(response => {
                if (response.data && response.data.status == "success") { // registration successfull otherwise data would be "false"
                    this.multicastClient.clientinfo.name = clientname
                    this.multicastClient.clientinfo.serverip = serverip
                    this.multicastClient.clientinfo.servername = servername
                    this.multicastClient.clientinfo.ip = clientip
                    this.multicastClient.clientinfo.token = response.data.token // we need to store the client token in order to check against it before processing critical api calls
                    this.multicastClient.clientinfo.focus = true
                }
                event.returnValue = response.data
            
            }).catch(err => {
                //we return the servers error message to the ui
                console.log(err.message)
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
                    .filter( file => path.extname(file).toLowerCase() === ".pdf" || path.extname(file).toLowerCase() === ".bak" || path.extname(file).toLowerCase() === ".mtml")
                
                let files = []
                filelist.forEach( file => {
                    let modified = fs.statSync(   path.join(workdir,file)  ).mtime
                    let mod = modified.getTime()
                    if  (path.extname(file).toLowerCase() === ".pdf"){ files.push( {name: file, type: "pdf", mod: mod})   }
                    else if  (path.extname(file).toLowerCase() === ".bak"){ files.push( {name: file, type: "bak", mod: mod})   }
                    else if  (path.extname(file).toLowerCase() === ".mtml"){ files.push( {name: file, type: "mtml", mod: mod})   }  // imaginary multiple choice testformat from the future
                    
                })
                event.returnValue = files
            }
        })


    }
}
 
export default new IpcHandler()
