 <template> 

    <!-- HEADER START -->
    <exam-header
    :online="online"
    :clientname="clientname"
    :exammode="exammode"
    :servername="servername"
    :pincode="pincode"
    :battery="battery"
    :currenttime="currenttime"
    :timesinceentry="timesinceentry"
    :componentName="componentName"
    @reconnect="reconnect"
    @gracefullyexit="gracefullyexit"
    ></exam-header>
    <!-- HEADER END -->


    <!-- filelist start - show local files from workfolder (pdf and gbb only)-->
    <div id="toolbar" class="d-inline p-1 pb-0">  
        <div v-for="file in localfiles" class="d-inline">
            <div v-if="(file.type == 'pdf')" class="btn btn-secondary ms-2 mb-1 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
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
        <webview id="gformswebview" autosize="on" :src="`https://docs.google.com/forms/d/e/${gformsTestId}/viewform`"></webview>

    </div>
</template>

<script>
import moment from 'moment-timezone';
import ExamHeader from '../components/ExamHeader.vue';


export default {
    data() {
        return {
            componentName: 'Forms',
            online: true,
            focus: true,
            exammode: false,
            currentFile:null,
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
            gformsTestId: this.$route.params.gformsTestId,
            serverstatus: this.$route.params.serverstatus,
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0,
            currenttime: 0,
            now : new Date().getTime(),
            localfiles: null,
            battery: null
        }
    }, 
    components: { ExamHeader },  
    mounted() {
        this.currentFile = this.clientname
        this.entrytime = new Date().getTime()  
         
        this.$nextTick(() => { // Code that will run only after the entire view has been rendered
            this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)  
            this.clockinterval = setInterval(() => { this.clock() }, 1000)  
            this.loadfilelistinterval = setInterval(() => { this.loadFilelist() }, 10000)   // zeigt html dateien (angaben, eigene arbeit) im header
            this.loadFilelist()
     
            const webview = document.getElementById('gformswebview');
            const shadowRoot = webview.shadowRoot;
            const iframe = shadowRoot.querySelector('iframe');
            if (iframe) { iframe.style.height = '100%'; }  // for some reason iframe height is only 200px
             
            webview.addEventListener('dom-ready', () => {
                if (config.showdevtools){ webview.openDevTools();   }
                webview.executeJavaScript(`
                    (() => {  // Anonyme Funktion für eigenen Scope sonst wird beim reload der page (absenden der form ) die variable erneut deklariert und failed
                        const formElement = document.querySelector('form'); // Finden des <form> Elements
                        const nextElement = formElement ? formElement.nextElementSibling : null;   //das element das wir ausblenden wollen hat keine id aber es kommt direkt nach der form
                        if (nextElement) { nextElement.style.display = 'none'; }
                        const element = document.querySelector('[aria-label="Problem an Google melden"]');  // Finden des Elements mit aria-label="Problem an Google melden"
                        if (element) { element.style.display = 'none'; }
                        const element2 = document.querySelector('[aria-label="Punktzahl ansehen"]');  // the button doesnt work anyways and doesnt make sense if questions have been answered with longtext
                        if (element2) { element2.style.display = 'none'; }
                    })();  // Sofortige Ausführung der anonymen Funktion
                `);
            });

            // Event abfangen, wenn eine Navigation beginnt
            webview.addEventListener('will-navigate', (event) => {
                if (!event.url.includes(this.serverstatus.gformsTestId)){   //we block everything except pages that contain the following keyword-combinations
                    console.log(event.url)
                    //check if this an exception (login, init) - if URL doesn't include either of these combinations - block! EXPLICIT is easier to read ;-)
                    if ( event.url.includes("docs.google.com") && event.url.includes("formResponse") )           { console.log(" url allowed") }
                    else if ( event.url.includes("docs.google.com") && event.url.includes("viewscore") )         { console.log(" url allowed") }
                    else {
                        console.log("blocked leaving exam mode")
                        webview.stop()
                    }
                }
                else {console.log("entered valid test environment")  }
            });

            // add eventlisteners only once
            document.querySelector("#preview").addEventListener("click", function() { this.style.display = 'none'; });

        });


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
        loadPDF(file){
            let data = ipcRenderer.sendSync('getpdf', file )
            let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
      
            document.querySelector("#pdfembed").setAttribute("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`);
            document.querySelector("#preview").style.display = 'block';

        },
        async loadFilelist(){
            let filelist = await ipcRenderer.invoke('getfilesasync', null)
            this.localfiles = filelist;
        },
        clock(){
            this.now = new Date().getTime()
            this.timesinceentry =  new Date(this.now - this.entrytime).toISOString().substr(11, 8)
            this.currenttime = moment().tz('Europe/Vienna').format('HH:mm:ss');
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
       
    },
    beforeUnmount() {
        clearInterval( this.fetchinfointerval )
        clearInterval( this.clockinterval )
        clearInterval( this.loadfilelistinterval )
    },
}
</script>

<style scoped>



#gformswebview{
    height: 100% !important;
    width: 100% !important;
    display: block;
    position: relative;
    top:0;
    left:0;
}

iframe{
    height: 100% !important;
    width: 100% !important;
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
