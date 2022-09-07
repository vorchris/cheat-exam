import dgram from 'dgram';
import config from '../config.js';  // node not vue (relative path needed)

/**
 * Starts a dgram (udp) socket that listens for mulitcast messages
 */
class MulticastClient {
    constructor () {
        this.PORT = config.multicastServerClientPort
        this.MULTICAST_ADDR = '239.255.255.250'
        this.client = dgram.createSocket('udp4')
        this.examServerList = []
        this.refreshExamsIntervall = null
    }

    /**
     * receives messages and stores new exam instances in this.examServerList[]
     * starts an intervall to check server status by timestamp
     */
    init () {
        this.client.bind(this.PORT, '0.0.0.0', () => { 
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
