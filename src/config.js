class Config  {
  constructor(){
    this.workdirectory = "/home/student/SHARE",
    this.tempdirectory = "/tmp",
    this.publicdirectory = "/public/files/",
    this. port = 3000,
    this.httpPort = 8000,
    this.multicastClientPort = 6024,
    this.hostip = "0.0.0.0",
    this.development = true,  // disable kiosk mode on exam mode and other stuff (autofill input fields)
    this.examServerList = { },
    this.multicastclient = null,
    this.clientinfo = {}
  }
}
export default new Config
