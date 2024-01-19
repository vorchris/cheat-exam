 <!-- 
    Made with GeoGebra https://www.geogebra.org
    License Information: 
        https://stage.geogebra.org/license#NonCommercialLicenseAgreement
        https://www.gnu.org/licenses/gpl-3.0.html

    This page allows you to use geogebra classic and geogebra suite in the context of next-exam 
    Some features of geogebra are hidden because of the restrictive nature of the digital exam environment
    Tracking features have been removed to comply with dsgvo regulations
  -->
 
 
 <template> 
    <div id="apphead" class="w-100 pt-2 ps-2 pe-2 text-white bg-dark text-center">

        <div v-if="online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style="float: left;" />
            <span class="fs-4 align-middle me-1" style="float: left;">{{clientname}}</span>
            <span class="fs-4 align-middle me-4 green" style="float: left;" >| {{ $t("student.connected") }}</span> 
        </div>

        <div v-if="!online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style=" float: left;" />
             <span class="fs-4 align-middle me-1" style=" float: left;"> {{clientname}} </span>
             <span class="fs-4 align-middle me-4 red" style="float: left;"> | {{ $t("student.disconnected") }} </span>  
        </div>

        <div v-if="!online && exammode" class="btn btn-success p-1 me-1 mb-1 btn-sm"  style="float: left;"  @click="reconnect()"><img src="/src/assets/img/svg/gtk-convert.svg" class="" width="22" height="22"> {{ $t("editor.reconnect")}}</div>
        <div v-if="!online && exammode" class="btn btn-danger p-1 me-1 mb-1 btn-sm"  style="float: left;"  @click="gracefullyexit()"><img src="/src/assets/img/svg/dialog-cancel.svg" class="" width="22" height="22"> {{ $t("editor.unlock")}} </div>
        <span  v-if="servername" class="fs-4 align-middle" style="">{{servername}}|{{pincode}}</span>

        <span class="fs-4 align-middle" style="float: right">GeoGebra</span>

        <div class="btn-group pt-0 ms-4 me-2 mt-1" role="group" style="float: right">
            <div class="btn btn-outline-info btn-sm" @click="setsource('suite')"> suite</div>
            <div class="btn btn-outline-info btn-sm" @click="setsource('classic')"> classic</div>
        </div>
        
        <span class="fs-4 align-middle me-2" style="float: right; width:120px;">{{timesinceentry}}</span>
        <span v-if="battery && battery.level" class="fs-4 me-3"  style="float: right;">
            <img v-if="battery && battery.level > 0.9" src="/src/assets/img/svg/battery-100.svg"  :title="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.8 && battery.level < 0.9 " src="/src/assets/img/svg/battery-090.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.7 && battery.level < 0.8 " src="/src/assets/img/svg/battery-080.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.6 && battery.level < 0.7 " src="/src/assets/img/svg/battery-070.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.5 && battery.level < 0.6 " src="/src/assets/img/svg/battery-060.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.4 && battery.level < 0.5 " src="/src/assets/img/svg/battery-050.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.3 && battery.level < 0.4 " src="/src/assets/img/svg/battery-040.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.2 && battery.level < 0.3 " src="/src/assets/img/svg/battery-030.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level > 0.1 && battery.level < 0.2 " src="/src/assets/img/svg/battery-020.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
            <img v-if="battery && battery.level < 0.1" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" src="/src/assets/img/svg/battery-010.svg" class=" align-middle me-0" width="32" height="32" style="margin-bottom:3px;" />
        </span>
    </div>


    <!-- filelist start - show local files from workfolder (pdf and gbb only)-->
    <div id="toolbar" class="d-inline p-1 pb-0">  
        <button title="backup" @click="saveContent(true); " class="btn  d-inline btn-success p-1 ms-2 mb-1 btn-sm"><img src="/src/assets/img/svg/document-save.svg" class="white" width="22" height="22" ></button>
        <button title="delete" @click="clearAll(); " class="btn  d-inline btn-danger p-1 ms-2 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-delete.svg" class="white" width="22" height="22" ></button>
        <button title="paste" @click="copyClipboard(); " class="btn  d-inline btn-secondary p-1 ms-2 mb-1 btn-sm"><img src="/src/assets/img/svg/edit-paste-style.svg" class="white" width="22" height="22" ></button>

        
        <div v-for="file in localfiles" class="d-inline">
            <div v-if="(file.type == 'pdf')" class="btn btn-secondary ms-2 mb-1 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
            <div v-if="(file.type == 'ggb')" class="btn btn-info ms-2 mb-1  btn-sm" @click="selectedFile=file.name; loadGGB(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
        </div>
    </div>
    <!-- filelist end -->
    


    
    <!-- angabe/pdf preview start -->
    <div id=preview class="fadeinslow p-4">
        <embed src="" id="pdfembed"/>
    </div>
    <!-- angabe/pdf preview end -->
   


    <div id="content">
          <!-- focus warning start -->
          <div v-if="!focus" class="focus-container">
            <div id="focuswarning" class="infodiv p-4 d-block focuswarning" >
                <div class="mb-3 row">
                    <div class="mb-3 "> {{$t('editor.leftkiosk')}} <br> {{$t('editor.tellsomeone')}} </div>
                    <img src="/src/assets/img/svg/eye-slash-fill.svg" class=" me-2" width="32" height="32" >
                </div>
            </div>
        </div>
        <!-- focuswarning end  -->
        <iframe id="geogebraframe" src="./geogebra/classic.html"></iframe>
    </div>
</template>

<script>




export default {
    data() {
        return {
            online: true,
            focus: true,
            exammode: false,
            currentFile:null,
            fetchinterval: null,
            fetchinfointerval: null,
            loadfilelistinterval: null,
            clockinterval: null,
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
            serverip: this.$route.params.serverip,
            token: this.$route.params.token,
            clientname: this.$route.params.clientname,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            
            electron: this.$route.params.electron,
            pincode : this.$route.params.pincode,
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0,
            now : new Date().getTime(),
            localfiles: null,
            battery: null,
            customClipboard: []
        }
    }, 
    components: {  },  
    mounted() {

        const ggbIframe = document.getElementById('geogebraframe');
        const iframeWindow = ggbIframe.contentWindow;  // Zugriff auf den Kontext des iframe
        const originalIframeConsoleLog = iframeWindow.console.log;  // Speichern der originalen console.log Funktion des iframe

        iframeWindow.console.log = (message) => {
            // Prüfen, ob die Nachricht ein GeoGebra-spezifisches Muster enthält
            if (typeof message === "string" && message.includes("existing")) {
                const partAfterExistingGeo = message.split("existing geo:")[1].trim();
                const extractedText = partAfterExistingGeo.split("=")[1].trim();
                this.customClipboard.push( extractedText )
                if (this.customClipboard.length > 10) {    this.customClipboard.shift();     }   //customclipboard länge begrenzen
            } 
            else {
                // geogebra spammed jede aktion in die console daher unterdrücken wir das erstmal
                //originalIframeConsoleLog.apply(iframeWindow.console, arguments);      // Aufrufen der ursprünglichen Funktion für alle anderen Nachrichten
            }
        };

        this.currentFile = this.clientname
        this.entrytime = new Date().getTime()  
         
        if (this.electron){
            this.saveEvent = ipcRenderer.on('save', () => {  //trigger document save by signal "save" sent from data.js
                console.log("EVENT RECEIVERD")
                this.saveContent() 
            }); 
        }
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            this.fetchinterval = setInterval(() => { this.saveContent() }, 20000)   
            this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)  
            this.clockinterval = setInterval(() => { this.clock() }, 1000)  
            this.loadfilelistinterval = setInterval(() => { this.loadFilelist() }, 10000)   // zeigt html dateien (angaben, eigene arbeit) im header
            this.loadFilelist()

            //add eventlisteners only once
            document.querySelector("#preview").addEventListener("click", function() { this.style.display = 'none';  });
        })
    },
    methods: { 

     reconnect(){
            this.$swal.fire({
                title: this.$t("editor.reconnect"),
                text:  this.$t("editor.info"),
                icon: 'info',
                input: 'number',
                inputLabel: "PIN",
                inputValue: this.pincode,
                inputValidator: (value) => {
                    if (!value) {return this.$t("student.nopin")}
                }
            }).then((input) => {
                this.pincode = input.value
                if (!input.value) {return}
                let IPCresponse = ipcRenderer.sendSync('register', {clientname:this.clientname, servername:this.servername, serverip: this.serverip, pin:this.pincode })
                console.log(IPCresponse)
                this.token = IPCresponse.token  // set token (used to determine server connection status)

                if (IPCresponse.status === "success") {
                        this.$swal.fire({
                            title: "OK",
                            text: this.$t("student.registeredinfo"),
                            icon: 'success',
                            showCancelButton: false,
                        })
                    }
                if (IPCresponse.status === "error") {
                    this.$swal.fire({
                        title: "Error",
                        text: IPCresponse.message,
                        icon: 'error',
                        showCancelButton: false,
                    })
                }
            })
        },
        gracefullyexit(){
            this.$swal.fire({
                title: this.$t("editor.exit"),
                text:  this.$t("editor.exitkiosk"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("editor.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    ipcRenderer.send('gracefullyexit')
                } 
            }); 
        },

        // fetch file from disc - show preview
        async loadPDF(file){
            let data = await ipcRenderer.invoke('getpdfasync', file )
            let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 

            document.querySelector("#pdfembed").setAttribute("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`);
            document.querySelector("#preview").style.display = 'block';

        },
        async loadFilelist(){
            let filelist = await ipcRenderer.invoke('getfilesasync', null)
            this.localfiles = filelist;
        },
        setsource(source){
            let iFrame = document.getElementById('geogebraframe')
            if (source === "suite")   { iFrame.src = `./geogebra/suite.html`  }
            if (source === "classic") { iFrame.src = `./geogebra/classic.html`}
            iFrame.parentNode.replaceChild(iFrame.cloneNode(), iFrame);
        },  
        clock(){
            this.now = new Date().getTime()
            this.timesinceentry =  new Date(this.now - this.entrytime).toISOString().substr(11, 8)
        },  
        async fetchInfo() {
            let getinfo = await ipcRenderer.invoke('getinfoasync')   // we need to fetch the updated version of the systemconfig from express api (server.js)
            
            this.clientinfo = getinfo.clientinfo;
            this.token = this.clientinfo.token
            this.focus = this.clientinfo.focus
            this.clientname = this.clientinfo.name
            this.exammode = this.clientinfo.exammode
            this.pincode = this.clientinfo.pin

            if (!this.focus){  this.entrytime = new Date().getTime()}
            if (this.clientinfo && this.clientinfo.token){  this.online = true  }
            else { this.online = false  }

         
            this.battery = await navigator.getBattery().then(battery => { return battery })
            .catch(error => { console.error("Error accessing the Battery API:", error);  });


        }, 
        copyClipboard(){
            const ggbIframe = document.getElementById('geogebraframe');
            const ggbApplet = ggbIframe.contentWindow.ggbApplet;   // get the geogebra applet and all of its methods
            
            console.log(this.customClipboard[this.customClipboard.length-1])
            ggbApplet.evalCommand(this.customClipboard[this.customClipboard.length-1]);
        },

        clearAll(){
            const ggbIframe = document.getElementById('geogebraframe');
            const ggbApplet = ggbIframe.contentWindow.ggbApplet;   // get the geogebra applet and all of its methods
            this.$swal({
                title: "",
                text: this.$t("math.clear") ,
                showCancelButton: true,
                inputAttributes: {
                    maxlength: 20,
                },
                confirmButtonText: 'Ok',
                cancelButtonText: this.$t("editor.cancel")
         
             })
            .then((result) => {
                if (result.isConfirmed) { 
                    ggbApplet.reset()
                }
                else {return; }
            });
        },

         /** Saves Content as GGB */
        async saveContent(manual) {  
            const ggbIframe = document.getElementById('geogebraframe');
            const ggbApplet = ggbIframe.contentWindow.ggbApplet;   // get the geogebra applet and all of its methods
            let filename = `${this.clientname}.ggb`
            if (manual){ 
                await this.$swal({
                    title: this.$t("math.filename") ,
                    input: 'text',
                    inputPlaceholder: 'Type here...',
                    showCancelButton: true,
                    inputAttributes: {
                        maxlength: 20,
                    },
                    confirmButtonText: 'Ok',
                    cancelButtonText: this.$t("editor.cancel"),
                    inputValidator: (value) => {
                        const regex = /^[A-Za-z0-9]+$/;
                        if (!value.match(regex)) {
                            return  this.$t("math.nospecial") ;
                        }                   
                     },
                 }).then((result) => {
                    if (result.isConfirmed) { filename = `${result.value}-bak.ggb`}
                    else {return; }
                });
            }
            
            ggbApplet.getBase64( async (base64GgbFile) => {
                let response = await ipcRenderer.invoke('saveGGB', {filename: filename, content: base64GgbFile})   // send base64 string to backend for saving
                if (response.status === "success" && manual){  // we wait for a response - only show feed back if manually saved
                    this.loadFilelist()
                    this.$swal.fire({
                        title: this.$t("editor.saved"),
                        text: filename,
                        icon: "info"
                    })
                }
            })
        },



        // get file from local workdirectory and replace editor content with it
        async loadGGB(file){
            this.$swal.fire({
                title: this.$t("editor.replace"),
                html:  `${this.$t("editor.replacecontent1")} <b>${file}</b> ${this.$t("editor.replacecontent2")}`,
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("editor.cancel"),
                reverseButtons: true
            })
            .then(async (result) => {
                if (result.isConfirmed) {

                    const result = await ipcRenderer.invoke('loadGGB', file);
                    if (result.status === "success") {
                        const base64GgbFile = result.content;
                        const ggbIframe = document.getElementById('geogebraframe');
                        const ggbApplet = ggbIframe.contentWindow.ggbApplet;
                        ggbApplet.setBase64(base64GgbFile);
                    } else {
                        console.error('Error loading file');
                    }
                } 
            }); 
        },




       
    },
    beforeUnmount() {
        clearInterval( this.fetchinterval )
        clearInterval( this.fetchinfointerval )
        clearInterval( this.clockinterval )
        clearInterval( this.loadfilelistinterval )
    },
}
</script>

<style scoped>

#suiteAppPicker {
visibility: visible !important;
}

@media print{
    #apphead {
        display: none !important;
    }
    #content {
        height: 100vh !important;
        width: 100vw !important;
        border-radius:0px !important;
    }
    #geogebraframe{
        height: 100% !important;
        width: 100% !important;
    }
    #app {
        display:block !important;
        height: 100% !important;
       
    }
    ::-webkit-scrollbar {
        display: none;
    }
}



#localfiles {
    position: relative;
   

}
#preview {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:100000;
}

#pdfembed { 
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -30vw;
    margin-top: -45vh;
    width:60vw;
    height: 90vh;
    padding: 10px;
    background-color: rgba(255, 255, 255, 1);
    border: 0px solid rgba(255, 255, 255, 0.589);
    box-shadow: 0 0 15px rgba(22, 9, 9, 0.589);
    padding: 10px;
    border-radius: 6px;
}

</style>
