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

router.get('/teacher/', function (req, res, next) {
  res.render('teacher', { title: 'Exam Teacher' })
})

router.get('/dashboard/', function (req, res, next) {
  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    res.render('dashboard', { title: 'Exam Dashboard', servername: multiCastserver.serverinfo.servername, pin: multiCastserver.serverinfo.pin })
  } else {
    res.render('teacher', { title: 'Exam Teacher' })
  }
})

module.exports = router
