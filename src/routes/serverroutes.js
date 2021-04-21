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

router.get('/start/:servername/:pin', function (req, res, next) {
  console.log('Server: API request recieved')

  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    console.log('server already running')
    res.json('server already running')
  } else {
    multiCastserver.init(req.params.servername, req.params.pin)
    res.json('server started')
  }
})

router.get('/info', function (req, res, next) {
  // console.log('Server: API request recieved')
  res.send('hello info')
})

router.get('/studentlist', function (req, res, next) {
  // console.log('Server: API request recieved')
  res.send(multiCastserver.studentList)
})

/**
*  checks pin code, creates csrf token for client, answeres with token
*  @param clientinfo  the information the client needs in order to register (pin)
*/
router.get('/registerclient/:pin/:clientname', function (req, res, next) {
  // console.log('Server: API request recieved')

  let status = false
  const clientname = req.params.clientname
  const pin = req.params.pin
  const csrftoken = `csrf-${uuid.v4()}`

  if (pin === multiCastserver.serverinfo.pin) {
    status = {
      registered: 'true',
      csrftoken: csrftoken
    }

    const client = {
      clientname: clientname,
      csrftoken: csrftoken
    }
    multiCastserver.studentList.push(client)
  }

  console.log(multiCastserver.studentList)
  res.json(status)
})

module.exports = router
