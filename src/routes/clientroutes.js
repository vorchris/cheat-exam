const express = require('express')
const router = express.Router()
const multiCastclient = require('../classes/multicastclient.js')
const path = require('path')
const rootpath = path.dirname(require.main.filename)
const childProcess = require('child_process')
const fetch = require('node-fetch')

/* GET users listing. */
router.get('/', function (req, res, next) {
  // console.log('Client: API request recieved')
  res.send(multiCastclient.examServerList)
})

router.get('/cmd', function (req, res, next) {
  // console.log('Server: API request recieved')
  const filepath = path.join(rootpath, '/assets/pythonscripts/Notification/NotificationTest.py')

  childProcess.execFile('python3', [filepath], (error, stdout, stderr) => {
    if (stderr) {
      console.log(stderr)
    }
    if (error) {
      console.log(error)
      res.json(error)
    } else {
      res.json(stdout)
    }
  })
})

router.get('/tokencheck/:token', function (req, res, next) {
  // console.log('Server: API request recieved')
  const token = req.params.token
  if (token === multiCastclient.clientinfo.token) {
    console.log(true)
    res.json({ tokenisvalid: true })
  }
  else {
    res.json({ tokenisvalid: false })
    console.log(false)
  }
})

router.get('/start', function (req, res, next) {
  console.log('Starting up: Multicast')
  if (multiCastclient.running) {
    console.log('Multicasting ist already running')
    res.json('Multicasting Client running')
  } else {
    multiCastclient.init()
    res.json('Multicasting Client started')
  }
})

router.get('/register/:serverip/:serverport/:pin/:clientname', async function (req, res, next) {
  const clientname = req.params.clientname
  const pin = req.params.pin
  const serverip = req.params.serverip
  const serverport = req.params.serverport
  await fetch(`http://${serverip}:${serverport}/server/registerclient/${pin}/${clientname}`)
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data))
      multiCastclient.clientinfo.name = clientname
      multiCastclient.clientinfo.server = serverip
      multiCastclient.clientinfo.token = data.csrftoken // we need to store the client token in order to check against it before processing critical api calls
      res.json(data)
    })
})

module.exports = router
