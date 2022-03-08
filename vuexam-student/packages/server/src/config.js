const config = {
  workdirectory : "/home/student/SHARE",
  tempdirectory : "/tmp",
  publicdirectory: "public/files/",
  serverApiPort:22422,
  clientApiPort:11411,
  clientVitePort:3001,
  serverVitePort:3002,
  multicastClientPort: 6024,
  hostip: "0.0.0.0",
  development: true,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
  examServerList: {},
  clientinfo: {},
  electron: false
}
export default config
