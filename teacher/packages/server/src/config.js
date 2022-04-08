import pjson from "../../../package.json"

const config = {
    version: pjson.version,
    workdirectory : "",   // set by server.js (desktop path + examdir)
    tempdirectory : "",   // set by server.js (desktop path + 'tmp')
    desktop : "",         // set by server.js 
    home : "",            // set by server.js
    examdirectory: "EXAM-TEACHER",
    serverApiPort:22422,
    clientApiPort:11411,  // according to wikipedia and IANA no other service uses this port.. so this is ours ;)
    clientVitePort:3001,
    serverVitePort:3002,
    multicastClientPort: 6024,
    multicastServerClientPort: 6025,
    multicastServerAdrr: '239.255.255.250',
    hostip: "0.0.0.0",
    examServerList: {},
    development: false,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
  
}
export default config
