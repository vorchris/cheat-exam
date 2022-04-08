import { Router } from 'express'
const router = Router()
import config from '../../config.js'
import multiCastclient from '../../classes/multicastclient.js'
import axios from 'axios'
import nodenotify  from 'node-notifier'
import ip from 'ip'
import { ipcRenderer } from 'electron'  // we use this to talk to the electron ipcMain process (send signals)
import fs from 'fs' 

// the moment i import this here i create some sort of racecondition (reloading the page helps to overcome the error and it works in the final build)
import i18n from '../../../../renderer/src/locales/locales.js'
const { t } = i18n.global
 

/**
 * Returns all found Servers and the information about this client
 */ 
router.get('/getinfo', function (req, res, next) {
    if (!requestSourceAllowed(req, res)) return //this api route should not deliver if the requestsource is not the same as the api host
    res.send({serverlist:multiCastclient.examServerList, clientinfo: multiCastclient.clientinfo})
})
  


/**
 * Stores focus state of client (only the teachers focus state counts but the client also gets informed)
 */ 
router.get('/focus/:token/:state', function (req, res, next) {
    const token = req.params.token
    const state = req.params.state
  
    if ( checkToken(token)) {  
        if (state === "false"){
            multiCastclient.clientinfo.focus = false
        }  
        else {
          multiCastclient.clientinfo.focus = true
        }
        res.json({ sender: "client",message:t("control.statechange"), status:"success" })
    }
    else {
        res.json({ sender: "client", message:t("control.tokennotvalid"), status: "error" })
    }
})






/**
 * Sends a register request to the given server ip
 * @param serverip the examserver instance ip 
 * @param pin the given pin code to authenticate on the server
 * @param clientname the given username of the student
 */
router.get('/register/:serverip/:servername/:pin/:clientname', async function (req, res, next) {
    const clientname = req.params.clientname
    const pin = req.params.pin
    const serverip = req.params.serverip
    const servername = req.params.servername
    const clientip = ip.address()
    const version = config.version

    if (multiCastclient.clientinfo.token){
        return res.json({ sender: "client", message: t("control.alreadyregistered"), status:"error" })
    }
 
    await axios.get(`http://${serverip}:${config.serverApiPort}/server/control/registerclient/${servername}/${pin}/${clientname}/${clientip}/${version}`)
    .then(response => {
        if (response.data && response.data.status == "success") { // registration successfull otherwise data would be "false"
          multiCastclient.clientinfo.name = clientname
          multiCastclient.clientinfo.serverip = serverip
          multiCastclient.clientinfo.servername = servername
          multiCastclient.clientinfo.ip = clientip
          multiCastclient.clientinfo.token = response.data.token // we need to store the client token in order to check against it before processing critical api calls
          multiCastclient.clientinfo.focus = true
        }
        res.send(response.data)
    }).catch(err => console.log(err))
})


/**
 * Runs a tokencheck and STARTS THE EXAM MODE
 * @param token a csrf token for validation
 */ 
 router.get('/exammode/start/:token/:examtype/:delfolder', function (req, res, next) {
    const token = req.params.token
    const examtype = req.params.examtype
    const delfolder = req.params.delfolder
    
    if ( checkToken(token)) {  

        // delete the contents of the students workdirectory
        if (delfolder === "true") {  //get parameters come as string
            console.log("cleaning exam workfolder")
            if (fs.existsSync(config.workdirectory)){ 
                fs.rmdirSync(config.workdirectory, { recursive: true });
                fs.mkdirSync(config.workdirectory);
                
            }
        }

        // send the exam signal to the electron base app in order to load kiosk mode and the according vue.js view 
        if (config.electron){
          ipcRenderer.send('exam', token, examtype)  //this only works in electron app..switches electron to kiosk and send a signal to the renderer to load given exam page (writer or geogebra)
        }
        multiCastclient.clientinfo.exammode = true  // mark this client as active exam 
        res.json({ sender: "client",message:t("control.examinit"), status:"success" })
    }
    else {
        res.json({ sender: "client", message:t("control.tokennotvalid"), status: "error" })
    }
})


/**
 * Runs a tokencheck and STOPS THE EXAM MODE
 * @param token a csrf token for validation
 */ 
 router.get('/exammode/stop/:token', function (req, res, next) {
  const token = req.params.token
  if ( checkToken(token) ) {
    if (!multiCastclient.clientinfo.exammode){return res.json({ sender: "client",message:t("control.noexam"), status:"error" })}
   
    ipcRenderer.send('endexam')
   
    multiCastclient.clientinfo.exammode = false
    res.json({ sender: "client",message:t("control.examexit"), status:"success" })
  }
  else {
    res.json({ sender: "client", message:t("control.tokennotvalid"), status: "error" })
  }
})





/**
 * Runs a tokencheck and removes the SERVER REGISTRATION
 * @param token a csrf token for validation
 */ 
 router.get('/kick/:token', function (req, res, next) {
  const token = req.params.token
  if ( checkToken(token) ) {
    for (const [key, value] of Object.entries(multiCastclient.clientinfo)) {
        multiCastclient.clientinfo[key] = false   
    }
    showOSD("Kicked by Server!")
    res.json({ sender: "client", message : t("control.clientunsubscribe"), status: "success" })
  }
  else {
    res.json({ sender: "client",  message:t("control.tokennotvalid"), status: "error" })
  }
})






/**
 * Runs a tokencheck and returns true or false
 * @param token a csrf token for validation
 */ 
router.get('/tokencheck/:token', function (req, res, next) {
    const token = req.params.token
    const filepath = '/src/assets/img/icons/success.png'
  
    if ( checkToken(token) ) {
        console.log('Show Notification')
        nodenotify.notify( {
                title: 'OSD Notification Test',
                message: `Hello from Next-Exam Server, ${multiCastclient.clientinfo.name}!`,
                icon: filepath, // Absolute path (doesn't work on balloons)
            },
            function(err, response) {
                console.log(err)
                console.log(response)
            }
        );
       
      res.json({ sender: "client", message: t("control.tokenvalid"), status: "success" })
    }
    else {
      res.json({ sender: "client", message: t("control.tokennotvalid"), status: "error" })
    }
})




/**
 * Runs a specific command in a child process
 */ 
 router.get('/cmd', function (req, res, next) {
    const filepath = '/src/assets/img/icons/success.png'
  

    // could  trigger a shellscript or a python script
    // childProcess.execFile('python3', [filepath], (error, stdout, stderr) => {
    //   if (stderr) {
    //     console.log(stderr)
    //   }
    //   if (error) {
    //     console.log(error)
    //     res.json(error)
    //   } else {
    //     res.json(stdout)
    //   }
    // })

    return res.json({ status: "doing nothing" })
  })
  








export default router


//do not allow requests from external hosts
function requestSourceAllowed(req,res){
    if (req.ip == "::1"  || req.ip == "127.0.0.1" || req.ip.includes('127.0.0.1') ){ 
      return true
    }  
    console.log(`Blocked request from remote Host: ${req.ip}`); 
    res.json('Request denied') 
    return false 
}

/**
 * Checks if the token is valid and the api is allowed to process the request
 */ 
function checkToken(token){
    if (token === multiCastclient.clientinfo.token) {
      return true
    }
    return false
}



function showOSD(notification){
  const filepath =  '/src/assets/img/icons/success.png'
  nodenotify.notify( {
              title: 'Next Exam',
              message: notification,
              icon: filepath, // Absolute path (doesn't work on balloons)
          },
          function(err, response) {
              console.log(err)
              //console.log(response)
          }
  );
}