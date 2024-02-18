 <template> 
    <div id="mainmenubar">
       
        <div id="apphead" class="ps-2  bg-dark">

     
            <div v-if="online" class="header-item">
                <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style="float: left;" />
                <span class="fs-5 align-middle me-1" style="float: left;">{{clientname}}</span>
                <span class="fs-5 align-middle me-4 green" style="float: left;" >| {{$t('student.connected')}}</span> 
            </div>
            <div v-if="!online" class="header-item">
                <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style=" float: left;" />
                <span class="fs-5 align-middle me-1" style=" float: left;"> {{clientname}} </span>
                <span class="fs-5 align-middle me-4 red" style="float: left;"> | {{ $t("student.disconnected") }} </span>  
            </div>

            <div v-if="!online && exammode" class="header-item btn btn-success me-1 btn-sm" @click="reconnect()"><img src="/src/assets/img/svg/gtk-convert.svg" class="" width="22" height="20"> {{ $t("editor.reconnect")}}</div>
            <div v-if="!online && exammode" class="header-item btn btn-danger  me-1 btn-sm"  @click="gracefullyexit()"><img src="/src/assets/img/svg/dialog-cancel.svg" class="" width="22" height="20"> {{ $t("editor.unlock")}} </div>
            
            <div class="header-item fs-5" v-if="servername" style="margin: auto auto;">{{servername}}|{{pincode}}</div>


          
            <div class="header-item">
            <div v-if="battery && battery.level" style="font-size: 0.8rem;"> {{ battery.level*100}}%  </div>
            <div v-if="battery && battery.level" class="me-2">
                <img v-if="battery && battery.level > 0.9" src="/src/assets/img/svg/battery-100.svg"  :title="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.8 && battery.level < 0.9 " src="/src/assets/img/svg/battery-090.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.7 && battery.level < 0.8 " src="/src/assets/img/svg/battery-080.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.6 && battery.level < 0.7 " src="/src/assets/img/svg/battery-070.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.5 && battery.level < 0.6 " src="/src/assets/img/svg/battery-060.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.4 && battery.level < 0.5 " src="/src/assets/img/svg/battery-050.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.3 && battery.level < 0.4 " src="/src/assets/img/svg/battery-040.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.2 && battery.level < 0.3 " src="/src/assets/img/svg/battery-030.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level > 0.1 && battery.level < 0.2 " src="/src/assets/img/svg/battery-020.svg" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" class="white" width="32" height="32" />
                <img v-if="battery && battery.level < 0.1" :title="battery.level*100+'%'" :alt="battery.level*100+'%'" src="/src/assets/img/svg/battery-010.svg" width="32" height="32" >
            </div>
            <div class="fs-5" style="width:90px;" :title="'Exam: '+timesinceentry" >{{currenttime}}</div>
            <div class="fs-5" >Microsoft365</div>
        </div>
        </div>

        <!-- filelist start - show local files from workfolder (pdf and gbb only)-->
        <div id="toolbar" class="p-1 pb-0">  

            <div class="btn btn-dark btn-sm shadow" style="float: left; vertical-align:middle;" @click="print()"><img src="/src/assets/img/svg/print.svg" class="" width="22" height="22" > </div>

            <div v-for="file in localfiles" class="d-inline">
                <div v-if="(file.type == 'pdf')" class="btn btn-secondary ms-2 mb-1 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="20" > {{file.name}} </div>
                <div v-if="(file.type == 'image')" class="btn btn-secondary ms-2 mb-1 btn-sm" @click="selectedFile=file.name; loadImage(file.name)"><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" style="vertical-align: top;"> {{file.name}} </div>

            </div>
        </div>
        <!-- filelist end -->
    </div>
 

    <div id="content">
        <!-- angabe/pdf preview start -->
        <div id=preview class="fadeinslow p-4">
            <embed src="" id="pdfembed"/>
        </div>
        <!-- angabe/pdf preview end -->

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
    </div>

    <!-- 
    Microsoft 365 embeds it's editors into an iframe and activates strict content security. therfore it is not possible to inject 
    Javascript into the frame inside a frame like <iframe></iframe> <embed> or chromium <webview></webview>
    The only way to inject JS code is via the backend but only if we open the Microsoft365 page directly in the electron window (no sub-frames whatsoever)
    That's why we use electrons "BrowserView" feature to load 2 pages in 1 window. we present this page as "topmenu" and load the ms editors as "content" below. 
    This is actually the safest way to do this because of "ContextIsolation" no scripts from the loaded pages can interfere with the rest of the app
    -->


</template>

<script>
import moment from 'moment-timezone';

export default {
    data() {
        return {
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
            serverstatus: this.$route.params.serverstatus,
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0,
            currenttime: 0,
            now : new Date().getTime(),
            localfiles: null,
            battery: null,
            warning: false,
           
        }
    }, 
    components: {  },  
    mounted() {
        this.fetchInfo()
        this.currentFile = this.clientname
        this.entrytime = new Date().getTime()  

        ipcRenderer.on('denied', (event, why) => {  //print request was denied by teacher because he can not handle so much requests at once
            this.printdenied(why)
        }); 

        this.$nextTick(() => { // Code that will run only after the entire view has been rendered
            this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)  
            this.clockinterval = setInterval(() => { this.clock() }, 1000)  
            this.loadfilelistinterval = setInterval(() => { this.loadFilelist() }, 10000)   // zeigt html dateien (angaben, eigene arbeit) im header
            this.loadFilelist()


            document.querySelector("#preview").addEventListener("click", function() {
                this.style.display = 'none';
                ipcRenderer.send('restore-browserview');
            });
        });
    },
    methods: { 
        reconnect(){
            ipcRenderer.send('collapse-browserview')

            this.$swal.fire({
                title: this.$t("editor.reconnect"),
                text:  this.$t("editor.info"),
                icon: 'info',
                input: 'number',
                inputLabel: "PIN",
                inputValue: this.pincode,
                inputValidator: (value) => {
                    if (!value) {return this.$t("student.nopin")}
                },
                didClose: () => { ipcRenderer.send('restore-browserview') }
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
                            didClose: () => { ipcRenderer.send('restore-browserview') }
                        })
                    }
                if (IPCresponse.status === "error") {
                    this.$swal.fire({
                        title: "Error",
                        text: IPCresponse.message,
                        icon: 'error',
                        showCancelButton: false,
                        didClose: () => { ipcRenderer.send('restore-browserview') }
                    })
                }
            })
        },
        gracefullyexit(){
            ipcRenderer.send('collapse-browserview')
            this.$swal.fire({
                title: this.$t("editor.exit"),
                text:  this.$t("editor.exitkiosk"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("editor.cancel"),
                reverseButtons: true,
                didClose: () => { ipcRenderer.send('restore-browserview') }
            })
            .then((result) => {
                if (result.isConfirmed) {
                    ipcRenderer.send('gracefullyexit')
                } 
            }); 
        },

        //send a printrequest to the teacher
        print(){
           //make sure to post print request to teacher for the latest work
           ipcRenderer.sendSync('sendPrintRequest') 
           ipcRenderer.send('collapse-browserview')

           this.$swal.fire({
                title: this.$t("editor.requestsent"),
                icon: "info",
                timer: 1500,
                timerProgressBar: true,
                didOpen: () => { this.$swal.showLoading(); },
                didClose: () => { ipcRenderer.send('restore-browserview') }
            })
        },
        // display print denied message and reason
        printdenied(why){
            console.log("Print request denied")
            ipcRenderer.send('collapse-browserview')
            this.$swal.fire({
                title: `${this.$t("editor.requestdenied")}`,
                icon: "info",
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => { this.$swal.showLoading() },
                didClose: () => {ipcRenderer.send('restore-browserview')  }
            })
        },


        // fetch file from disc - show preview
        loadPDF(file){
            ipcRenderer.send('collapse-browserview')

            let data = ipcRenderer.sendSync('getpdf', file )
            let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 

            const pdfEmbed = document.querySelector("#pdfembed");
            pdfEmbed.style.backgroundImage = '';
            pdfEmbed.style.height = "96vh";
            pdfEmbed.style.marginTop = "-48vh";


            document.querySelector("#pdfembed").setAttribute("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`);
            document.querySelector("#preview").style.display = 'block';
        },

        // fetch file from disc - show preview
        async loadImage(file){
            ipcRenderer.send('collapse-browserview')

            let data = await ipcRenderer.invoke('getpdfasync', file )
            let url =  URL.createObjectURL(new Blob([data], {type: "image/jpeg"})) 
            const pdfEmbed = document.querySelector("#pdfembed");
            pdfEmbed.style.backgroundImage = `url(${url})`;
            pdfEmbed.style.backgroundSize = 'contain'
            pdfEmbed.style.backgroundRepeat = 'no-repeat'
           
            pdfEmbed.style.height = "80vh";
            pdfEmbed.style.marginTop = "-40vh";
            pdfEmbed.setAttribute("src", '');
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

            if (!this.focus){
                this.warning = true 
                this.entrytime = new Date().getTime()
                ipcRenderer.send('collapse-browserview')
            }
            if (this.focus && this.warning){
                this.warning = false
                ipcRenderer.send('restore-browserview')
            }

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
@media print{
    #apphead, #mainmenubar {
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

#mainmenubar {
    height:94px;
    min-height:94px;
    max-height:94px;
}


#apphead, #toolbar {
    min-width: 840px;
}

#apphead {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    
    align-items: center;
    align-content: flex-start;
    z-index:10000 !important;
    color: #fff;
    padding: 10px;
}

.header-item {
    display: flex;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;
    order: 0;
    align-items: center;
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
