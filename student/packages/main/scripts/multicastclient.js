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


import dgram from 'dgram';
import config from '../config.js';  // node not vue (relative path needed)

/**
 * STORES ALL CLIENT/Server INFORMATION
 * Starts a dgram (udp) socket that listens for mulitcast messages
 */

class MulticastClient {
    constructor () {
        this.PORT = config.multicastClientPort
        this.MULTICAST_ADDR = '239.255.255.250'
        this.client = dgram.createSocket('udp4')
       
        this.refreshExamsIntervall = null
        this.updateStudentIntervall = null
        this.beaconsLost = 0

        this.examServerList = []
        this.clientinfo = {
            name: "DemoUser",
            token: false,
            ip: false,
            hostname: false,
            serverip: false,
            servername: false,
            focus: true,
            exammode: false,
            timestamp: false,
            virtualized: false,  // this config setting is set by simplevmdetect.js (electron preload)
            examtype : false,
            pin: false,
            screenlock: false,
            msofficeshare: false,
            screenshotinterval: 4000   //milliseconds
        }
    }

    /**
     * receives messages and stores new exam instances in this.examServerList[]
     * starts an intervall to check server status and reacts on information given by the server instance
     */
    init () {
        this.client.bind(this.PORT, '0.0.0.0',  () => { 
            this.client.setBroadcast(true)
            this.client.setMulticastTTL(128); 
            this.client.addMembership(this.MULTICAST_ADDR)
            console.log(`UDP MC Client listening on http://${config.hostip}:${this.client.address().port}`)
        })
        
        this.client.on('message', (message, rinfo) => { this.messageReceived(message, rinfo) })
        //start loops
        this.refreshExamsIntervall = setInterval(() => {  this.isDeprecatedInstance()  }, 5000)
    }

    /**
     * receives messages and stores new exam instances in this.examServerList[]
     */
     messageReceived (message, rinfo) {
        const serverInfo = JSON.parse(String(message))
        serverInfo.serverip = rinfo.address
        serverInfo.serverport = rinfo.port
        serverInfo.reachable = true
        
        if (this.isNewExamInstance(serverInfo)) {
            console.log(`Adding new Exam Instance "${serverInfo.servername}" to Serverlist`)
            this.examServerList.push(serverInfo)
        }
    }

    /**
     * checks if the message came from a new exam instance or an old one that is already registered
     */
    isNewExamInstance (obj) {
        for (let i = 0; i < this.examServerList.length; i++) {
            if (this.examServerList[i].id === obj.id) {
                //console.log('existing server - updating timestamp')
                this.examServerList[i].timestamp = obj.timestamp // existing server - update timestamp
                return false
            }
        }
        return true
    }

    /**
     * checks servertimestamp and removes server from list if older than 1 minute
     */
    isDeprecatedInstance () {
        for (let i = 0; i < this.examServerList.length; i++) {
            const now = new Date().getTime()
            if (now - 16000 > this.examServerList[i].timestamp) {
                console.log('Removing inactive server from list')
                this.examServerList.splice(i, 1)
            }
        }
    }
}

export default new MulticastClient()
