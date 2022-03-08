import express from "express"
import cors from 'cors'

import fileUpload from "express-fileupload";
import {clientRouter} from './routes/clientroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'
import ip from 'ip'
import multicastClient from './classes/multicastclient.js'


multicastClient.init()

config.hostip = ip.address()  // config is exposed to electron-vue app via context bridge so we can use it in the frontend
if (typeof window !== 'undefined'){
    if (window.process.type == "renderer") config.electron = true
}

// clean public directory
const __dirname = path.resolve();
const publicdirectory = path.join(__dirname, config.publicdirectory);
fsExtra.emptyDirSync(publicdirectory)


const api = express()
api.use(fileUpload())  //When you upload a file, the file will be accessible from req.files (init before routes)
api.use(cors())
api.use(express.json())
api.use(express.static("public"));
api.use(express.urlencoded({extended: true}));
api.use('/client', clientRouter)





api.listen(config.clientApiPort, () => {  
    console.log(`Express listening on: http://${config.hostip}:${config.clientApiPort}`)
    console.log("Vite-vue on Port 3001")
})


export default api;

