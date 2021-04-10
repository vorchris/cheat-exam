const uuid = require('uuid');
const dgram = require('dgram');

class MulticastServer{
    
    constructor(){
        this.SRC_PORT = 6025;
        this.PORT = 6024;
        this.MULTICAST_ADDR = '239.255.255.250';
        this.server = dgram.createSocket('udp4');

        this.address = "0.0.0.0";
        this.broadcastIntervall = null;
        this.serverinfo = this.initMessage();
        this.running = false;
    }

    init(){
        this.server.bind(this.SRC_PORT, () => {         // Add the HOST_IP_ADDRESS for reliability
            this.broadcastIntervall = setInterval( () => { this.multicastNew() }, 2000);
        })
       
        this.running = true;
     
    }


    initMessage(){
        let message =  { 
            servername: "testserver", 
            pin: "2344",
            timestamp: 0,
            id: uuid.v4()
        }
        return message;
    }



     multicastNew() {
        
        this.serverinfo.timestamp =  new Date().getTime();
        let preparedMessage = JSON.stringify(this.serverinfo);
        
        this.server.send(preparedMessage, 0, preparedMessage.length, this.PORT, this.MULTICAST_ADDR, function () {
            console.log(`Sent ${preparedMessage}`);
        })
    
    }
}


module.exports = new MulticastServer();

