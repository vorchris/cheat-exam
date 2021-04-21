const dgram = require('dgram')
const config = require('../config')
const ip = require('ip')

class MulticastClient {
  constructor () {
    this.PORT = 6024
    this.MULTICAST_ADDR = '239.255.255.250'
    this.client = dgram.createSocket('udp4')
    this.examServerList = []
    this.address = '0.0.0.0'
    this.refreshExamsIntervall = null
    this.debug = config.debug
    this.clientinfo = {
      name: '',
      token: '',
      ip: '',
      server: ''
    }
  }

  init () {
    this.client.on('listening', () => { this.getAddress() })
    this.client.on('message', (message, rinfo) => { this.messageReceived(message, rinfo) })
    // Add the HOST_IP_ADDRESS for reliability
    this.client.bind(this.PORT, () => { this.client.addMembership(this.MULTICAST_ADDR) })

    this.refreshExamsIntervall = setInterval(() => {
      this.isDeprecatedInstance()
    }, 5000)
    this.running = true
  }

  async getAddress () {
    this.clientinfo.ip = ip.address()
    this.address = this.client.address()
    console.log(`UDP Multicast Client listening on localhost:${this.address.port}`)
  }

  messageReceived (message, rinfo) {
    const serverInfo = JSON.parse(String(message))
    serverInfo.serverip = rinfo.address
    serverInfo.serverport = rinfo.port
    if (this.debug) { console.log(serverInfo) }

    this.addOrUpdateServer(serverInfo)
  }

  addOrUpdateServer (serverInfo) {
    if (this.isNewExamInstance(serverInfo)) {
      console.log(`Adding new Exam Instance "${serverInfo.servername}" to Serverlist`)
      this.examServerList.push(serverInfo)
    }
  }

  isNewExamInstance (obj) {
    for (let i = 0; i < this.examServerList.length; i++) {
      if (this.examServerList[i].id === obj.id) {
        if (this.debug) { console.log('existing server - updating timestamp') }
        this.examServerList[i].timestamp = obj.timestamp // existing server - update timestamp
        return false
      }
    }
    return true
  }

  isDeprecatedInstance () {
    for (let i = 0; i < this.examServerList.length; i++) {
      const now = new Date().getTime()
      if (now - 60000 > this.examServerList[i].timestamp) {
        console.log('found old server')
        // remove from list .. this server is dead
        this.examServerList.splice(i, 1)
      }
    }
  }
}

module.exports = new MulticastClient()
