const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const multiCastclient = require('../classes/multicastclient.js')

const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data');
const config = require('../config')
const archiver = require('archiver');
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
            fetch(`http://${student.clientip}:3000/filetransfer/receive/client/${student.token}`, { method: 'POST', body: form })
            .then( response => response.json() )
            .then( async (data) => {
                res.json(data) 
            });
        });
        }
    }
});



/**
 * Stores file(s) to the workdirectory (files coming FROM the SERVER (Questions, tasks) or from CLIENTS (finished EXAMS) )
 * @param token the students token - this has to be valid (coming from the examserver you registered or from a registered user) 
 * in order to process the request - DO NOT STORE FILES COMING from anywhere.. always check if token belongs to a registered student (or server)
 * TODO: if receiver is "server" it should unzip and store with files with timestamp and username
 */
router.post('/receive/server/:servername/:token', async (req, res, next) => {  
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
  


    if ( !checkToken(token, "server", mcServer ) ) { res.json({ status: "token is not valid" }) }
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
        res.json({ status: "done", errors: errors, client: multiCastclient.clientinfo  })
    }
})





router.post('/receive/client/:token', async (req, res, next) => {  
    const token = req.params.token
   

        /// FIXME
    const servername = req.params.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object
  


    if ( !checkToken(token, "client") ) { res.json({ status: "token is not valid" }) }
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
        res.json({ status: "done", errors: errors, client: multiCastclient.clientinfo  })
    }
})





/**
 * ZIPs and sends all files from a CLIENTS workdirectory TO the registered exam SERVER
 * @param token the students token (needed to accept this "abgabe" request from the server)
 */
router.get('/abgabe/send/:token', async (req, res, next) => {     
    const token = req.params.token
    const serverip = multiCastclient.clientinfo.serverip  //this is set if you are registered on a server
    const servername = multiCastclient.clientinfo.servername
    const mcServer = config.examServerList[servername] // get the multicastserver object

    if ( !checkToken(token, "client", mcServer) ) { res.json({ status: "token is not valid" }); return }
    else {
        console.log(`token checked - preparing file to send to server: ${serverip}`)

        //zip config.work directory
        let zipfilename = multiCastclient.clientinfo.name.concat('.zip')
        let zipfilepath = path.join(config.tempdirectory, zipfilename);
        await zipDirectory(config.workdirectory, zipfilepath)

        //append file data to form
        const form = new FormData()
        form.append(zipfilename, fs.createReadStream(zipfilepath), {
            contentType: 'application/zip',
            filename: zipfilename,
        });

        //post to server  (send param token in order to authenticate - the server only accepts files from registered students)
        fetch(`http://${serverip}:3000/filetransfer/receive/server/${servername}/${token}`, { method: 'POST', body: form })
            .then( response => response.json() )
            .then( async (data) => {
                res.json(data)
            });
    }
})






/**
 * @param {String} sourceDir: /some/folder/to/compress
 * @param {String} outPath: /path/to/created.zip
 * @returns {Promise}
 */
function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = fs.createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}




/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
function checkToken(token, receiver, mcserver){
    if (receiver === "server"){  //check if the student that wants to send a file is registered on this server
        let tokenexists = false
        console.log("checking if student is already registered on this server")
        mcserver.studentList.forEach( (student) => {
            if (token === student.token) {
                tokenexists = true
            }
        });
        return tokenexists
    }
    else if (receiver === "client"){
        if (token === multiCastclient.clientinfo.token) {
            return true
        }
        return false
    }
}
  

  module.exports = router
