const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const uuid = require('uuid')
// const path = require('path')
// const rootpath = path.dirname(require.main.filename)

router.get('/', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello teacher')
})

router.get('/start', function (req, res, next) {
  console.log('Server: API request recieved')

  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
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

/**
*  checks pin code, creates csrf token for client, answeres with token
*  @param clientinfo  the information the client needs in order to register (pin)
*/
router.get('/registerclient/:clientinfo', function (req, res, next) {
  console.log('Server: API request recieved')

  let status = false

  if (req.params.clientinfo === '1234') {
    status = {
      registered: 'true',
      csrftoken: `csrf-${uuid.v4()}`
    }
  }

  res.json(status)
})

module.exports = router
