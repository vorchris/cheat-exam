import express from "express"
import cors from 'cors'
const app = express()
import fileUpload from "express-fileupload";
import {clientRouter} from './routes/clientroutes.js' 



async function createServer() {
    app.use(cors())
    app.use(express.json())
    app.use('/client', clientRouter)
    app.use(fileUpload())  //When you upload a file, the file will be accessible from req.files

    app.get('/', (req, res) => {
        res.json({
            message: 'this is the answer to everything - coming from express'
        });
    });
    return { app }
}




createServer().then(({ app }) =>
    app.listen(3000, () => {
     
      console.log('Express listening on: http://localhost:3000')
    })
);

export default app;

