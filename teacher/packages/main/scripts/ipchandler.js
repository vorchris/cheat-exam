/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2023 Thomas Michael Weissel
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
import {  ipcMain } from 'electron'
import checkDiskSpace from 'check-disk-space'
import {join} from 'path'

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
            const clonedObject = this.copyConfig(config);  // we cant just copy the config because it contains examServerList which contains confic (circular structure)
            event.returnValue = clonedObject
        })  

        ipcMain.on('resetToken', (event) => {  
            config.accessToken = false
            const clonedObject = this.copyConfig(config);  // we cant just copy the config because it contains examServerList which contains confic (circular structure)
            event.returnValue = clonedObject
        })  

        ipcMain.on('getCurrentWorkdir', (event) => {   event.returnValue = config.workdirectory  })

        ipcMain.on('checkDiscspace', async (event) => {   
            let freespace = await checkDiskSpace(config.workdirectory).then((diskSpace) => {
                let free = Math.round(diskSpace.free/1024/1024/1024 * 1000)/1000
                return free

            })
            event.returnValue = freespace
        })

        ipcMain.on('setworkdir', async (event, arg) => {
            const result = await dialog.showOpenDialog( win, {
            properties: ['openDirectory']
            })
            if (!result.canceled){
                console.log('directories selected', result.filePaths)
                let message = ""
                try {
                    let testdir = join(result.filePaths[0]   , config.examdirectory)
                    if (!fs.existsSync(testdir)){fs.mkdirSync(testdir)}
                    message = "success"
                    config.workdirectory = testdir
                }
                catch (e){
                    message = "error"
                    console.log(e)
                }
                event.returnValue = {workdir: config.workdirectory, message : message}
            }
            else {
                event.returnValue = {workdir: config.workdirectory, message : 'canceled'}
            }
        })


        /**
         * returns old exam folders in workdirectory
         */
        ipcMain.on('scanWorkdir', async (event, arg) => {
            let examfolders = []
            if (fs.existsSync(config.workdirectory)){
                    examfolders = fs.readdirSync(config.workdirectory, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            }
            event.returnValue = examfolders
        })


        /**
         * deletes old exam folder in workdirectory
         */
        ipcMain.on('delPrevious', async (event, arg) => {
            let examdir = join( config.workdirectory, arg)
            if (fs.statSync(examdir).isDirectory()){
                fs.rmSync(examdir, { recursive: true, force: true });
            }   
            event.returnValue = examdir
        })



        /**
         * Downloads the files for a specific student to his workdirectory (abgabe)
         */
        ipcMain.on('storeOnedriveFiles', async (event, args) => { 
            console.log("downloading onedrive files...")  
            const studentName = args.studentName
            const accessToken = args.accessToken
            const fileName = args.fileName
            const fileID = args.fileID
            const servername = args.servername

            // create user abgabe directory
            let studentdirectory =  join(config.workdirectory, servername ,studentName)
            if (!fs.existsSync(studentdirectory)){ fs.mkdirSync(studentdirectory, { recursive: true });  }

            // create archive directory
            let time = new Date(new Date().getTime()).toLocaleTimeString();  //convert to locale string otherwise the foldernames will be created in UTC
            let tstring = String(time).replace(/:/g, "_");
            let studentarchivedir = join(studentdirectory, tstring)
            if (!fs.existsSync(studentarchivedir)){ fs.mkdirSync(studentarchivedir, { recursive: true }); }

            const fileResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content`, {
                headers: {'Authorization': `Bearer ${accessToken}`,  },
            });
            const fileBuffer = await fileResponse.arrayBuffer();
            fs.writeFileSync(join(studentarchivedir, fileName), Buffer.from(fileBuffer));

            const pdfFileResponse = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content?format=pdf`, {
                headers: {'Authorization': `Bearer ${accessToken}`,  },
            });

            if (pdfFileResponse.ok) {
                const pdfFileBuffer = await pdfFileResponse.arrayBuffer();
                const pdfFilePath = join(studentarchivedir, `${fileName}.pdf`);
                fs.writeFileSync(pdfFilePath, Buffer.from(pdfFileBuffer));
                console.log(`Downloaded ${fileName} and ${fileName}.pdf`);
            }
            else {
                console.log("there was a problem downloading the files as pdf")
            }
            
        })



    }


    copyConfig(obj) {
        if (obj === null || typeof obj !== 'object') {
        return obj;
        }
        const clonedObj = Array.isArray(obj) ? [] : {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                if (key !== 'examServerList') {
                    if (typeof obj[key] === 'object') {
                        clonedObj[key] = copyConfig(obj[key]);
                    } else {
                        clonedObj[key] = obj[key];
                    }
                }
            }
        }
        return clonedObj;
    }
}

export default new IpcHandler()