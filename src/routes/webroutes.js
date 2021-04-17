const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome' })
})

router.get('/student/', function (req, res, next) {
  res.render('student', { title: 'Exam Student'})
})

router.get('/teacher/', function (req, res, next) {
  res.render('teacher', { title: 'Exam Teacher'})
})

router.get('/overview/', function (req, res, next) {
  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    res.render('overview', { title: 'Exam Overview', servername: multiCastserver.serverinfo.servername, pin: multiCastserver.serverinfo.pin })
  } else {
    res.render('teacher', { title: 'Exam Teacher' })
  }
})

module.exports = router
