const express = require('express')
const router = express.Router()
const multiCastclient = require('../classes/multicastclient.js')
const path = require('path')
const rootpath = path.dirname(require.main.filename)
const childProcess = require('child_process')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('Client: API request recieved')
  res.send(multiCastclient.examServerList)
})

router.get('/cmd', function (req, res, next) {
  console.log('Server: API request recieved')

  const filepath = path.join(rootpath, '/assets/pythonscripts/Notification/NotificationTest.py')

  childProcess.execFile('python3', [filepath], (error, stdout, stderr) => {
    if (stderr) {
      console.log(stderr)
    }
    if (error) {
      console.log(error)
      res.send(error)
    }
    else {
      res.send(stdout)
    }
  })
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

module.exports = router