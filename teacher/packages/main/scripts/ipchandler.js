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
                clonedObj[key] = cloneObjectExcludingExamServerList(obj[key]);
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