const express = require('express')
const router = express.Router()
const multiCastclient = require('../classes/multicastclient.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('Client: API request recieved')
  res.send(multiCastclient.examServerList)
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
