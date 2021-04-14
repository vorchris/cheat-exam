const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')

router.get('/', function (req, res, next) {
  res.sendFile('/public/index.html', { title: 'Express' })
})

router.get('/student/', function (req, res, next) {
  res.sendFile('/public/student.html', { title: 'Express', root: '.' })
})

router.get('/teacher/', function (req, res, next) {
  res.sendFile('/public/teacher.html', { title: 'Express', root: '.' })
})

router.get('/overview/', function (req, res, next) {
  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    res.render('overview', { title: 'Exam Overview', servername: multiCastserver.serverinfo.servername, pin: multiCastserver.serverinfo.pin })
  } else {
    res.sendFile('/public/teacher.html', { title: 'Express', root: '.' })
  }
})

module.exports = router
