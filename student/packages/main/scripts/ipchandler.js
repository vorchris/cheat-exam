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
    init (mc, config, wh) {
        this.multicastClient = mc
        this.config = config
        this.WindowHandler = wh  

        /**
         * Registers virtualized status
         */ 
        ipcMain.on('virtualized', () => {  this.multicastClient.clientinfo.virtualized = true; } )

        /**
         * Returns the main config object
         */ 
        ipcMain.on('getconfig', (event) => {   event.returnValue = this.config   })


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
        
            axios.get(`https://${serverip}:${this.config.serverApiPort}/server/control/registerclient/${servername}/${pin}/${clientname}/${clientip}/${version}`)
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


        ipcMain.on('storeHTML', (event, args) => {   
            const htmlContent = args.editorcontent
            const currentfilename = args.filename
            const htmlfilename = currentfilename ? currentfilename : this.multicastClient.clientinfo.name +".html"
            const htmlfile = path.join(this.config.workdirectory, htmlfilename);

            if (htmlContent) { 
                console.log("saving students work to disk...")
                fs.writeFile(htmlfile, htmlContent, (err) => {if (err) console.log(err); }); 
                event.returnValue = { sender: "client", message:t("data.filestored") , status:"success" }
            }
        })


    }
}
 
export default new IpcHandler()
