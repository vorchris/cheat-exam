 <template> 
    <div id="mainmenubar">
        <div id="apphead" class="w-100 pt-2 ps-2 pe-2 mb-1 text-white bg-dark text-center">

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

            <span class="fs-4 align-middle" style="float: right">Microsoft365</span>

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
        <div id="toolbar" class="p-1 pb-0">  

            <div class="btn btn-dark btn-sm shadow" style="float: left; vertical-align:middle;" @click="print()"><img src="/src/assets/img/svg/print.svg" class="" width="22" height="22" > </div>

            <div v-for="file in localfiles" class="d-inline">
                <div v-if="(file.type == 'pdf')" class="btn btn-secondary ms-2 mb-1 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
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
         <div v-if="!focus" id="" class="infodiv p-4 d-block focuswarning" >
            <div class="mb-3 row">
                <div class="mb-3 "> {{$t('editor.leftkiosk')}} <br> {{$t('editor.tellsomeone')}} </div>
                <img src="/src/assets/img/svg/eye-slash-fill.svg" class=" me-2" width="32" height="32" >
            </div>
        </div>
        <!-- focus warning end -->
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
import $ from 'jquery'

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
            now : new Date().getTime(),
            localfiles: null,
            battery: null,
           
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
            $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
            $("#preview").css("display","block");
            $("#preview").click(function(e) {
                    $("#preview").css("display","none");
                    ipcRenderer.send('restore-browserview')
            }); 
        },
        loadFilelist(){
            let filelist = ipcRenderer.sendSync('getfiles', null)
            this.localfiles = filelist;
        },
        clock(){
            this.now = new Date().getTime()
            this.timesinceentry =  new Date(this.now - this.entrytime).toISOString().substr(11, 8)
        },  
        async fetchInfo() {
            let getinfo = ipcRenderer.sendSync('getinfo')  // we need to fetch the updated version of the systemconfig from express api (server.js)
            
            this.clientinfo = getinfo.clientinfo;
            this.token = this.clientinfo.token
            this.focus = this.clientinfo.focus
            this.clientname = this.clientinfo.name
            this.exammode = this.clientinfo.exammode
            this.pincode = this.clientinfo.pin

            if (!this.focus){  this.entrytime = new Date().getTime()}
            if (this.clientinfo && this.clientinfo.token){  this.online = true  }
            else { this.online = false  }

            this.battery = await navigator.getBattery();
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
