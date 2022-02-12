const express = require('express')
const router = express.Router()
const multiCastserver = require('../../classes/multicastserver')
const uuid = require('uuid')
const config = require('../../config')
const path = require('path')
const rootpath = path.dirname(require.main.filename)







/**
 *  starts an exam server instance
 * @param servername the chosen name (for example "mathe")
 * @param pin the pin code used to authenticate
 */
 router.get('/start/:servername/:pin/:passwd', function (req, res, next) {
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
 * @param servername the name of the exam server in question
 * @param csrfservertoken the servers csrf token needed to process the request (generated and transferred to the webbrowser on login) 
 */
 router.get('/stopserver/:servername/:csrfservertoken', function (req, res, next) {
  const servername = req.params.servername
  const mcServer = config.examServerList[servername]

  if (mcServer && req.params.csrfservertoken === mcServer.serverinfo.token) {
    clearInterval(mcServer.broadcastInterval)
    mcServer.server.close();
    delete mcServer
    delete config.examServerList[servername]
    res.send( {sender: "server", message: "exam server stopped", status: "success"})

    
  }
})








/**
 *  sends a list of all running exam servers
 */
 router.get('/serverlist', function (req, res, next) {
  let servernames = []
  Object.values(config.examServerList).forEach( server => {
    servernames.push({servername: server.serverinfo.servername, serverip: server.serverinfo.ip}) 
   });
  
res.json(servernames)
})



/**
 *  find client by token and remove it from the studentList (array)
 * @param servename the server that wants to kick the client
 * @param csrfservertoken the servers token to authenticate
 * @param studenttoken the students token who should be kicked
 */
 router.get('/kick/:servername/:csrfservertoken/:studenttoken', function (req, res, next) {
  
  const servername = req.params.servername
  const servertoken = req.params.csrfservertoken
  const studenttoken = req.params.studenttoken
  const mcServer = config.examServerList[servername]

  //first check if csrf token is valid and server is allowed to trigger this api request
  if (req.params.csrfservertoken === mcServer.serverinfo.token) {
    let registeredClient = mcServer.studentList.find(element => element.token === studenttoken)
    if (registeredClient) {
      
      mcServer.studentList = mcServer.studentList.filter( el => el.token !==  studenttoken);
    }

    res.send( {sender: "server", status: "student kicked"} )
  }
})






/**
 *  sends a list of all connected students { clientname: clientname, token: token, clientip: clientip }
 * @param servername the name of the exam server in question
 * @param csrfservertoken the servers csrf token needed to process the request (generated and transferred to the webbrowser on login) 
 */
 router.get('/studentlist/:servername/:csrfservertoken', function (req, res, next) {
  const servername = req.params.servername
  const mcServer = config.examServerList[servername]

  if (mcServer && req.params.csrfservertoken === mcServer.serverinfo.token) {
    res.send(mcServer.studentList)
  }
  else {
    res.send({sender: "server", message:"server does not exist", status: "error"} )
  }
})



/**
 * updates the specified students timestamp (used in dashboard to mark user as online)
 * usually triggered by the clients directly from the MultiCastServer (loop)
 * POST Data contains a screenshot of the clients desktop !!
 * @param servername the name of the server at which the student is registered
 * @param token the students token to search and update the entry in the list
 */
 router.post('/studentlist/update/:servername/:token', function (req, res, next) {
  const token = req.params.token
  const servername = req.params.servername
  const mcServer = config.examServerList[servername]


  if (!mcServer) {  return res.send({sender: "server", message:"server does not exist", status: "error"} )  }
  if ( !checkToken(token, "server", mcServer) ) { return res.json({ sender: "server", message:"token is not valid", status: "error" }) } //check if the student is registered on this server
  if ( !req.files ) { return res.json({status: "No files were uploaded." });  }

  for (const [key, file] of Object.entries( req.files)) {
    let absoluteFilepath = path.join(rootpath, config.publicdirectory, file.name);
    file.mv(absoluteFilepath, (err) => {  
        if (err) { return {status: "server couldn't store file"} }
        return {status: "success"}
    });
  }

  let registeredClient = mcServer.studentList.find(element => element.token === token)
  registeredClient.timestamp = new Date().getTime()
  res.json({status: 'Student updated' })
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
  if (!mcServer) {  return res.send({sender: "server", message:"server does not exist", status: "error"} )  }


  if (pin === mcServer.serverinfo.pin) {
    let registeredClient = mcServer.studentList.find(element => element.clientname === clientname)

    if (!registeredClient) {   // create client object
      console.log('adding new client')
      const client = {   
        clientname: clientname,
        token: token,
        clientip: clientip,
        timestamp: new Date().getTime()
      }
      mcServer.studentList.push(client)
      return res.json({sender: "server", message:"client registered on server", status: "success", token: token})  // on success return client token (auth needed for server api)
    }
    else {
      return res.json({sender: "server", message:"client already registered", status: "error"})
    }
   
  }
  else {
    res.json({sender: "server", message:"wrong server pin", status: "error"})
  }
  
})




module.exports = router





/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
 function checkToken(token, receiver, mcserver){
  if (receiver === "server"){  //check if the student that wants to send a file is registered on this server
      let tokenexists = false
      console.log("checking if student is already registered on this server")
      mcserver.studentList.forEach( (student) => {
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



