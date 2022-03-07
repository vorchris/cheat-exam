import express from "express"
import cors from 'cors'
const app = express()
import fileUpload from "express-fileupload";
import {clientRouter} from './routes/clientroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'
import ip from 'ip'
import multicastClient from './classes/multicastclient.js'


multicastClient.init()

config.hostip = ip.address()  // config is exposed to electron-vue app via context bridge so we can use it in the frontend


// clean public directory
const __dirname = path.resolve();
const publicdirectory = path.join(__dirname, config.publicdirectory);
fsExtra.emptyDirSync(publicdirectory)

app.use(fileUpload())  //When you upload a file, the file will be accessible from req.files (init before routes)
app.use(cors())
app.use(express.json())
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use('/client', clientRouter)





app.listen(config.clientApiPort, () => {  
    console.log(`Express listening on: http://${config.hostip}:${config.clientApiPort}`)
    console.log("Vite-vue on Port 3001")
})


export default app;

