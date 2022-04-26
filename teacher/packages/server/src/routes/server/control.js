/**
 * @license GPL LICENSE
 * Copyright (c) 2021-2022 Thomas Michael Weissel
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the Free Software Foundation,
 * either version 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * You should have received a copy of the GNU General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>
 */

import { Router } from 'express'
const router = Router()
import multiCastserver from '../../classes/multicastserver.js'
import multiCastclient from '../../classes/multicastclient.js'
import crypto from 'crypto';
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
    const clientname = req.params.clientname
    const clientip = req.params.clientip
    const pin = req.params.pin
    const version = req.params.version
    const servername = req.params.servername
    const token = `csrf-${crypto.randomUUID()}`
    const mcServer = config.examServerList[servername] // get the multicastserver object
    
    if (!mcServer) {  return res.send({sender: "server", message:t("control.notfound"), status: "error"} )  }
    if (version !== config.version ) {  return res.send({sender: "server", message:t("control.versionmismatch"), status: "error"} )  }  
    if (pin === mcServer.serverinfo.pin) {
        let registeredClient = mcServer.studentList.find(element => element.clientname === clientname)

        if (!registeredClient) {   // create client object
            console.log('adding new client')
            const client = {    // we have a different representation of the clientobject on the server than on the client - why exactly? we could just send the whole client object via POST (as we already do in /update route )
                clientname: clientname,
                token: token,
                clientip: clientip,
                timestamp: new Date().getTime(),
                focus: true,
                exammode: false,
                imageurl:false,
                virtualized: false,
                status : {}    // we use this to store (per student) information about whats going on on the serverside (tasklist) and send it back on /update
            }
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
 *  KICK client - client will get error response on next update and remove connection automatically
 * @param servename the server that wants to kick the client
 * @param csrfservertoken the servers token to authenticate
 * @param studenttoken the students token who should be kicked
 */
 router.get('/kick/:servername/:csrfservertoken/:studenttoken', function (req, res, next) {
    const servername = req.params.servername
    const studenttoken = req.params.studenttoken
    const mcServer = config.examServerList[servername]

    if (req.params.csrfservertoken === mcServer.serverinfo.servertoken) {  //first check if csrf token is valid and server is allowed to trigger this api request
        let student = mcServer.studentList.find(element => element.token === studenttoken)
        if (student) {   mcServer.studentList = mcServer.studentList.filter( el => el.token !==  studenttoken); } // remove client from studentlist
        res.send( {sender: "server", message: t("control.studentremove"), status: "success"} )
    }
    else {
        res.send( {sender: "server", message: t("control.actiondenied"), status: "error"} )
    }
})


/**
 * RESTORE cients focused state 
 * @param servename the server that wants to kick the client
 * @param csrfservertoken the servers token to authenticate
 * @param studenttoken the students token who should be kicked
 */
 router.get('/restore/:servername/:csrfservertoken/:studenttoken', function (req, res, next) {
    const servername = req.params.servername
    const studenttoken = req.params.studenttoken
    const mcServer = config.examServerList[servername]

    if (req.params.csrfservertoken === mcServer.serverinfo.servertoken) {  //first check if csrf token is valid and server is allowed to trigger this api request
        let student = mcServer.studentList.find(element => element.token === studenttoken)
        if (student) {   
            student.status.restorefocusstate = true
         }
        res.send( {sender: "server", message: t("control.studentremove"), status: "success"} )
    }
    else {
        res.send( {sender: "server", message: t("control.actiondenied"), status: "error"} )
    }
})


/**
 * Toggle EXAM  (start/stop kiosk mode for students)
 * req.body should contain the updated serverstatus information
 * @param servername the name of the server at which the student is registered
 * @param csrfservertoken servertoken to authenticate before the request is processed
 */
 router.post('/exam/:servername/:csrfservertoken', function (req, res, next) {
    const csrfservertoken = req.params.csrfservertoken
    const servername = req.params.servername
    const mcServer = config.examServerList[servername]
   
    if (!mcServer) {  return res.send({sender: "server", message:t("control.notfound"), status: "error"} )  }
    if (csrfservertoken !== mcServer.serverinfo.servertoken) { res.send({sender: "server", message:t("control.tokennotvalid"), status: "error"} )}

    mcServer.serverstatus.exammode = req.body.exammode
    mcServer.serverstatus.examtype = req.body.examtype
    mcServer.serverstatus.delfolder = req.body.delfolder
    
    res.json({ sender: "server", message:t("general.ok"), status: "success" })
})




/**
 * updates the specified students timestamp (used in dashboard to mark user as online) and other status updates
 * usually triggered by the clients directly from the MultiCastServer (loop)
 * POST Data contains a screenshot of the clients desktop !!
 * @param servername the name of the server at which the student is registered
 * @param token the students token to search and update the entry in the list
 */
 router.post('/update', function (req, res, next) {
    const clientinfo = JSON.parse(req.body.clientinfo)
    const studenttoken = clientinfo.token
    const exammode = clientinfo.exammode
    const servername = clientinfo.servername
    
    const mcServer = config.examServerList[servername]
    if ( !mcServer) {  return res.send({sender: "server", message:"notavailable", status: "error"} )  }
    
    let student = mcServer.studentList.find(element => element.token === studenttoken)
    if ( !student ) {return res.send({ sender: "server", message:t("control.invalidregistration"), status: "error" }) } //check if the student is registered on this server
    if ( !req.files ) {return res.send({sender: "server", message:t("control.nofiles"), status:"error"});  }
    

    // TODO - check if the file object is complete. (do a md5 hash check or something) (because this happens a lot an displays an error in the ui)
    for (const [key, file] of Object.entries( req.files)) { // save the freshly delivered screenshot
        let absoluteFilepath = path.join(config.tempdirectory, file.name); 
        file.mv(absoluteFilepath, (err) => {  if (err) {  console.log(err)  } });
        
        if (!student.focus){  // archive screenshot if student out of focus for investigation
            console.log("Server Control: Student out of focus - securing screenshots")
            let time = new Date(new Date().getTime()).toISOString().substr(11, 8);
            let filepath =path.join(config.workdirectory, mcServer.serverinfo.servername, student.clientname, "focuslost");
            let absoluteFilename = path.join(filepath,`${time}-${file.name}`)
            if (!fs.existsSync(filepath)){ fs.mkdirSync(filepath, { recursive: true } ); }
            file.mv(absoluteFilename, (err) => {  if (err) {  console.log(err)  } });
        }
    }
   
    if (clientinfo.focus) { student.status.restorefocusstate = false }  // remove task because its obviously done

    //update important student attributes
    student.focus = clientinfo.focus  
    student.virtualized = clientinfo.virtualized
    student.timestamp = new Date().getTime()   //last seen 
    student.exammode = exammode  
    student.imageurl = `https://${config.hostip}:${config.serverApiPort}/${studenttoken}.jpg?ver=${student.timestamp}`
    // return current serverinformation 
    res.send({sender: "server", message:t("control.studentupdate"), status:"success", serverstatus:mcServer.serverstatus, studentstatus: student.status })
})








export default router








/**
 * Should be used before processing API requests that come from external sources
 * Checks if the student that sent the request has a valid token (is registered) on the server
 * in order to process api request
 */
 function checkToken(token, mcserver){
    let tokenexists = false
    mcserver.studentList.forEach( (student) => {
        if (token === student.token) {
            tokenexists = true
        }
    });
    return tokenexists
}



