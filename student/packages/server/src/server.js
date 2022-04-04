import express from "express"
import cors from 'cors'
import fileUpload from "express-fileupload";
import {clientRouter} from './routes/clientroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'
import ip from 'ip'
import multicastClient from './classes/multicastclient.js'
import getPath from 'platform-folders';
import fs from 'fs'

config.home = getPath('home'); 
config.desktop = getPath('desktop');
config.workdirectory = path.join(config.desktop, config.examdirectory)
config.tempdirectory = path.join(config.desktop, 'tmp')
if (!fs.existsSync(config.workdirectory)){ fs.mkdirSync(config.workdirectory); }
if (!fs.existsSync(config.tempdirectory)){ fs.mkdirSync(config.tempdirectory); }


multicastClient.init()

config.hostip = ip.address()  // config is exposed to electron-vue app via context bridge so we can use it in the frontend
if (typeof window !== 'undefined'){
    if (window.process.type == "renderer") config.electron = true
}

// clean temp directory
fsExtra.emptyDirSync(config.tempdirectory)



const api = express()
api.use(fileUpload())  //When you upload a file, the file will be accessible from req.files (init before routes)
api.use(cors())
api.use(express.json())
api.use(express.static(config.tempdirectory));
api.use(express.urlencoded({extended: true}));
api.use('/client', clientRouter)

api.listen(config.clientApiPort, () => {  
    console.log(`Express listening on http://${config.hostip}:${config.clientApiPort}`)
    console.log(`Vite-vue listening on http://${config.hostip}:${config.clientVitePort}`)
})


export default api;

