import express from "express"
import cors from 'cors'
import fileUpload from "express-fileupload";
import {serverRouter} from './routes/serverroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'


const api = express()

// clean public directory
const __dirname = path.resolve();
const publicdirectory = path.join(__dirname, config.publicdirectory);
fsExtra.emptyDirSync(publicdirectory)

api.use(fileUpload())  //When you upload a file, the file will be accessible from req.files (init before routes)
api.use(cors())
api.use(express.json())
api.use(express.static("public"));
api.use(express.urlencoded({extended: true}));
api.use('/server', serverRouter)


config.hostip = "10.10.10.10"


api.listen(3000, () => {  
    console.log('Express listening on: http://localhost:3000')
})


export default api;

