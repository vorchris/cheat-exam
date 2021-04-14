const express = require('express')
const router = express.Router()
const multiCastserver = require('../../src/classes/multicastserver.js')
const path = require('path')
// const rootpath = path.dirname(require.main.filename)

router.get('/', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello teacher' )
})

router.get('/start', function (req, res, next) {
  console.log('Server: API request recieved')

  if (multiCastserver.running) {
    console.log('server already running')
    res.json('server already running')
  } else {
    multiCastserver.init()
    res.json('server started')
  }
})

router.get('/info', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello info')
})

module.exports = router
