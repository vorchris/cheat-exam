const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const multiCastclient = require('../classes/multicastclient.js')

const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data');




/**
 * Sends file(s) to specified receipients 
 * @param who who should we send the file(s) to? all students, specific student, server (get)
 */
router.post("/send/:who", (req, res) => {
    if (!req.files) { return res.send({status:"No files were uploaded."});  }
    //const file = req.files.file
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
            let absoluteFilepath = path.join('public/files/inbox', file.name);
            file.mv(absoluteFilepath, (err) => {  
                if (err) { errors++; return {status: "client couldn't store file"} }
                return {status: "success"}
            });
        }
        res.json({ status: "done", errors: errors, client: multiCastclient.clientinfo  })
    }
// 
  })


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
