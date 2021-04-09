const uuid = require('uuid');
 
const SRC_PORT = 6025;
const PORT = 6024;
const MULTICAST_ADDR = '239.255.255.250';
const dgram = require('dgram');
const server = dgram.createSocket("udp4");

let multicastInterval = null;


server.bind(SRC_PORT, function () {         // Add the HOST_IP_ADDRESS for reliability
    multicastInterval = setInterval(multicastNew, 2000);
});


let message =  { 
    servername: "testserver", 
    pin: "2344",
    timestamp: 0,
    id: uuid.v4()
}

function multicastNew() {
    
    message.timestamp =  new Date().getTime();
    preparedMessage = JSON.stringify(message);
    
    server.send(preparedMessage, 0, preparedMessage.length, PORT, MULTICAST_ADDR, function () {
        console.log(`Sent ${JSON.stringify(message)}`);
    });
}
