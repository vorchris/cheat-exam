const express = require('express')
const router = express.Router()
const multiCastclient = require('../../src/classes/multicastclient.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('Client: API request recieved')
  res.send(multiCastclient.examServerList)
})

module.exports = router
