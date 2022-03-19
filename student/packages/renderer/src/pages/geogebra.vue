 <template> 
    <div id="apphead" class="w-100 p-3 text-white bg-dark shadow text-center">

        <div v-if="online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style="float: left;" />
            <span class="fs-4 align-middle me-1" style="float: left;">{{clientname}}</span>
            <span class="fs-4 align-middle me-4 green" style="float: left;" >| online</span> 
        </div>

        <div v-if="!online" class="text-white m-1">
            <img src="/src/assets/img/svg/speedometer.svg" class="white me-2" width="32" height="32" style=" float: left;" />
             <span class="fs-4 align-middle me-1" style=" float: left;"> {{clientname}} </span>
             <span class="fs-4 align-middle me-4 red" style="float: left;"> | offline </span>  
            <button style="float: left;" @click="exit()" class="btn btn-outline-warning ">{{$t('math.exit')}} </button>
        </div>


        <span class="fs-4 align-middle" style="">{{servername}}</span>
        <span class="fs-4 align-middle" style="float: right">GeoGebra</span>
        <!-- <div class="btn-group pt-0 ms-4 me-4" role="group" style="float: right">
            <div class="btn btn-outline-info" @click="setsource('geometry')"> geometry</div>
            <div class="btn btn-outline-info" @click="setsource('graphing')"> graphing</div>
        </div> -->
        <span class="fs-4 align-middle me-2" style="float: right">{{timesinceentry}}</span>
    </div>


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


export default {
    data() {
        return {
            online: true,
            focus: true,
            exammode: false,
            currentFile:null,
            fetchinterval: null,
            fetchinfointerval: null,
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
            blurEvent : null,
            endExamEvent: null,
            clientinfo: null,
            entrytime: 0,
            timesinceentry: 0
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
        }
    
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            this.fetchinterval = setInterval(() => { this.fetchContent() }, 20000)   
            this.fetchinfointerval = setInterval(() => { this.fetchInfo() }, 5000)  
            this.clockinterval = setInterval(() => { this.clock() }, 1000)  
            if (this.token) { this.focuscheck() } 
        })
    },
    methods: { 
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
            axios.get(`http://localhost:${this.clientApiPort}/client/control/getinfo`)
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
                   this.informTeacher()
                }
            }
            else if (e && e.type === "beforeunload") {
                e.preventDefault(); 
                e.returnValue = ''; 
                this.informTeacher()
            }
            else {
                this.informTeacher()
            }
        },
        informTeacher(){
            console.log("HOUSTON WE HAVE A CHEATER!")
            fetch(`http://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${this.token}/false`)
            .then( response => response.json() )
            .then( (data) => { console.log(data); });  

            axios.get(`http://localhost:${this.clientApiPort}/client/control/focus/${this.token}/false`)
            .then( response => { this.focus = false; console.log(response.data);  })
            .catch( err => {console.log(err)});
        },
  
        /** Converts the Editor View into a multipage PDF */
        async fetchContent() {  
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
                    url: `http://localhost:${this.clientApiPort}/client/data/store`, 
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

<style>


</style>
