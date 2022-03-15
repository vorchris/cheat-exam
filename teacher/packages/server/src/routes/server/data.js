
import { Router } from 'express'
const router = Router()
import { join } from 'path'
import FormData from 'form-data'
import config from '../../config.js'

import fs from 'fs' 
import  extract from 'extract-zip'
import axios from 'axios'


/**
 * Sends MANUALLY SELECTED file(s) from the SERVER to specified CLIENTS (no single client supported right noch FIXME)
 * @param destination who should we send the file(s) to? all students, specific student, server (get)
 */
 router.post("/send/:destination", (req, res) => { 

    const destination = req.params.destination
    const form = new FormData()
    const servername = req.body.servername
    const mcServer = config.examServerList[servername]
        
    if (!req.body.servertoken === mcServer.serverinfo.servertoken) { return res.send({status:"Access denied"})  }  // csrf check
    if (!req.files) { return res.send({sender: "server", message:"No files were uploaded.", status:"error"});  }
    if ( mcServer.studentList.length <= 0  ) { res.json({ sender: "server", message: "no clients connected", status:"error"  }) }

    if (config.electron){  //electron wants to send BLOBs instead of array buffers via formData
        if (Array.isArray(req.files.files)){  //multiple files
            console.log("preparing multiple files for electron transfer")
            req.files.files.forEach( (file, index) => {
                let blob =  new Blob( [ new Uint8Array(file.data).buffer], { type: file.mimetype })
                form.append(file.name, blob, file.name );
            });
        }
        else {
            console.log("preparing file for electron transfer")
            let file = req.files.files
            let blob =  new Blob( [ new Uint8Array(file.data).buffer.alloc], { type: file.mimetype })
            form.append(file.name, blob, file.name);
        }
    }
    else {
        if (Array.isArray(req.files.files)){  //multiple files
            console.log("preparing multiple files")
            req.files.files.forEach( (file, index) => {
                form.append(index, file.data, {
                    contentType: file.mimetype,
                    filename: file.name,
                });
            });
        }
        else {
            console.log("preparing file")
            let file = req.files.files
            form.append(file.name, file.data, {
                contentType: file.mimetype,
                filename: file.name,
            });
        }
    }

    if (destination == "all"){
        console.log("Sending POST Form Data to Clients")
        mcServer.studentList.forEach( (student) => {
            axios({
                method: "post", 
                url: `http://${student.clientip}:${config.clientApiPort}/client/data/receive/${student.token}`, 
                data: form, 
                headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }  
              }).catch( err =>{
                  console.log(`Server Data API: ${err}`)
              })
        });
        res.send({sender: "server", message:"File(s) sent", status:"success"});
    }
});




/**
 * Stores file(s) to the workdirectory (files coming FROM CLIENTS (finished EXAMS) )
 * @param token the students token - this has to be valid (coming from a registered user) 
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 * TODO: if receiver is "server" it should unzip and store with files with timestamp and username
 */
 router.post('/receive/server/:servername/:token', async (req, res, next) => {  
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
  


    if ( !checkToken(token, mcServer ) ) { res.json({ status: "token is not valid" }) }
    else {
        console.log("Receiving File(s)...")
        let errors = 0
        
        if (req.files){
            for (const [key, file] of Object.entries( req.files)) {
                //console.log(file)
                let absoluteFilepath = join(config.workdirectory, file.name);
                if (file.name.includes(".zip")){  //ABGABE as ZIP
                    let time = new Date(new Date().getTime()).toISOString().substr(11, 8);
                    let studentname = ""
                    // get username
                    mcServer.studentList.forEach( (student) => {
                        if (token === student.token) {
                            studentname = student.clientname
                            console.log(student)
                        }
                    });
                    
                    // create user abgabe directory
                    let studentdirectory =  join(config.workdirectory, studentname)
                    if (!fs.existsSync(studentdirectory)){ fs.mkdirSync(studentdirectory);  }

                    // create archive directory
                    let studentarchivedir = join(studentdirectory, String(time))
                    if (!fs.existsSync(studentarchivedir)){ fs.mkdirSync(studentarchivedir); }

                    // extract zip file to archive
                    file.mv(absoluteFilepath, (err) => {  
                        if (err) { errors++; return {status: "client couldn't store file"} }
                        extract(absoluteFilepath, { dir: studentarchivedir }).then( () => {
                            fs.unlink(absoluteFilepath, (err) => {
                                if (err) console.log(err);
                                return
                            });
                        }).catch( err => console.log(err))
                    });
                }

                // this is another file (most likely a screenshot as we do not yet transfer other files)
                file.mv(absoluteFilepath, (err) => {  
                    if (err) { errors++; return {status: "client couldn't store file"} }
                    return {status: "success"}
                });

            }
            res.json({ status: "Files received", errors: errors, clienttoken: token  })
        }
        else {
            res.json({ status: "NO Files received", errors: errors, clienttoken: token  })
        }


    }
})




export default router



/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
 function checkToken(token, mcserver){
    
        let tokenexists = false
        console.log("checking if student is already registered on this server")
        mcserver.studentList.forEach( (student) => {
            if (token === student.token) {
                tokenexists = true
            }
        });
        return tokenexists
  
  }