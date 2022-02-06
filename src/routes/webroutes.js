const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const config = require('../config')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome'})
})

router.get('/student/', function (req, res, next) {
  res.render('student', { title: 'Exam Student', apiport: config.port })
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
  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    let serverinfo = config.examServerList.find(x => x.serverinfo.servername === servername).serverinfo; // find the server with the specified servername and get the serverinfo object
    if (serverinfo.password === password) {
      console.log("Password OK!")
      res.render('dashboard', { 
        title: 'Exam Dashboard', 
        servername: multiCastserver.serverinfo.servername, 
        pin: multiCastserver.serverinfo.pin, 
        studentlist: multiCastserver.studentList 
      });
    }
    else {
      console.log("Wrong Password!")
      res.render('serverlist', { title: 'Exam Teacher' })
    }
    
  } else {
    console.log("No Exam Server available")
    res.render('serverlist', { title: 'Exam Teacher' })
  }
})

module.exports = router
