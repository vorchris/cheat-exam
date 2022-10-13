import pjson from "../../../package.json"


const config = {
    development: true,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    showdevtools:true,

    version: pjson.version,
    workdirectory : "",   // set by server.js (desktop path + examdir)
    tempdirectory : "",   // set by server.js (desktop path + 'tmp')
   
    examdirectory: "EXAM-STUDENT",
    serverApiPort:22422,
    clientApiPort:11411,
    clientVitePort:3001,
    serverVitePort:3002,
    multicastClientPort: 6024,
    hostip: "",       // server.js
    electron: false,
    virtualized: false
}
export default config
