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
    this.MULTICAST_ADDR = '239.255.255.250'
    this.server = createSocket('udp4')
    this.serverinfo = null
    this.address = '0.0.0.0'
    this.broadcastInterval = null
    this.running = false
    this.studentList = []
  }

  /**
   * sets up an intervall to send serverinfo every 2 seconds
   * @param servername the given name of the server (for example "math")
   * @param pin the pin needed to register as student
   */
  init (servername, pin, password) {
    this.serverinfo = this.initMessage(servername, pin, password)
    this.server.bind(this.SRC_PORT, () => { // Add the HOST_IP_ADDRESS for reliability
      this.broadcastInterval = setInterval(() => { this.multicastNew() }, 2000)
      let address = this.server.address()
      console.log(`UDP Multicast Server Broadcasting on Port: ${address.port }` );
    })
   

    //this.running = true
   
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
    this.server.send(preparedMessage, 0, preparedMessage.length, this.ClientPORT, this.MULTICAST_ADDR, function () {   })
  }
}

export default MulticastServer
