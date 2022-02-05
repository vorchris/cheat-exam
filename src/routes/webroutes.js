const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const config = require('../config')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome', mcast: multiCastserver })
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
router.get('/dashboard/:servername/:passwd', function (req, res, next) {
  let servername = req.params.servername 
  let password = req.params.passwd

  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    console.log(config.examServerList)

    let serverinfo = config.examServerList.find(x => x.serverinfo.servername === servername).serverinfo;
    if (serverinfo.password === password) {
      res.render('dashboard', { title: 'Exam Dashboard', servername: multiCastserver.serverinfo.servername, pin: multiCastserver.serverinfo.pin, studentlist: multiCastserver.studentList })
    }
    else {
      res.render('serverlist', { title: 'Exam Teacher' })
    }
    
  } else {
    res.render('serverlist', { title: 'Exam Teacher' })
  }
})

module.exports = router
