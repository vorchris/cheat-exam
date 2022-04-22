import { v4 } from 'uuid'
import { createSocket } from 'dgram'
import config from '../config.js'
import ip from 'ip'

/**
 * Starts a dgram (udp) socket that broadcasts information about this server
 */
class MulticastServer {
    constructor () {
        this.SRC_PORT = 0  // in order to allow several multicast servers (more exams on the same machine) this port needs to be set dynamically
        this.ClientPORT = config.multicastClientPort
        this.MULTICAST_ADDR = config.multicastServerAdrr
        this.server = null
        this.serverinfo = null
        this.broadcastInterval = null
        this.running = false
        this.studentList = []
        this.serverStatusObject = { 
            exammode : false,
            examtype : 'language',
            delfolder: false
        }
    }

    /**
     * sets up an intervall to send serverinfo every 2 seconds
     * @param servername the given name of the server (for example "math")
     * @param pin the pin needed to register as student
     */
    init (servername, pin, password) {
        this.server = createSocket('udp4')
        this.serverinfo = this.initMessage(servername, pin, password)
        this.server.bind(this.SRC_PORT, () => { // Add the HOST_IP_ADDRESS for reliability
            this.broadcastInterval = setInterval(() => { this.multicastNew() }, 2000)
            console.log(`UDP MC Server listening on http://${config.hostip}:${this.server.address().port}`)
        })
    }

    /**
     * creates the message object
     */
    initMessage (servername, pin, password) {
        const message = {
            servername: servername,   //should be unique if several servers are allowed
            pin: pin,
            password: password,
            timestamp: 0,
            id: v4(),
            ip: ip.address(),
            servertoken: `server-${v4()}`
        }
        return message
    }

    /**
     * updates the server timestamp and actually broadcasts the message (serverinfo)
     */
    multicastNew () {
        this.serverinfo.timestamp = new Date().getTime()
        let message = {
            servername: this.serverinfo.servername,
            timestamp: this.serverinfo.timestamp,
            id: this.serverinfo.id,
            ip: this.serverinfo.ip
        }
        const preparedMessage = JSON.stringify(message)
        //broadcast to clients
        this.server.send(preparedMessage, 0, preparedMessage.length, this.ClientPORT, this.MULTICAST_ADDR)
        //broadcast to other server(clients)
        this.server.send(preparedMessage, 0, preparedMessage.length, config.multicastServerClientPort, this.MULTICAST_ADDR)
    }
}

export default MulticastServer
