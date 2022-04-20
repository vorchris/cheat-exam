import { Router } from 'express'
const router = Router()
import multiCastserver from '../../classes/multicastserver.js'
import multiCastclient from '../../classes/multicastclient.js'
import { v4 } from 'uuid'
import config from '../../config.js'
import path from 'path'
import i18n from '../../../../renderer/src/locales/locales.js'
const { t } = i18n.global
import fs from 'fs' 





/**
 * STARTS an exam server instance
 * @param servername the chosen name (for example "mathe")
 * @param pin the pin code used to authenticate
 */
 router.get('/start/:servername/:passwd', function (req, res, next) {
    const servername = req.params.servername 
    const mcServer = config.examServerList[servername]
    //generate random pin
    let pin = String(Math.floor(Math.random()*90000) + 10000)
    if (config.development){ pin = "1337" }  

    // // check if server is already running locally or in LAN
    if (mcServer) { 
        return res.send( {sender: "server", message: t("control.serverexists"), status: "error"})
    } 

    for (const exam of multiCastclient.examServerList) {  // do not use forEach() because its run async and the interpreter will not wait for it to finish
        if (servername == exam.servername ){
            return res.send( {sender: "server", message: t("control.serverexistsLAN"), status: "error"})
        }
     }


    
    console.log('Initializing new Exam Server')
    let mcs = new multiCastserver();
    mcs.init(servername, pin, req.params.passwd)
    config.examServerList[servername]=mcs

     let serverinstancedir = path.join(config.workdirectory, servername)

    if (!fs.existsSync(serverinstancedir)){ fs.mkdirSync(serverinstancedir, { recursive: true }); }
    res.send( {sender: "server", message: t("control.serverstarted"), status: "success"})
    
})



/**
 * STOPS an exam server instance
 * @param servername the name of the exam server in question
 * @param csrfservertoken the servers csrf token needed to process the request (generated and transferred to the webbrowser on login) 
 */
 router.get('/stopserver/:servername/:csrfservertoken', function (req, res, next) {
    const servername = req.params.servername
    const mcServer = config.examServerList[servername]

    if (mcServer && req.params.csrfservertoken === mcServer.serverinfo.servertoken) {
        clearInterval(mcServer.broadcastInterval)
        mcServer.server.close();
        //delete mcServer
        delete config.examServerList[servername]
        res.send( {sender: "server", message: t("control.serverstopped"), status: "success"})

        
    }
})






/**
 * checks serverpassword for login via VUE ROUTER
 * @param servername the chosen name (for example "mathe")
 * @param passwd the password needed to enter the dashboard  !!FIXME: use https and proper auth 
 **/
 router.get('/checkpasswd/:servername/:passwd', function (req, res, next) {
    const servername = req.params.servername 
    const passwd = req.params.passwd
    const mcServer = config.examServerList[servername]

    if (mcServer) { 
        if (passwd === mcServer.serverinfo.password){ 
        return res.send( {
            sender: "server", 
            message: t("control.correctpw"), 
            status: "success", 
            data: {
            pin: mcServer.serverinfo.pin,
            servertoken: mcServer.serverinfo.servertoken,
            serverip: mcServer.serverinfo.ip
            } 
        } )} 
        else { return res.send( {sender: "server", message: t("control.wrongpw"), status: "error"}) }
    } 
    else {
        res.send( {sender: "server", message: t("control.notfound"), status: "error"})
    }
})














/**
 *  sends a list of all running exam servers
 *  TODO: serverlist should contain ALL servers in a local network
 *  use multicastclient on serverside to fill serverlist too (not just for clients)
 */
router.get('/serverlist', function (req, res, next) {
    let serverlist = []
    Object.values(config.examServerList).forEach( server => {
        serverlist.push({servername: server.serverinfo.servername, serverip: server.serverinfo.ip}) 
    });
    
    res.send({serverlist:serverlist})
})



/**
 *  sends a list of all connected students { clientname: clientname, token: token, clientip: clientip }
 * @param servername the name of the exam server in question
 * @param csrfservertoken the servers csrf token needed to process the request (generated and transferred to the webbrowser on login) 
 */
 router.get('/studentlist/:servername/:csrfservertoken', function (req, res, next) {
    const servername = req.params.servername
    const mcServer = config.examServerList[servername]

    if (mcServer && req.params.csrfservertoken === mcServer.serverinfo.servertoken) {
        res.send({studentlist: mcServer.studentList})
    }
    else {
        res.send({sender: "server", message:t("control.notfound"), status: "error"} )
    }
})




/**
 *  REGISTER CLIENT
 *  checks pin code, creates csrf token for client, answeres with token
 *
 *  @param pin  the pincode to connect to the serverinstance
 *  @param clientname the name of the student
 *  @param clientip the clients ip address for api calls
 */
 router.get('/registerclient/:servername/:pin/:clientname/:clientip/:version', function (req, res, next) {
    let status = false
    const clientname = req.params.clientname
    const clientip = req.params.clientip
    const pin = req.params.pin
    const version = req.params.version
    const servername = req.params.servername
    const token = `csrf-${v4()}`

    const mcServer = config.examServerList[servername] // get the multicastserver object
    if (!mcServer) {  return res.send({sender: "server", message:t("control.notfound"), status: "error"} )  }
    if (version !== config.version ) {  return res.send({sender: "server", message:t("control.versionmismatch"), status: "error"} )  }  

    if (pin === mcServer.serverinfo.pin) {
        let registeredClient = mcServer.studentList.find(element => element.clientname === clientname)

        if (!registeredClient) {   // create client object
        console.log('adding new client')
        const client = {   
            clientname: clientname,
            token: token,
            clientip: clientip,
            timestamp: new Date().getTime(),
            focus: true,
            exammode: false,
            imageurl:false,
            virtualized: false
        }

        console.log(mcServer.serverinfo)

        //create folder for student
        let studentfolder =path.join(config.workdirectory, mcServer.serverinfo.servername , clientname);
        if (!fs.existsSync(studentfolder)){ fs.mkdirSync(studentfolder, { recursive: true }); }
        if (!fs.existsSync(config.tempdirectory)){ fs.mkdirSync(config.tempdirectory, { recursive: true }); }


        mcServer.studentList.push(client)
        return res.json({sender: "server", message:t("control.registered"), status: "success", token: token})  // on success return client token (auth needed for server api)
        }
        else {
        return res.json({sender: "server", message:t("control.alreadyregistered"), status: "error"})
        }
    
    }
    else {
        res.json({sender: "server", message:t("control.wrongpin"), status: "error"})
    }
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
    if (req.params.csrfservertoken === mcServer.serverinfo.servertoken) {
        let registeredClient = mcServer.studentList.find(element => element.token === studenttoken)
        if (registeredClient) {
        
        mcServer.studentList = mcServer.studentList.filter( el => el.token !==  studenttoken);
        }

        res.send( {sender: "server", message: t("control.studentremove"), status: "success"} )
    }
    else {

        res.send( {sender: "server", message: t("control.actiondenied"), status: "error"} )
    }
})








/**
 * updates the specified students timestamp (used in dashboard to mark user as online)
 * usually triggered by the clients directly from the MultiCastServer (loop)
 * POST Data contains a screenshot of the clients desktop !!
 * @param servername the name of the server at which the student is registered
 * @param token the students token to search and update the entry in the list
 */
 router.post('/studentlist/update', function (req, res, next) {
    const clientinfo = JSON.parse(req.body.clientinfo)

    const token = clientinfo.token
    const exammode = clientinfo.exammode
    const servername = clientinfo.servername
    const mcServer = config.examServerList[servername]

    if ( !mcServer) {  return res.send({sender: "server", message:t("control.notfound"), status: "error"} )  }
    if ( !checkToken(token, "server", mcServer) ) {return res.send({ sender: "server", message:t("control.tokennotvalid"), status: "error" }) } //check if the student is registered on this server
    if ( !req.files ) {return res.send({sender: "server", message:t("control.nofiles"), status:"error"});  }
    
    let registeredClient = mcServer.studentList.find(element => element.token === token)

    for (const [key, file] of Object.entries( req.files)) {
        let absoluteFilepath = path.join(config.tempdirectory, file.name); 
        //console.log(absoluteFilepath)
        file.mv(absoluteFilepath, (err) => {  if (err) {  console.log(err)  } });
        
        if (!registeredClient.focus){
            console.log("Server Control: Student out of focus - securing screenshots")
            let time = new Date(new Date().getTime()).toISOString().substr(11, 8);
            let filepath =path.join(config.workdirectory, mcServer.serverinfo.servername, registeredClient.clientname, "focuslost");
            let absoluteFilename = path.join(filepath,`${time}-${file.name}`)

            if (!fs.existsSync(filepath)){ fs.mkdirSync(filepath, { recursive: true } ); }
            file.mv(absoluteFilename, (err) => {  if (err) {  console.log(err)  } });
        }
    }
    
    // do not update all of the clientinfo (leave some decisions to the server - like 'focus' for example)
    registeredClient.timestamp = new Date().getTime()
    registeredClient.exammode = exammode  
    registeredClient.imageurl = `https://${config.hostip}:${config.serverApiPort}/${token}.jpg?ver=${registeredClient.timestamp}`
    res.send({sender: "server", message:t("control.studentupdate"), status:"success" })
})



/**
 * updates the studentlist entry
 * sets FOCUS state 
 * @param servername the name of the server at which the student is registered
 * @param token the students token to search and update the entry in the list
 * @param state focused or unfocused that is the question
 */
 router.get('/studentlist/statechange/:servername/:token/:state', function (req, res, next) {
    const token = req.params.token
    const servername = req.params.servername
    const mcServer = config.examServerList[servername]
    const state = req.params.state

    if (!mcServer) {  return res.send({sender: "server", message:t("control.notfound"), status: "error"} )  }
    if ( !checkToken(token, "server", mcServer) ) { return res.json({ sender: "server", message:t("control.tokennotvalid"), status: "error" }) } //check if the student is registered on this server

    let registeredClient = mcServer.studentList.find(element => element.token === token)
    
    if (state === "false"){
        registeredClient.focus = false;
        return res.json({ sender: "server", message:t("control.studentleft"), status: "success" })
    }
    else if (state === "true"){
        registeredClient.focus = true;
        return res.json({ sender: "server", message:t("control.staterestore"), status: "success" })
    }
    else if (state === "virtualized"){
        registeredClient.virtualized = true;
        return res.json({ sender: "server", message:t("control.virtualized"), status: "success" })
    }
})




export default router





/**
 * Checks if the token is valid in order to process api request
 * Attention: no all api requests check tokens atm!
 */
 function checkToken(token, receiver, mcserver){
    if (receiver === "server"){  //check if the student that wants to send a file is registered on this server
        let tokenexists = false
        
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



