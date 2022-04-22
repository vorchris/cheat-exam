 <template> 
    <div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-center">

        <div v-if="online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style="float: left;" />
            <span class="fs-4 align-middle me-1" style="float: left;">{{clientname}}</span>
            <span class="fs-4 align-middle me-4 green" style="float: left;" >| {{ $t("student.connected") }}</span> 
        </div>

        <div v-if="!online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style=" float: left;" />
             <span class="fs-4 align-middle me-1" style=" float: left;"> {{clientname}} </span>
             <span class="fs-4 align-middle me-4 red" style="float: left;"> | {{ $t("student.disconnected") }} </span>  
            <button style="float: left;" @click="exit()" class="btn btn-outline-warning ">{{$t('math.exit')}} </button>
        </div>

        <!-- filelist start - show local files from workfolder (pdf only)-->
             <div v-for="file in localfiles" class="d-inline">
                <div v-if="(file.type == 'pdf')" class="btn btn-secondary me-2 btn-sm" @click="selectedFile=file.name; loadPDF(file.name)"><img src="/src/assets/img/svg/document-replace.svg" class="" width="22" height="22" > {{file.name}} </div>
            </div>
        <!-- filelist end -->

        <span class="fs-4 align-middle ms-2" style="">{{servername}}</span>
        <span class="fs-4 align-middle" style="float: right">GeoGebra</span>
        <!-- <div class="btn-group pt-0 ms-4 me-4" role="group" style="float: right">
            <div class="btn btn-outline-info" @click="setsource('geometry')"> geometry</div>
            <div class="btn btn-outline-info" @click="setsource('graphing')"> graphing</div>
        </div> -->
        <span class="fs-4 align-middle me-2" style="float: right">{{timesinceentry}}</span>
    </div>

    
    
    <!-- angabe/pdf preview start -->
    <div id=preview class="fadeinslow p-4">
        <embed src="" id="pdfembed"/>
    </div>
    <!-- angabe/pdf preview end -->
   


    <div id="content">
         <div v-if="!focus" id="" class="infodiv p-4 d-block focuswarning" >
            <div class="mb-3 row">
                <div class="mb-3 "> {{$t('editor.leftkiosk')}} <br> {{$t('editor.tellsomeone')}} </div>
                <img src="/src/assets/img/svg/eye-slash-fill.svg" class=" me-2" width="32" height="32" >
            </div>
        </div>
        <iframe id="geogebraframe" :src="geogebrasource"></iframe>
    </div>
</template>

<script>

import jsPDF from 'jspdf'
import axios from "axios";
import $ from 'jquery'


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
            geogebrasource: "",
            electron: this.$route.params.electron,
            virtualized: this.$route.params.virtualized,
            blurEvent : null,
            endExamEvent: null,
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0,
            localfiles: null,
        }
    }, 
    components: {  },  
    mounted() {
        this.geogebrasource = `./geogebra/suite.html`
        this.currentFile = this.clientname
        this.entrytime = new Date().getTime()  
                 
        if (this.electron){
            this.blurEvent = ipcRenderer.on('blurevent', this.focuslost, false);  //ipcRenderer seems to be of type nodeEventTarget (on/addlistener returns a reference to the eventTarget)
            this.endExamEvent = ipcRenderer.on('endexam', () => { this.$router.push({ name: 'student'}); }); //redirect to home view // right before we leave vue.js will run beforeUnmount() which removes all listeners this view attached to the window and the ipcrenderer
            this.saveEvent = ipcRenderer.on('save', () => {  //trigger document save by signal "save" sent from data.js
                console.log("EVENT RECEIVERD")
                this.saveContent() 
            }); 
        }
    
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            this.fetchinterval = setInterval(() => { this.saveContent() }, 20000)   
            this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)  
            this.clockinterval = setInterval(() => { this.clock() }, 1000)  
            if (this.token) { this.focuscheck() } 
            this.loadfilelistinterval = setInterval(() => { this.loadFilelist() }, 10000)   // zeigt html dateien (angaben, eigene arbeit) im header
            this.loadFilelist()
        })
    },
    methods: { 
        // fetch file from disc - show preview
        loadPDF(file){
            const form = new FormData()
            form.append("filename", file)
            fetch(`https://localhost:${this.clientApiPort}/client/data/getpdf`, { method: 'POST', body: form })
                .then( response => response.arrayBuffer())
                .then( data => {
                    let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
                    $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
                    $("#preview").css("display","block");
                    $("#preview").click(function(e) {
                         $("#preview").css("display","none");
                    });
               }).catch(err => { console.warn(err)});     
        },
        loadFilelist(){
            fetch(`https://localhost:${this.clientApiPort}/client/data/getfiles`, { method: 'POST' })
            .then( response => response.json() )
            .then( filelist => {
                this.localfiles = filelist;
            }).catch(err => { console.warn(err)});
        },
        setsource(source){
            if (source === "geometry") { this.geogebrasource = `./geogebra/suite.html`}
            if (source === "graphing") { this.geogebrasource = `./geogebra/graphing.html`}
        },
        exit(){
             ipcRenderer.send('endexam')
        },     
        clock(){
            let now = new Date().getTime()
            this.timesinceentry =  new Date(now - this.entrytime).toISOString().substr(11, 8)
        },  
        fetchInfo() {
            axios.get(`https://localhost:${this.clientApiPort}/client/control/getinfo`)
            .then( response => {
                this.clientinfo = response.data.clientinfo
                this.token = this.clientinfo.token
                this.focus = this.clientinfo.focus
                this.clientname = this.clientinfo.name
                this.exammode = this.clientinfo.exammode
                if (!this.focus){  this.entrytime = new Date().getTime()}
                if (this.clientinfo && this.clientinfo.token){  this.online = true  }
                else { this.online = false  }
            })
            .catch( err => {console.log(err)});
        
            if(this.virtualized){this.informTeacher('virtualized') }
        }, 
        focuscheck() {
            window.addEventListener('beforeunload',         this.focuslost);  // keeps the window open (displays "are you sure in browser")
            window.addEventListener('blur',                 this.focuslost);  // fires only from vue componend not iframe.. check if focus is now on geogebraframe if so > do not inform teacher 
            document.addEventListener("visibilityChange",   this.focuslost);  
        },
        focuslost(e){   /** inform the teacher immediately */
            console.log(e)
            if (e && e.type === "blur") {  
                let elementInFocus = document.activeElement.id
                console.log(elementInFocus);
                if (elementInFocus !== "geogebraframe" && elementInFocus !== "vuexambody" ){
                   this.informTeacher(false)
                }
            }
            else if (e && e.type === "beforeunload") {
                e.preventDefault(); 
                e.returnValue = ''; 
                this.informTeacher(false)
            }
            else {
                this.informTeacher(false)
            }
        },
        informTeacher(focus){
            console.log("HOUSTON WE HAVE A CHEATER!")
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${this.token}/${focus}`)
            .then( response => response.json() )
            .then( (data) => { console.log(data); });  

            if (!focus){
                axios.get(`https://localhost:${this.clientApiPort}/client/control/focus/${this.token}/false`)
                .then( response => { this.focus = false; console.log(response.data);  })
                .catch( err => {console.log(err)});
            }
        },
  
        /** Converts the Editor View into a multipage PDF */
        async saveContent() {  
            screenshot().then(async (img) => {
                let doc = new jsPDF('l', 'px','a4', true, true);   //orientation, unit for coordinates, format, onlyUsedFonts, compress
                
                // berechne die korrekte höhe des bildes proportional zu seiner breite (volle pdf breite)
                const imgProps= doc.getImageProperties(img);
                const width = doc.internal.pageSize.getWidth();
                const height = (imgProps.height * width) / imgProps.width;
               
                doc.addImage(img, 'JPEG', 0, 0, width, height )

                let pdfBlob = new Blob([ doc.output('blob') ], { type : 'application/pdf'});  // electron arbeitet nur mit blobs
                let form = new FormData()
                form.append("file", pdfBlob,  `${this.currentFile}.pdf` );
                form.append("currentfilename", this.currentFile)
                
                axios({
                    method: "post", 
                    url: `https://localhost:${this.clientApiPort}/client/data/store`, 
                    data: form, 
                    headers: { 'Content-Type': `multipart/form-data; boundary=${form._boundary}` }  
                }).then( async (response) => {
                    //console.log(response.data)
                }).catch(err => { console.warn(err)});
            });
        },
    },
    beforeUnmount() {
        clearInterval( this.fetchinterval )
        clearInterval( this.fetchinfointerval )
        clearInterval( this.clockinterval )
        clearInterval( this.loadfilelistinterval )

        //remove electron ipcRender events
        this.endExamEvent.removeAllListeners('endexam')   //remove endExam listener from window
        this.blurEvent.removeAllListeners('blurevent')  //Node.js-specific extension to the EventTarget class. If type is specified, removes all registered listeners for type, otherwise removes all registered listeners.
        //remove window/document events
        window.removeEventListener("beforeunload",  this.focuslost);
        window.removeEventListener('blur',          this.focuslost);
        document.removeEventListener("visibilityChange", this.focuslost); 
    },
}
</script>

<style scoped>
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
