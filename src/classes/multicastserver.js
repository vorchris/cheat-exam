const uuid = require('uuid')
const dgram = require('dgram')
const config = require('../config')
const ip = require('ip')

/**
 * Starts a dgram (udp) socket that broadcasts information about this server
 */
class MulticastServer {
  constructor () {
    this.SRC_PORT = 6025  // in order to allow several multicast servers (more exams on the same machine) this port needs to be set dynamically
    this.PORT = 6024
    this.MULTICAST_ADDR = '239.255.255.250'
    this.server = dgram.createSocket('udp4')
    this.serverinfo = null
    this.address = '0.0.0.0'
    this.broadcastIntervall = null
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
      this.broadcastIntervall = setInterval(() => { this.multicastNew() }, 2000)
    })
    this.running = true

    console.log('UDP Multicast Server broadcasting');
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
      id: uuid.v4(),
      ip: ip.address(),
      token: `server-${uuid.v4()}`
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
    this.server.send(preparedMessage, 0, preparedMessage.length, this.PORT, this.MULTICAST_ADDR, function () {
      if (config.debug) { console.log(`Sent ${preparedMessage}`) }
    })
  }
}

module.exports = new MulticastServer()
