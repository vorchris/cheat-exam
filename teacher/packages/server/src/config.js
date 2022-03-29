const config = {
    workdirectory : "",   // set by main.ts and preload.ts
    tempdirectory : "",   // set by main.ts and preload.ts
    desktop : "",         // set by main.ts and preload.ts
    home : "",            // set by main.ts and preload.ts
    serverApiPort:22422,
    clientApiPort:11411,  // according to wikipedia and IANA no other service uses this port.. so this is ours ;)
    clientVitePort:3001,
    serverVitePort:3002,
    multicastClientPort: 6024,
    multicastServerClientPort: 6025,
    multicastServerAdrr: '239.255.255.250',
    hostip: "0.0.0.0",
    examServerList: {},
    development: true,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
  
}
export default config
