const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const multiCastclient = require('../classes/multicastclient.js')

const path = require('path')
const fetch = require('node-fetch')
const FormData = require('form-data');






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




  function checkToken(token){
    if (token === multiCastclient.clientinfo.token) {
      return true
    }
    return false
  }
  

  module.exports = router
