const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const config = require('../config')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome'})
})

router.get('/student/', function (req, res, next) {
  let remoterequest = false;
  if (!requestSourceAllowed(req, res)){ remoterequest = true; }
  res.render('student', { title: 'Exam Student', apiport: config.port, remoterequest: remoterequest })
})

router.get('/startserver/', function (req, res, next) {
  res.render('startserver', { title: 'Exam Teacher' })
})

router.get('/serverlist/', function (req, res, next) {
  res.render('serverlist', { title: 'Exam Teacher' })
})



/**
 * ATTENTION: this should not be a GET request... use POST !
 * @param servername the name of the server you want to manage
 * @param password the password for this server.. what else
 */
router.all('/dashboard/:servername', function (req, res, next) {
  let servername = req.params.servername 
  let password = req.body.loginpassword

  const mcServer = config.examServerList[servername]

  if (mcServer) { // we could allow the creation of several exam servers ?

    if (mcServer.serverinfo.password === password) {
      console.log("Password OK!")
      res.render('dashboard', { 
        title: 'Exam Dashboard', 
        servername: mcServer.serverinfo.servername, 
        pin: mcServer.serverinfo.pin, 
        studentlist: mcServer.studentList,
        csrfservertoken: mcServer.serverinfo.token
      });
    }
    else {
      console.log("Wrong Password!")
      res.render('serverlist', { title: 'Exam Teacher' })
    }
    
  } 
  
  else {
    console.log("No Exam Server available")
    res.render('serverlist', { title: 'Exam Teacher' })
  }
})



//do not allow requests from external hosts
function requestSourceAllowed(req,res){
  if (req.ip !== "::1" && req.ip !== "127.0.0.1"){ 
    console.log("Blocked request from remote Host"); 
    return false
  }   
  return true
}

module.exports = router
