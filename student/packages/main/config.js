import dotenv from 'dotenv'



// Lade die env Datei
const env = dotenv.config({ path: './electron-builder.env' }).parsed;


const config = {
    development: env.DEVELOPMENT,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    showdevtools: env.DEVELOPMENT,
    bipIntegration: true,

    workdirectory : "",   // (desktop path + examdir)
    tempdirectory : "",   // (desktop path + 'tmp')
    homedirectory : "",   // set in main.ts
    examdirectory : "",    // set after registering in ipcHandler
    clientdirectory: "EXAM-STUDENT",

    serverApiPort:22422,  // this is needed to be reachable on the teachers pc for basic functionality
    multicastClientPort: 6024,  // only needed for exam autodiscovery

    multicastServerAdrr: '239.255.255.250',
    hostip: "",       // server.js
    gateway: true,
    electron: false,
    virtualized: false,
    version: env.VERSION + '-' + env.BUILD_NUMBER,
    info: env.DEVELOPMENT === 'true' ? 'DEV' : 'LTS'
}
export default config
