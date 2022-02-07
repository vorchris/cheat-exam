const express = require('express')
const router = express.Router()
const multiCastclient = require('../classes/multicastclient.js')
const path = require('path')
const rootpath = path.dirname(require.main.filename)
const childProcess = require('child_process')
const fetch = require('node-fetch')


/**
 * Checks if the token is valid and the api is allowed to process the request
 */ 
function checkToken(token){
  if (token === multiCastclient.clientinfo.token) {
    return true
  }
  return false
}


/**
 * Returns all found Servers and the information about this client
 */ 
router.get('/', function (req, res, next) {
  res.send({serverlist:multiCastclient.examServerList, clientinfo: multiCastclient.clientinfo})
})



/**
 * Runs a specific command in a child process
 */ 
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


/**
 * Runs a tokencheck and returns true or false
 * @param token a csrf token for validation
 */ 
router.get('/tokencheck/:token', function (req, res, next) {
  const token = req.params.token
  if ( checkToken(token) ) {
    res.json({ tokenisvalid: true })
  }
  else {
    res.json({ tokenisvalid: false })
  }
})




/**
 * Starts the Multicast Client that receives the broadcasts of an exam server instance 
 * Block requests from remote Host
 * on localhost you'll see 127.0.0.1 if you're using IPv4 or ::1, ::ffff:127.0.0.1 if you're using IPv6
 */ 
router.get('/start', function (req, res, next) {
  if (!requestSourceAllowed(req, res)) return
 
  console.log('Starting up: Multicast')
  if (multiCastclient.running) {
    console.log('Multicasting ist already running')
    res.json('Multicasting Client running')
  } else {
    multiCastclient.init()
    res.json('Multicasting Client started')
  }
})



/**
 * Sends a register request to the given server ip
 * @param serverip the examserver instance ip 
 * @param pin the given pin code to authenticate on the server
 * @param clientname the given username of the student
 */
router.get('/register/:serverip/:pin/:clientname', async function (req, res, next) {
  const clientname = req.params.clientname
  const pin = req.params.pin
  const serverip = req.params.serverip
 
  if (multiCastclient.clientinfo.token){
      res.json({status: "already registered on a server"})
      return
  }

  const clientip = multiCastclient.clientinfo.ip
  await fetch(`http://${serverip}:3000/server/registerclient/${pin}/${clientname}/${clientip}`)
    .then(response => response.json())
    .then(data => {
      console.log(JSON.stringify(data))
      if (data) { // registration successfull otherwise data would be "false"
        multiCastclient.clientinfo.name = clientname
        multiCastclient.clientinfo.serverip = serverip
        multiCastclient.clientinfo.token = data.token // we need to store the client token in order to check against it before processing critical api calls
      }
      res.json(data)
    })
})



//do not allow requests from external hosts
function requestSourceAllowed(req,res){
  if (req.ip !== "::1" && req.ip !== "127.0.0.1"){ 
    console.log("Blocked request from remote Host"); 
    res.json('Request denied') 
    return false
  }   
  return true
}


module.exports = router
