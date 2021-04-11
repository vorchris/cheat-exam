const express = require('express')
const router = express.Router()
const client = require('../../src/classes/multicastclient.js')

/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('Client: API request recieved')
  res.send(client.examServerList)
})

module.exports = router
