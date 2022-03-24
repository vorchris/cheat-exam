import express from "express"
import cors from 'cors'
import fileUpload from "express-fileupload";
import {serverRouter} from './routes/serverroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'
import rateLimit  from 'express-rate-limit'  //simple ddos protection
import ip from 'ip'
import multicastClient from './classes/multicastclient.js'


multicastClient.init()

config.hostip = ip.address()  // config is exposed to electron-vue app via context bridge so we can use it in the frontend
if (typeof window !== 'undefined'){
    if (window.process.type == "renderer") config.electron = true
}

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 400, // Limit each IP to 400 requests per `window` 
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })


// clean public directory
const __dirname = path.resolve();
const publicdirectory = path.join(__dirname, config.publicdirectory);
fsExtra.emptyDirSync(publicdirectory)


// init express API
const api = express()

api.use(fileUpload())  //When you upload a file, the file will be accessible from req.files (init before routes)
api.use(cors())
api.use(express.json())
api.use(express.static("public"));
api.use(express.urlencoded({extended: true}));
api.use(limiter)
api.use('/server', serverRouter)





api.listen(config.serverApiPort, () => {  
    console.log(`Express listening on http://${config.hostip}:${config.serverApiPort}`)
    console.log(`Vite-vue listening on http://${config.hostip}:${config.serverVitePort}`)
})




export default api;

