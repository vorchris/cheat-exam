const express = require('express')
const router = express.Router()

const server = require('../classes/multicastserver.js')

router.get('/', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello teacher')
})

router.get('/start', function (req, res, next) {
  console.log('Server: API request recieved')

  if (server.running) {
    console.log('server already running')
    res.json('server already running')
  } else {
    server.init()
    res.json('server started')
  }
})

router.get('/info', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello info')
})

module.exports = router
