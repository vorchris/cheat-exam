const uuid = require('uuid')
const dgram = require('dgram')
const config = require('../config')

/**
 * Starts a dgram (udp) socket that broadcasts information about this server
 */
class MulticastServer {
  constructor () {
    this.SRC_PORT = 6025
    this.PORT = 6024
    this.MULTICAST_ADDR = '239.255.255.250'
    this.server = dgram.createSocket('udp4')

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
  init (servername, pin) {
    this.serverinfo = this.initMessage(servername, pin)
    this.server.bind(this.SRC_PORT, () => { // Add the HOST_IP_ADDRESS for reliability
      this.broadcastIntervall = setInterval(() => { this.multicastNew() }, 2000)
    })
    this.running = true
    console.log('UDP Multicast Server broadcasting');
  }


  /**
   * creates the message object
   */
  initMessage (servername, pin) {
    const message = {
      servername: servername,
      pin: pin,
      timestamp: 0,
      id: uuid.v4()
    }
    return message
  }


  /**
   * updates the server timestamp and actually broadcasts the message (serverinfo)
   */
  multicastNew () {
    this.serverinfo.timestamp = new Date().getTime()
    const preparedMessage = JSON.stringify(this.serverinfo)
    this.server.send(preparedMessage, 0, preparedMessage.length, this.PORT, this.MULTICAST_ADDR, function () {
      if (config.debug) { console.log(`Sent ${preparedMessage}`) }
    })
  }
}

module.exports = new MulticastServer()
