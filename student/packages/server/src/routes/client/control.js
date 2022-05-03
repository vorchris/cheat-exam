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
import config from '../../config.js'
import multiCastclient from '../../classes/multicastclient.js'
import axios from 'axios'
import nodenotify  from 'node-notifier'
import ip from 'ip'
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
 
    await axios.get(`https://${serverip}:${config.serverApiPort}/server/control/registerclient/${servername}/${pin}/${clientname}/${clientip}/${version}`)
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
    }).catch(err => {
        //we return the servers error message to the ui
        console.log(err.message)
        return res.json({ sender: "client", message:err.message , status:"error" })
        
    })
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