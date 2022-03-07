import express from "express"
import cors from 'cors'
const app = express()
import fileUpload from "express-fileupload";
import {clientRouter} from './routes/clientroutes.js' 
import config from './config.js';
import fsExtra from "fs-extra"
import path from 'path'
import bodyParser from 'body-parser';





app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





// clean public directory
const __dirname = path.resolve();
const publicdirectory = path.join(__dirname, config.publicdirectory);
fsExtra.emptyDirSync(publicdirectory)


app.use(cors())
app.use(express.json())
app.use(express.static("public"));
app.use('/client', clientRouter)
app.use(fileUpload())  //When you upload a file, the file will be accessible from req.files





app.listen(3000, () => {  
    console.log('Express listening on: http://localhost:3000')
})


export default app;

