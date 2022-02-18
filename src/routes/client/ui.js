
const express = require('express')
const router = express.Router()
const config = require('../../config')
const multiCastclient = require('../../classes/multicastclient')


router.get('/exams/', function (req, res, next) {
    let remoterequest = false;
    if (!requestSourceAllowed(req, res)){ remoterequest = true; }
    res.render('runningexams', { title: 'Exam Student', apiport: config.port, remoterequest: remoterequest })
})

router.get('/exammode/:token', function (req, res, next) {
    let remoterequest = false;
    if (!requestSourceAllowed(req, res)){ remoterequest = true; return res.json( {status: "denied"}  )}
    let token = req.params.token

    let servername = multiCastclient.clientinfo.servername
    let serverip = multiCastclient.clientinfo.serverip
    
  
 


    return res.render('exam', { title: 'Exam', servername: servername, serverip: serverip, token: token})

    //render exam mode page - servername, serverip, studenttoken is needed in order to send api requests from there
    if ( checkToken(token) ) {
      res.render('exam', { title: 'Exam', servername: servername, serverip: serverip, token: token })
    }
    else {
      res.json({ sender: "client", tokenisvalid: false })
    }
})



module.exports = router


//do not allow requests from external hosts
function requestSourceAllowed(req,res){
    if (req.ip !== "::1" && req.ip !== "127.0.0.1"){ 
      console.log("Blocked request from remote Host"); 
      return false
    }   
    return true
  }


/**
 * Checks if the token is valid and the api is allowed to process the request
 */ 
 function checkToken(token){
  if (token === multiCastclient.clientinfo.token) {
    return true
  }
  return false
}