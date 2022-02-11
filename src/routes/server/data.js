
const express = require('express')
const router = express.Router()

const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data')
const config = require('../../config')
const archiver = require('archiver')
const fs = require('fs') 



/**
 * Sends MANUALLY SELECTED file(s) from the SERVER to specified CLIENTS (no single client supported right noch FIXME)
 * @param destination who should we send the file(s) to? all students, specific student, server (get)
 */
 router.post("/send/:destination", (req, res) => { 
    const destination = req.params.destination
    const form = new FormData()
    const servername = req.body.servername
    const mcServer = config.examServerList[servername]

    
    if (!req.body.csrfservertoken === mcServer.serverinfo.token) { return res.send({status:"Access denied"})  }  // csrf check
    if (!req.files) { return res.send({status:"No files were uploaded."});  }
 
    
    if (Array.isArray(req.files.file)){  //multiple files
        console.log("sending multiple files")
        req.files.file.forEach( (file, index) => {
            form.append(index, file.data, {
                contentType: file.mimetype,
                filename: file.name,
            });
        });
    }
    else {
        let file = req.files.file
        form.append(file.name, file.data, {
            contentType: file.mimetype,
            filename: file.name,
        });
    }

    if (destination == "all"){
        if ( mcServer.studentList.length <= 0  ) { res.json({ status: "no clients connected"  }) }
        else {  
        console.log("Sending POST Form Data to Clients")
        mcServer.studentList.forEach( (student) => {
            fetch(`http://${student.clientip}:3000/client/data/receive/client/${student.token}`, { method: 'POST', body: form })
            .then( response => response.json() )
            .then( async (data) => {
                res.json(data) 
            });
        });
        }
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
        for (const [key, file] of Object.entries( req.files)) {
            let absoluteFilepath = path.join(config.workdirectory, file.name);
            file.mv(absoluteFilepath, (err) => {  
                if (err) { errors++; return {status: "client couldn't store file"} }
                return {status: "success"}
            });
        }
        res.json({ status: "Files received", errors: errors, clienttoken: token  })
    }
})




module.exports = router



/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
 function checkToken(token, mcserver){
    
        let tokenexists = false
        console.log("checking if student is already registered on this server")
        mcserver.studentList.forEach( (student) => {
            console.log(student)
            if (token === student.token) {
                tokenexists = true
            }
        });
        return tokenexists
  
  }