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
 * Sends file(s) from the server to specified receipients 
 * @param who who should we send the file(s) to? all students, specific student, server (get)
 * ATTENTION: everybody could potentially send a post request to this api route and send files to students
 * ATTENTION: the server is accesible over LAN - everybody is able to connect to a running exams UI and take over
 * solutions: csrf token created on first start, sent to the UI (drawback: if you close the browser and open the view again you generate a new token and cant see your running exam anymore)
 *            define a password when you start the server - log in to your exam dashboard with password
 */
router.post("/send/:who", (req, res) => {  
    if (!req.files) { return res.send({status:"No files were uploaded."});  }
    const who = req.params.who
    const form = new FormData()
    
    console.log(req.files.file)

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






    if (who == "all"){
        
        if ( multiCastserver.studentList.length <= 0  ) { res.json({ status: "no clients connected"  }) }
        else {  
        console.log("Sending POST Form Data to Clients")
        multiCastserver.studentList.forEach( (student) => {
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
 * Stores file(s) to the receipients workdirectory (either files coming from the server or finished exams coming from students)
 * @param token the students token - this has to be valid (coming from the examserver you registered or from a registered user) in order to process the request
 */
router.post('/receive/:receiver/:token', async (req, res, next) => {  
    const token = req.params.token
    const receiver = req.params.receiver

    if ( !checkToken(token, receiver) ) { res.json({ status: "token is not valid" }) }
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
 * ZIPs and sends all files from a students workdirectory to the registered exam server
 * @param token the students token (needed to accept this "abgabe" request)
 */
router.get('/abgabe/send/:token', async (req, res, next) => {  
    const token = req.params.token
    const serverip = multiCastclient.clientinfo.serverip  //this is set if you are registered on a server

    if ( !checkToken(token, "client") ) { res.json({ status: "token is not valid" }); return }
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
        fetch(`http://${serverip}:3000/filetransfer/receive/server/${multiCastclient.clientinfo.token}`, { method: 'POST', body: form })
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
function checkToken(token, receiver){
    if (receiver === "server"){  //check if the student that wants to send a file is registered on this server
        let tokenexists = false
        multiCastserver.studentList.forEach( (student) => {
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
