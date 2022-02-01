const express = require('express')
const router = express.Router()
const multiCastserver = require('../classes/multicastserver.js')
const uuid = require('uuid')
const path = require('path')
const fetch = require('node-fetch')
// const rootpath = path.dirname(require.main.filename)

const Transportsend = require('../classes/filetransport').transportSender
const sender = new Transportsend()
// const fs = require('fs')
// const http = require('http')
// const config = require('../config')

router.get('/', function (req, res, next) {
  console.log('Server: API request recieved')
  res.send('hello teacher')
})





router.post("/send", (req, res) => {

    if (!req.files) { return res.status(400).send("No files were uploaded.");  }
    const file = req.files.myFile;

    let absoluteFilepath = path.join('public/files/outbox', file.name);
    

    file.mv(absoluteFilepath, (err) => {
      if (err) { return res.status(500).send(err); }
    });

    let numclients = multiCastserver.studentList.length
    if ( numclients <= 0  ) { res.json({ numberOfClients: numclients }) }
    else {  
      console.log("initializing sender")
      sender.init(absoluteFilepath, numclients)
      // how do we know if this worked and when the sender-server is closed again?
    }


    multiCastserver.studentList.forEach( (student) => {
        fetch(`http://${student.clientip}:3000/client/receive/${student.csrftoken}/${file.name}`)
        .then( response => response.json() )
        .then( async (data) => {
            console.log(data);
            res.json({ status: "success", absoluteFilepath: absoluteFilepath }) 
        });
    });

   
});


  


  














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

router.get('/info', function (req, res, next) {
  // console.log('Server: API request recieved')
  res.send('hello info')
})

router.get('/studentlist', function (req, res, next) {
  // console.log('Server: API request recieved')
  res.send(multiCastserver.studentList)
})

/**
*  checks pin code, creates csrf token for client, answeres with token
*  @param clientinfo  the information the client needs in order to register (pin)
*/
router.get('/registerclient/:pin/:clientname/:clientip', function (req, res, next) {
  // console.log('Server: API request recieved')

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
