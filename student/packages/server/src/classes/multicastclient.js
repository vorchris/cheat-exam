import dgram from 'dgram';
import config from '../config.js';  // node not vue (relative path needed)
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs'; 
import path from 'path';
import screenshot from 'screenshot-desktop';

/**
 * Starts a dgram (udp) socket that listens for mulitcast messages
 */
class MulticastClient {
  constructor () {
    this.PORT = config.multicastClientPort
    this.MULTICAST_ADDR = '239.255.255.250'
    this.client = dgram.createSocket('udp4')
    this.examServerList = []
    this.address = '0.0.0.0'
    this.refreshExamsIntervall = null
    this.browser = false
    this.clientinfo = {
      name: "Demouser",
      token: false,
      ip: false,
      serverip: false,
      servername: false,
      focus: true,
      exammode: false,
      timestamp: false
    }
  }

  /**
   * receives messages and stores new exam instances in this.examServerList[]
   * starts an intervall to check server status by timestamp
   */
  init () {
    config.clientinfo = this.clientinfo
    this.client.on('listening', () => { this.getAddress() })
    this.client.on('message', (message, rinfo) => { this.messageReceived(message, rinfo) })
    // Add the HOST_IP_ADDRESS for reliability
    this.client.bind(this.PORT, () => { this.client.addMembership(this.MULTICAST_ADDR) })
   
    //start loops
    this.refreshExamsIntervall = setInterval(() => {  this.isDeprecatedInstance()  }, 5000)
    this.updateStudentIntervall = setInterval(() => { this.sendBeacon() }, 5000)
    this.running = true
  }

  //sets IP for client and sends a message to console
  async getAddress () {
    this.address = this.client.address()
    console.log(`UDP MC Client listening on http://${config.hostip}:${this.address.port}`)
  }


  /** 
   * sends heartbeat to registered server and updates screenshot on server 
   */
  async sendBeacon(){
    //check if server connected - get ip
    if (this.clientinfo.serverip) {
    
      //create screenshot
      let screenshotfilename = this.clientinfo.token +".jpg"
      let screenshotfilepath = path.join(config.tempdirectory, screenshotfilename);

      screenshot().then(async (img) => {
        //create formdata
        const formData = new FormData()
        
        if (config.electron){
            let blob =  new Blob( [ new Uint8Array(img).buffer], { type: 'image/jpeg' })
            formData.append(screenshotfilename, blob, screenshotfilename );
        }
        else {
            formData.append(screenshotfilename, img, screenshotfilename );
        }
        //update timestamp
        this.clientinfo.timestamp =  new Date().getTime()
        formData.append('clientinfo', JSON.stringify(this.clientinfo) );

        //post to /studentlist/update/:token
        axios({
          method: "post", 
          url: `http://${this.clientinfo.serverip}:${config.serverApiPort}/server/control/studentlist/update`, 
          data: formData, 
          headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
        })
        .then( response => {
          if (response.data && response.data.status === "error") {
            console.log(`MulticastClient: ${response.data.message}`)
            //remove server registration
            for (const [key, value] of Object.entries(this.clientinfo)) {
                this.clientinfo[key] = false   
            }
          }
        })
        .catch(error => {console.log(`MulticastClient: ${error}`) });  //on kick there is a racecondition that leads to a failed fetch here because values are already "false"

      }).catch((err) => {
        console.log(`MulticastClient: ${err}`)
      });
    }
  }


  /**
   * receives messages and stores new exam instances in this.examServerList[]
   * starts an intervall to check server status by timestamp
   */
  messageReceived (message, rinfo) {
    const serverInfo = JSON.parse(String(message))
    serverInfo.serverip = rinfo.address
    serverInfo.serverport = rinfo.port
    if (this.debug) { console.log(serverInfo) }

    this.addOrUpdateServer(serverInfo)
  }

  /**
   * adds server instance to list if server is new
   */
  addOrUpdateServer (serverInfo) {
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
        if (this.debug) { console.log('existing server - updating timestamp') }
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
      if (now - 60000 > this.examServerList[i].timestamp) {
        console.log('found old server')
        // remove from list .. this server is dead
        this.examServerList.splice(i, 1)
      }
    }
  }
}

export default new MulticastClient()
