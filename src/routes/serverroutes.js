const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const uuid = require('uuid')




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



router.get('/studentlist', function (req, res, next) {
  res.send(multiCastserver.studentList)
})



/**
*  checks pin code, creates csrf token for client, answeres with token
*  @param clientinfo  the information the client needs in order to register (pin)
*/
router.get('/registerclient/:pin/:clientname/:clientip', function (req, res, next) {
  let status = false
  const clientname = req.params.clientname
  const clientip = req.params.clientip
  const pin = req.params.pin
  const csrftoken = `csrf-${uuid.v4()}`

  if (pin === multiCastserver.serverinfo.pin) {
    let registeredClient = multiCastserver.studentList.find(element => element.clientname === clientname)

    if (!registeredClient) {
      console.log('adding new client')

      status = {
        registered: 'true',
        csrftoken: csrftoken
      }
      // create client object
      const client = {
        clientname: clientname,
        csrftoken: csrftoken,
        clientip: clientip
      }
      multiCastserver.studentList.push(client)
    }
  }
  console.log(multiCastserver.studentList)
  res.json(status)
})

module.exports = router
