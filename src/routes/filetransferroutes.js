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
 * Sends file(s) to specified receipients 
 * @param who who should we send the file(s) to? all students, specific student, server (get)
 */
router.post("/send/:who", (req, res) => {
    if (!req.files) { return res.send({status:"No files were uploaded."});  }
    const who = req.params.who
    const form = new FormData()
    
    req.files.file.forEach( (file,index)=> {
          form.append(index, file.data, {
            contentType: file.mimetype,
            filename: file.name,
        });
     });

    if (who == "all"){
        if ( multiCastserver.studentList.length <= 0  ) { res.json({ status: "no clients connected"  }) }
        else {  
        console.log("Sending POST Form Data to Clients")
        multiCastserver.studentList.forEach( (student) => {
            fetch(`http://${student.clientip}:3000/filetransfer/receive/${student.csrftoken}`, { method: 'POST', body: form })
            .then( response => response.json() )
            .then( async (data) => {
                res.json(data) 
            });
        });
        }
    }
});



/**
 * Stores file(s) to the receipients inbox
 * @param token the students token - this has to be valid (coming from the registered server) in order to process the request
 * TODO: what if the server wants to receive the students work ? tokencheck is still a good idea but differen - it should check if the token is registered
 */
router.post('/receive/:token', async (req, res, next) => {  //TODO: get md5 hash + do hashconfirmation 
    const token = req.params.token

    if ( !checkToken(token) ) { res.json({ status: "token is not valid" }) }
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



router.get('/abgabe/request/:who', async (req, res, next) => {  //TODO: get md5 hash + do hashconfirmation 
    const who = req.params.who
    if (who == "all"){
        if ( multiCastserver.studentList.length <= 0  ) { res.json({ status: "no clients connected"  }) }
        else {  
        console.log("Requesting Filetransfer from ALL Clients")
        multiCastserver.studentList.forEach( (student) => {
            fetch(`http://${student.clientip}:3000/filetransfer/abgabe/send/${student.csrftoken}`)
            .then( response => response.json() )
            .then( async (data) => {
                res.json(data) 
            });
        });
        }
    }
})



router.get('/abgabe/send/:token', async (req, res, next) => {  //TODO: get md5 hash + do hashconfirmation 
    const token = req.params.token
    const serverip = multiCastclient.clientinfo.server  //this is set if you are registered on a server

    if ( !checkToken(token) ) { res.json({ status: "token is not valid" }) }
    else {
        console.log(`token checked - preparing file to send to server: ${serverip}`)

        //zip config.work directory
        let zipfilepath = path.join(config.tempdirectory,multiCastclient.clientinfo.name.concat('.zip'));
        await zipDirectory(config.workdirectory, zipfilepath)

        //append file data to form

        //send to server
        res.json({ status: "file sent" })
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
 * TODO: tokencheck for server Attention: no all api requests check tokens atm!
 */
function checkToken(token){
    if (token === multiCastclient.clientinfo.token) {
        return true
    }
    return false
}
  

  module.exports = router
