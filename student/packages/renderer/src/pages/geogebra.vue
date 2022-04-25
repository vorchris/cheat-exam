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
