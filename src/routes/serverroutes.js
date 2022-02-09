const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const uuid = require('uuid')
const config = require('../config')
const path = require('path')
const { param } = require('./webroutes.js')
const rootpath = path.dirname(require.main.filename)


/**
 *  starts an exam server instance
 * @param servername the chosen name (for example "mathe")
 * @param pin the pin code used to authenticate
 */
router.get('/start/:servername/:pin/:passwd', function (req, res, next) {
  console.log('Server: API request recieved')
  const servername = req.params.servername 
  const mcServer = config.examServerList[servername]
  if (mcServer) { 
    console.log('server already running')
    res.json('server already running')
  } else {
    console.log('Initializing new Exam Server')
    let mcs = new multiCastserver();
    mcs.init(servername, req.params.pin, req.params.passwd)
    config.examServerList[servername]=mcs
    //config.examServerList.push( mcs )  // store all multicast servers (currently only one is possible) on this global accesible config object
    res.json('server started')
  }
})



/**
 *  sends a list of all connected students { clientname: clientname, token: token, clientip: clientip }
 */
router.get('/studentlist/:servername/:csrfservertoken', function (req, res, next) {
  const servername = req.params.servername
  const mcServer = config.examServerList[servername]

  if (req.params.csrfservertoken === mcServer.serverinfo.token) {
    res.send(mcServer.studentList)
  }
})






/**
 * updates the specified students timestamp (used in dashboard to mark user as online)
 * usually triggered by the clients
 * POST Data contains a screenshot of the clients desktop !!
 * @param token the students token to search and update the entry in the list
 */
router.post('/studentlist/update/:servername/:token', function (req, res, next) {
  const token = req.params.token
  const servername = req.params.servername
  const mcServer = config.examServerList[servername]

  if ( !checkToken(token, "server", mcServer) ) { return res.json({ status: "token is not valid" }) } //check if the student is registered on this server
  if ( !req.files ) { return res.json({status: "No files were uploaded." });  }

  for (const [key, file] of Object.entries( req.files)) {
    let absoluteFilepath = path.join(rootpath, config.publicdirectory, file.name);
    console.log(absoluteFilepath)
    file.mv(absoluteFilepath, (err) => {  
        if (err) { return {status: "server couldn't store file"} }
        return {status: "success"}
    });
  }

  let registeredClient = mcServer.studentList.find(element => element.token === token)
  registeredClient.timestamp = new Date().getTime()

  console.log(mcServer.studentList)
  res.json({status: 'Student updated' })
})











/**
 *  sends a list of all running exam servers (currently only one server is possible but i'm thinking of allowing multiple servers on the same machine)
 */
 router.get('/serverlist', function (req, res, next) {
    let servernames = []
    Object.values(config.examServerList).forEach( server => {
      servernames.push({servername: server.serverinfo.servername, serverip: server.serverinfo.ip}) 
     });
    
  res.json(servernames)
})


/**
 *  checks pin code, creates csrf token for client, answeres with token
 *
 *  @param pin  the pincode to connect to the serverinstance
 *  @param clientname the name of the student
 *  @param clientip the clients ip address for api calls
 */
router.get('/registerclient/:servername/:pin/:clientname/:clientip', function (req, res, next) {
  let status = false
  const clientname = req.params.clientname
  const clientip = req.params.clientip
  const pin = req.params.pin
  const servername = req.params.servername
  const token = `csrf-${uuid.v4()}`

  const mcServer = config.examServerList[servername] // get the multicastserver object

  if (pin === mcServer.serverinfo.pin) {
    let registeredClient = mcServer.studentList.find(element => element.clientname === clientname)

    if (!registeredClient) {
      console.log('adding new client')

      status = {
        registered: 'true',
        token: token
      }
      // create client object
      const client = {
        clientname: clientname,
        token: token,
        clientip: clientip,
        timestamp: new Date().getTime()
      }
      mcServer.studentList.push(client)
    }
  }
  console.log(mcServer.studentList)
  res.json(status)
})



/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
 function checkToken(token, receiver, mcserver){
  if (receiver === "server"){  //check if the student that wants to send a file is registered on this server
      let tokenexists = false
      console.log("checking if student is already registered on this server")
      mcserver.studentList.forEach( (student) => {
          console.log(student)
          if (token === student.token) {
              tokenexists = true
          }
      });
      return tokenexists
  }
  else if (receiver === "client"){
      if (token === multiCastclient.clientinfo.token) {
          return true
      }
      return false
  }
}



module.exports = router
