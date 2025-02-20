import dotenv from 'dotenv'

// Lade die env Datei
dotenv.config({ path: './electron-builder.env' });


const config = {

    development: process.env.DEVELOPMENT,
    showdevtools: process.env.DEVELOPMENT,

    bipIntegration: true,
   
    workdirectory : "",   // set by server.js (desktop path + examdir)
    tempdirectory : "",   // set by server.js (desktop path + 'tmp')
    serverdirectory: "EXAM-TEACHER",

    serverApiPort:22422,  //this must be reachable at the teachers machine otherwise nothing is going to work
    multicastClientPort: 6024,  //needed for exam autodiscovery by the student
    multicastServerClientPort: 6025,   // needed to find other exams in the network with the same name and prevent using the same exam name twice (confusion alert)

    multicastServerAdrr: '239.255.255.250',
    hostip: "0.0.0.0",
    gateway: true,
    examServerList: {},
    accessToken: false,
    version: process.env.VERSION + '-' + process.env.BUILD_NUMBER,
    buildforWEB: false,
    info: process.env.DEVELOPMENT === 'true' ? 'DEV' : 'LTS'
  
}
export default config
