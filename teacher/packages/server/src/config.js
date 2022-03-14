const config = {
    development: true,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    workdirectory : "/home/student/SHARE",
    tempdirectory : "/tmp",
    publicdirectory: "public/files/",
    serverApiPort:22422,
    clientApiPort:11411,  // according to wikipedia and IANA no other service uses this port.. so this is ours ;)
    clientVitePort:3001,
    serverVitePort:3002,
    multicastClientPort: 6024,
    hostip: "0.0.0.0",
    examServerList: {},
    clientinfo: {}
}
export default config
