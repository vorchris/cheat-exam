const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const uuid = require('uuid')
const config = require('../config')

/**
 *  starts an exam server instance
 * @param servername the chosen name (for example "mathe")
 * @param pin the pin code used to authenticate
 */
router.get('/start/:servername/:pin/:passwd', function (req, res, next) {
  console.log('Server: API request recieved')
  let servername = req.params.servername 

  if (multiCastserver.running) { // we could allow the creation of several exam servers ?
    console.log('server already running')
    res.json('server already running')
  } else {
    multiCastserver.init(servername, req.params.pin, req.params.passwd)

    
    config.examServerList.push( multiCastserver )  // store all multicast servers (currently only one is possible) on this global accesible config object
    res.json('server started')
  }
})



/**
 *  sends a list of all connected students { clientname: clientname, csrftoken: csrftoken, clientip: clientip }
 */
router.get('/studentlist', function (req, res, next) {
  res.send(multiCastserver.studentList)
})

/**
 *  sends a list of all running exam servers (currently only one server is possible but i'm thinking of allowing multiple servers on the same machine)
 */
 router.get('/serverlist', function (req, res, next) {
    let servernames = []
    config.examServerList.forEach( server => {  // never send the whole serverinfo object to clients (contains password, uuid,...)
      servernames.push({servername: server.serverinfo.servername, serverip: server.serverinfo.ip})
    } )
  res.json(servernames)
})


/**
 *  checks pin code, creates csrf token for client, answeres with token
 *
 *  @param pin  the pincode to connect to the serverinstance
 *  @param clientname the name of the student
 *  @param clientip the clients ip address for api calls
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
