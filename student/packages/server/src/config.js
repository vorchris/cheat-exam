const config = {
    workdirectory : "",   // set by main.ts and preload.ts
    tempdirectory : "",   // set by main.ts and preload.ts
    desktop : "",         // set by main.ts and preload.ts
    home : "",            // set by main.ts and preload.ts
    serverApiPort:22422,
    clientApiPort:11411,
    clientVitePort:3001,
    serverVitePort:3002,
    multicastClientPort: 6024,
    hostip: "",       // server.js
    development: true,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    electron: false,
    virtualized: false
}
export default config
