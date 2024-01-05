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



import fs from 'fs'
import i18n from '../../renderer/src/locales/locales.js'
const { t } = i18n.global
import {  ipcMain, dialog, BrowserWindow } from 'electron'
import checkDiskSpace from 'check-disk-space'
import {join} from 'path'
import log from 'electron-log/main';

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

        ipcMain.on('openmsauth', (event) => { this.WindowHandler.createMsauthWindow();  event.returnValue = true })  

        ipcMain.on('getconfig', (event) => {  
            event.returnValue = this.copyConfig(config); 
        })  

        ipcMain.handle('getconfigasync', (event) => {  
            return this.copyConfig(config)
        })  

        ipcMain.handle('resetToken', (event) => {  
            config.accessToken = false
            return this.copyConfig(config);  // we cant just copy the config because it contains examServerList which contains confic (circular structure)
        })  

        ipcMain.on('getCurrentWorkdir', (event) => {   event.returnValue = config.workdirectory  })

        ipcMain.handle('checkDiscspace', async () => {
            let diskSpace = await checkDiskSpace(config.workdirectory);
            let free = Math.round(diskSpace.free / 1024 / 1024 / 1024 * 1000) / 1000;
            return free;
        });

        ipcMain.handle('setworkdir', async (event, arg) => {
            const result = await dialog.showOpenDialog( this.WindowHandler.mainwindow, { properties: ['openDirectory']  })
            if (!result.canceled){
                log.info('directories selected', result.filePaths)
                let message = ""
                try {
                    let testdir = join(result.filePaths[0]   , config.examdirectory)
                    if (!fs.existsSync(testdir)){fs.mkdirSync(testdir)}
                    message = "success"
                    config.workdirectory = testdir
                    log.info("setworkdir:", config)
                }
                catch (e){
                    message = "error"
                    log.error(e)
                }
                return {workdir: config.workdirectory, message : message}
            }
            else {
                return {workdir: config.workdirectory, message : 'canceled'}
            }
        })


        ipcMain.on('setPreviousWorkdir', async (event, workdir) => {
            if (workdir){
                log.info('previous directory selected', workdir)
                let message = ""
                try {
                    if (!fs.existsSync(workdir)){fs.mkdirSync(workdir)}
                    message = "success"
                    config.workdirectory = workdir
                }
                catch (e){
                    message = "error"
                    log.error(e)
                }
                event.returnValue = {workdir: config.workdirectory, message : message}
            }
            else {  event.returnValue = {workdir: config.workdirectory, message : 'canceled'} }
        })


        /**
         * returns old exam folders in workdirectory
         */
        ipcMain.handle('scanWorkdir', async (event, arg) => {
            let examfolders = []
            if (fs.existsSync(config.workdirectory)){
                    examfolders = fs.readdirSync(config.workdirectory, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            }
            return examfolders
        })


        /**
         * deletes old exam folder in workdirectory
         */
        ipcMain.handle('delPrevious', async (event, arg) => {
            let examdir = join( config.workdirectory, arg)
            if (fs.statSync(examdir).isDirectory()){
                try {
                    fs.rmSync(examdir, { recursive: true, force: true });
                }
                catch (e) {log.error(e)}
            }   
            return examdir
        })


        /**
         * print pdf in new browserwindow process detached from the current exam view
         */
        ipcMain.handle('printpdf', async (event, pdfurl) => {
            console.log(pdfurl)
            let win = new BrowserWindow({ show: false });

            win.loadFile(pdfurl).then(() => {
                    win.webContents.print({}, (success, failureReason) => {
                        if (success) { return true }
                        else { log.error("ipchandler:", failureReason) }
                    });
                }).catch( (err) => {
                    log.error("ipchandler: (catch)", err)
                    return false
                });  
        })




        /**
         * Downloads the files for a specific student to his workdirectory (abgabe)
         */
        ipcMain.on('storeOnedriveFiles', async (event, args) => { 
            log.info("downloading onedrive files...")  
            const studentName = args.studentName
            const accessToken = args.accessToken
            const fileName = args.fileName
            const fileID = args.fileID
            const servername = args.servername

            // create user abgabe directory  // create archive directory
            let studentdirectory =  join(config.workdirectory, servername ,studentName)
            let time = new Date(new Date().getTime()).toLocaleTimeString();  //convert to locale string otherwise the foldernames will be created in UTC
            let tstring = String(time).replace(/:/g, "_");
            let studentarchivedir = join(studentdirectory, tstring)
            
            try {
                if (!fs.existsSync(studentdirectory)) { fs.mkdirSync(studentdirectory, { recursive: true });  }
                if (!fs.existsSync(studentarchivedir)){ fs.mkdirSync(studentarchivedir, { recursive: true }); }
            } catch (e) {log.error(e)}
         

            const fileResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content`, {
                headers: {'Authorization': `Bearer ${accessToken}`,  },
            }).catch( err => {log.error(err)});

            try {
                const fileBuffer = await fileResponse.arrayBuffer();
                fs.writeFileSync(join(studentarchivedir, fileName), Buffer.from(fileBuffer));
            } catch (e) {log.error(e)}

            const pdfFileResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content?format=pdf`, {
                headers: {'Authorization': `Bearer ${accessToken}`,  },
            }).catch( err => {log.error(err)});

            if (pdfFileResponse.ok) {
                const pdfFileBuffer = await pdfFileResponse.arrayBuffer();
                const pdfFilePath = join(studentarchivedir, `${fileName}.pdf`);
                try {
                    fs.writeFileSync(pdfFilePath, Buffer.from(pdfFileBuffer));
                    log.info(`Downloaded ${fileName} and ${fileName}.pdf`);
                } catch (e) {log.error(e)}  
            }
            else {
                log.error("there was a problem downloading the files as pdf")
            }
            
        })



    }


    copyConfig(conf) {
        let configCopy = {
            workdirectory: conf.workdirectory,
            tempdirectory: conf.tempdirectory,
            examdirectory: conf.examdirectory,
            serverApiPort: conf.serverApiPort,
            multicastClientPort: conf.multicastClientPort,
            multicastServerClientPort: conf.multicastServerClientPort,
            multicastServerAdrr: conf.multicastServerAdrr,
            hostip: conf.hostip,
            gateway: conf.gateway,
            accessToken: conf.accessToken,
            version: conf.version,
            info: conf.info,
            buildforWEB: conf.buildforWEB
          };
        return configCopy
    }
}

export default new IpcHandler()
