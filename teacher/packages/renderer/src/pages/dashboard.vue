<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Dashboard</span>
</div>
 




<div id="wrapper" class="w-100 h-100 d-flex" >
    

    <div id="studentinfocontainer" class="fadeinslow p-4">
        <div v-if="activestudent!= null" id="studentinfodiv"  class="studentinfoimage" :style="`background-image:url(${activestudent.imageurl})`">
            <div style="height:100%">
                <div id="controlbuttons" style="text-align: center;">
                    <button class="btn btn-close  btn-close-white align-right" @click="hideStudentview()"  style="width: 100px"></button>

                    <b>{{activestudent.clientname}}</b><br>
                    <span style="font-size: 0.7em;">{{activestudent.clientip}}</span>
                    <div class="col d-inlineblock btn btn-success m-1 btn-sm"   @click="startExam(activestudent)" style="width: 100px">{{$t('dashboard.startexam')}} </div>
                    <div class="col d-inlineblock btn btn-danger m-1 btn-sm"   @click="endExam(activestudent)"  style="width: 100px">{{$t('dashboard.stopexam')}} </div>
                    <div class="col d-inlineblock btn btn-info m-1 btn-sm"      @click="sendFiles(activestudent)"  style="width: 100px">{{$t('dashboard.sendfile')}}</div>
                    <div class="col d-inlineblock btn btn-info m-1 btn-sm"      @click="getFiles(activestudent)"  style="width: 100px">{{$t('dashboard.getfile')}}</div>
                    <div class="col d-inlineblock btn btn-warning m-1 btn-sm"    @click='kick(activestudent.token,activestudent.clientip)'  style="width: 100px">{{$t('dashboard.kick')}}</div>
                </div>
            </div>
        </div>
    </div>


    <!--   workfolder view start -->
    <div id=preview class="fadeinslow ">
        <div id=workfolder >
            <button id="closefilebrowser" type="button" class=" btn-close pt-2 pe-2 float-end" title="close"></button>
            <h4>{{$t('dashboard.filesfolder')}}: <br> <h6 class="ms-3 mb-3"><strong> {{currentdirectory}}</strong>  </h6></h4>
            <div class="btn btn-dark pe-3 ps-3 me-1 mb-3 btn-sm" @click="loadFilelist(workdirectory) "><img src="/src/assets/img/svg/go-home.svg" class="" width="22" height="22" > </div>
            <div class="btn btn-primary pe-3 ps-3 me-1 mb-3 btn-sm" style="float: right;" :title="$t('dashboard.summarizepdf')" @click="getLatest() "><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" > <img src="/src/assets/img/svg/edit-copy.svg" class="" width="22" height="22" ></div>
            <div  v-if="(currentdirectory !== workdirectory)" class="btn btn-dark pe-3 ps-3 me-1 mb-3 btn-sm" @click="loadFilelist(currentdirectoryparent) "><img src="/src/assets/img/svg/edit-undo.svg" class="" width="22" height="22" >up </div>
            <div v-for="file in localfiles" class="d-inline">
                <!-- files -->
                <div v-if="(file.type == 'file')" class="btn btn-info pe-3 ps-3 me-3 mb-2 btn-sm" @click="" style=" max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><img src="/src/assets/img/svg/document.svg" class="" width="22" height="22" > {{file.name}} </div>
                
                <div v-if="(file.type == 'file')"  :class="(studentlist.length == 0)? 'disabled':''"  class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="sendFile(file)" :title="$t('dashboard.send')"><img src="/src/assets/img/svg/document-send.svg" class="" width="22" height="22" ></div>
                <div v-if="(file.type == 'file')" class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="downloadFile(file)" :title="$t('dashboard.download')"><img src="/src/assets/img/svg/edit-download.svg" class="" width="22" height="22" ></div>
                <div v-if="(file.type == 'file' && file.ext === '.pdf')" class="btn btn-dark me-1 mb-2 btn-sm" style="float: right;" @click="loadPDF(file.path, file.name)" :title="$t('dashboard.preview')"><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" ></div>
                <div v-if="(file.type == 'file' && (file.ext === '.png'|| file.ext === '.jpg'|| file.ext === '.webp'|| file.ext === '.jpeg' ))" class="btn btn-dark me-1 mb-2 btn-sm" style="float: right;" @click="loadImage(file.path)" :title="$t('dashboard.preview')"><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" ></div>
              
                <!-- folders -->
                <div v-if="(file.type == 'dir')" class="btn btn-success pe-3 ps-3 me-3 mb-2 btn-sm" @click="loadFilelist(file.path)"><img src="/src/assets/img/svg/folder-open.svg" class="" width="22" height="22" > {{file.name}} </div>
                <div v-if="(file.type == 'dir')" class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="downloadFile(file)" :title="$t('dashboard.download')"><img src="/src/assets/img/svg/edit-download.svg" class="" width="22" height="22" ></div>
                  <hr>
               
           </div>
        </div>
    </div>
    <!-- workfolder view end -->



    <!-- pdf preview start -->
    <div id="pdfpreview" class="fadeinslow p-4">
        <div class="btn btn-dark me-2 btn-lg shadow" style="float: right;" @click="print()" :title="$t('dashboard.print')"><img src="/src/assets/img/svg/print.svg" class="" width="22" height="22" > </div>
        <div class="btn btn-dark me-2 btn-lg shadow" style="float: right;" @click="downloadFile('current')" :title="$t('dashboard.download')"><img src="/src/assets/img/svg/edit-download.svg" class="" width="22" height="22" > </div>
        <iframe src="" id="pdfembed"></iframe>
    </div>
    <!-- pdf preview end -->
   



    <!-- sidebar start -->
    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
        <div class="btn btn-light m-1 text-start">{{$t('dashboard.name')}} <br><b> {{$route.params.servername}}</b> </div><br>
        <div class="btn btn-light m-1 mb-1 text-start" @click="showpin()">{{$t('dashboard.pin')}}<br><b> {{ $route.params.pin }} </b>  </div><br>
        <div class="btn btn-danger m-1 mb-3 text-start" @click="stopserver()" style="">{{$t('dashboard.stopserver')}}</div><br>
        <div class="form-check m-1">
            <input v-model="examtype" value="language" class="form-check-input" type="radio" name="examtype" id="examtype1" checked>
            <label class="form-check-label" for="examtype1"> {{$t('dashboard.lang')}} </label>
        </div>
        <div class="form-check m-1 mb-2">
            <input v-model="examtype" value="math" class="form-check-input" type="radio" name="examtype" id="examtype2">
            <label class="form-check-label" for="examtype2"> {{$t('dashboard.math')}}  </label>
        </div>
        <div class="form-check form-switch  m-1 mb-4">
            <input @change="toggleAutoabgabe()"  v-model="autoabgabe" class="form-check-input" type="checkbox" id="autoabgabe">
            <label class="form-check-label" for="flexSwitchCheckDefault">{{$t('dashboard.autoget')}}</label>
        </div>
        <div class="form-check m-1 mb-2">
            <input @click="delfolder()" value="del" class="form-check-input" type="checkbox" name="delfolder" id="delfolder">
            <label class="form-check-label" for="delfolder"> {{$t('dashboard.del')}}  </label>
        </div>
        <div id="statusdiv" class="btn btn-warning m-1"> {{$t('dashboard.connected')}}  </div>
        <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
    </div>
    <!-- sidebar end -->


     <!-- exam & studentlist start -->
    <div id="content" class="fadeinslow p-3">
        <div :class="(exammodeReady)? 'disabled':'' " class="btn btn-success m-1 text-start ms-0" style="width:100px;"  @click="startExam('all')">{{$t('dashboard.startexam')}}</div>
        <div class="btn btn-danger m-1 text-start ms-0 " style="width:100px;" @click="endExam('all')" >{{$t('dashboard.stopexam')}}</div>
        <div class="btn btn-info m-1 text-start ms-0 " style="width:100px;" @click="sendFiles('all')">{{$t('dashboard.sendfile')}}</div>
        <div class="btn btn-info m-1 text-start ms-0 " style="width:100px;" @click="getFiles('all')">{{$t('dashboard.getfile')}}</div>
        <div class="col d-inlineblock btn btn-dark m-1 ms-0 " @click="loadFilelist(workdirectory)"  style="width: 100px; ">{{$t('dashboard.showworkfolder')}} </div>
        <div id="studentslist" class="placeholder pt-4"> 
            <div v-for="student in studentlist" style="cursor:auto" v-bind:class="(!student.focus)?'focuswarn':'' "  class="studentwidget btn border-0 rounded-3 btn-block m-1 ">
                <div id="image" class="rounded" :style="(student.imageurl)? `background-image:url(${student.imageurl})`:'background-image:url(person-lines-fill.svg)'" style="position: relative; height:75%; background-size:cover;">
                    <span style="">{{student.clientname}}            
                    <button  @click='kick(student.token,student.clientip)' type="button" class=" btn-close  btn-close-white pt-2 pe-2 float-end" title="kick user"></button> </span>
                </div>
                <div class="btn-group pt-0" role="group">
                    <button v-if="(now - 20000 < student.timestamp)" @click="showStudentview(student)" type="button" class="btn btn-outline-success btn-sm " style="border-top:0px; border-top-left-radius:0px; border-top-right-radius:0px; ">{{$t('dashboard.online')}} </button>
                    <button v-if="(now - 20000 < student.timestamp) && student.exammode && student.focus"  @click='showStudentview(student)' type="button" class="btn btn-outline-warning btn-sm " style="border-top:0px;border-top-left-radius:0px; border-top-right-radius:0px;">{{$t('dashboard.secure')}}</button>
                    <button v-if="(now - 20000 < student.timestamp) && !student.focus "   @click='restore(student.token,student.clientip)' type="button" class="btn btn-danger btn-sm " style="border-top:0px;border-top-left-radius:0px; border-top-right-radius:0px;"> {{$t('dashboard.restore')}} </button>
                </div>
            </div>
        </div>
    </div>
    <!-- exam & studentlist end -->

</div>
</template>



<script >
import $ from 'jquery'
import axios from "axios"
import FormData from 'form-data'

export default {
    data() {
        return {
            version: this.$route.params.version,
            title: document.title,
            fetchinterval: null,
            abgabeinterval: null,
            studentlist: [],
            workdirectory: `${this.$route.params.workdirectory}/${this.$route.params.servername}`,
            currentdirectory: this.$route.params.workdirectory,
            currentdirectoryparent: '',
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
            serverip: this.$route.params.serverip,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            electron: this.$route.params.electron,
            hostname: window.location.hostname,
            pin : this.$route.params.pin,
            now : null,
            files: null,
            examtype: 'language',
            autoabgabe: false,
            activestudent: null,
            localfiles: null,
            currentpreview: null,
            currentpreviewname: null,
            exammodeReady: false
        };
    },
    components: { },
    methods: {
        // fetch a file or folder (zip) and open download/save dialog
        downloadFile(file){
            if (file === "current"){   //we want to download the file thats currently displayed in preview
                let a = document.createElement("a");
                    a.href = this.currentpreview
                    a.setAttribute("download", this.currentpreviewname);
                    a.click();
                return
            }
            console.log("requesting file for downlod ")
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/download/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ filename : file.name, path: file.path, type: file.type})
            })
            .then( res => res.blob() )
            .then( blob => {
                    //this is a trick to trigger the download dialog
                    let a = document.createElement("a");
                    a.href = window.URL.createObjectURL(blob);
                    a.setAttribute("download", file.name);
                    a.click();
            })
           .catch(err => { console.warn(err)});
        },

        // send a file from dashboard explorer to specific student
        sendFile(file){
            console.log("fetching file")
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/download/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ filename : file.name, path: file.path, type: file.type})
            })
            .then( res => res.blob() )
            .then( blob => {
                // prepare input options for radio buttons
                const inputOptions = new Promise((resolve) => {
                    let connectedStudents = {}
                    this.studentlist.forEach( (student) => {  
                        connectedStudents[student.token]=student.clientname
                    });
                    resolve(connectedStudents)
                })
                this.$swal.fire({
                    title: this.$t("dashboard.choosestudent"),
                    input: 'select',
                    icon: 'success',
                    showCancelButton: true,
                    reverseButtons: true,
                    inputOptions: inputOptions,
                    inputValidator: (value) => {
                        if (!value) { return this.$t("dashboard.chooserequire") }
                    }
                })
                .then((input) => {
                    if (input.isConfirmed) {
                        let student = this.studentlist.find(element => element.token === input.value)  // fetch cerrect student that belongs to the token
                        const formData = new FormData()  //prepare form to send file
                        formData.append('files', blob, file.name)  
                        axios({
                            method: "post", 
                            url: `https://${student.clientip}:${this.clientApiPort}/client/data/receive/${student.token}`, 
                            data: formData, 
                            headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
                        })
                        .then( (response) => { if (response.data.status === "success"){  this.status( this.$t("dashboard.filessent") )} })
                        .catch( err =>{    console.log(`${err}`) })
                    }
                });
            })
            .catch(err => { console.warn(err)});
        },
        // fetch file from disc - show preview
        loadPDF(filepath, filename){
            const form = new FormData()
            form.append("filename", filepath)
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getpdf/${this.servername}/${this.servertoken}`, { method: 'POST', body: form })
                .then( response => response.arrayBuffer())
                .then( data => {
                    let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
                    this.currentpreview = url   //needed for preview buttons
                    this.currentpreviewname = filename   //needed for preview buttons
                    $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
                    $("#pdfpreview").css("display","block");
                    $("#pdfpreview").click(function(e) {
                         $("#pdfpreview").css("display","none");
                    });
               }).catch(err => { console.warn(err)});     
        },
           // fetch file from disc - show preview
        loadImage(file){
            const form = new FormData()
            form.append("filename", file)
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getpdf/${this.servername}/${this.servertoken}`, { method: 'POST', body: form })
                .then( response => response.arrayBuffer())
                .then( data => {
                    let url =  URL.createObjectURL(new Blob([data], {type: "application/pdf"})) 
                    // wanted to save code here but images need to be presented in a different way than pdf.. so...
                    $("#pdfembed").css("background-image",`url(${ url  })`);
                    $("#pdfembed").css("height","60vh");
                    $("#pdfembed").css("margin-top","-30vh");
                    $("#pdfembed").attr("src", '')

                    $("#pdfpreview").css("display","block");
                    $("#pdfpreview").click(function(e) {
                        $("#pdfpreview").css("display","none");
                        $("#pdfembed").css("background-image",'');
                        $("#pdfembed").css("height","96vh");
                        $("#pdfembed").css("margin-top","-48vh");
                    });
               }).catch(err => { console.warn(err)});     
        },





        // show workfloder
        showWorkfolder(){
            $("#preview").css("display","block");
            $("#closefilebrowser").click(function(e) { $("#preview").css("display","none"); });  // the surroundings of #workfolder can be clicked to close the view
            $('#workfolder').click(function(e){ e.stopPropagation(); });    // don't propagate clicks through the div to the preview div (it would hide the view)
        },

        getLatest(){
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getlatest/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
            })
            .then( response => response.arrayBuffer() )
            .then( lastestpdf => {
               
                if (lastestpdf.byteLength === 0){
                    this.status(` ${this.$t("dashboard.nopdf")}`);
                    return
                }
                let url =  URL.createObjectURL(new Blob([lastestpdf], {type: "application/pdf"})) 
                this.currentpreview = url   //needed for preview buttons
                this.currentpreviewname = "combined"   //needed for preview buttons
                $("#pdfembed").attr("src", `${url}#toolbar=0&navpanes=0&scrollbar=0`)
                $("#pdfpreview").css("display","block");
                $("#pdfpreview").click(function(e) {
                        $("#pdfpreview").css("display","none");

                });

                //download(lastestpdf, "allInOne.pdf", "application/pdf");
            }).catch(err => { console.warn(err)});
        },

        print(){
            var iframe = $('#pdfembed')[0]; 
            iframe.contentWindow.focus();
            iframe.contentWindow.print(); 
        },


        loadFilelist(directory){
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getfiles/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ dir : directory})
            })
            .then( response => response.json() )
            .then( filelist => {
                console.log(filelist)
                this.localfiles = filelist;
                this.currentdirectory = directory
                this.currentdirectoryparent = filelist[0].parentdirectory // the currentdirectory and parentdirectory properties are always on [0]
                if (directory === this.workdirectory) {this.showWorkfolder(); }
            }).catch(err => { console.warn(err)});
        },

        // show warning
        delfolder(){
            let delfolder = $("#delfolder").is(':checked')
            if (delfolder) {
                this.$swal.fire({
                    title: this.$t("dashboard.attention"),
                    text: this.$t("dashboard.delsure"),
                    icon: "info"
                })
            }
        },
        //display student specific actions
        showStudentview(student) {
            $("#studentinfocontainer").css("display","block");
            this.activestudent = student
        },
        hideStudentview() {
            $("#studentinfocontainer").css("display","none");
        },
        // get all information about students status
        fetchInfo() {
            this.now = new Date().getTime()
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/studentlist/${this.servername}/${this.servertoken}`)
            .then( response => {
                this.studentlist = response.data.studentlist;
                if (this.studentlist && this.studentlist.length > 0){
                    
                    this.exammodeReady = true;
                    this.studentlist.forEach(student =>{  // on studentlist-receive check focus status and other things
                        if (!student.focus){this.status(`${student.clientname} ${this.$t("dashboard.leftkiosk")}`); }
                        if (!student.exammode && !student.focus)  {  this.restore(student.token, student.clientip) }
                           

                        if (student.virtualized){this.status(`${student.clientname}${this.$t("control.virtualized")}`)}
                        if (!student.exammode) {this.exammodeReady = false}
                    });
                }
            }).catch( err => {console.log(err)});
        }, 

        toggleAutoabgabe(){
            if (this.autoabgabe) { this.abgabeinterval = setInterval(() => { this.getFiles('all') }, 60000) }   //trigger getFiles('all') every other minute
            else { clearInterval( this.abgabeinterval )} 
        },

        //upload files to all students
        sendFiles(who) {
            if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}
            this.$swal.fire({
                title: this.$t("dashboard.filesend"),
                text: this.$t("dashboard.filesendtext"),
                icon: "info",
                input: 'file',
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true,
                inputAttributes: {
                    type: "file",
                    name:"files",
                    id: "swalFile",
                    class:"form-control",
                    multiple:"multiple"
                }
            })
            .then((input) => {
                this.files = input.value
                if (!this.files) { this.status(this.$t("dashboard.nofiles")); return }
                this.status(this.$t("dashboard.uploadfiles"));

                //create a new form
                const formData = new FormData()
                formData.append('servertoken', this.servertoken);
                formData.append('servername', this.servername);

                for (const i of Object.keys(this.files)) {
                    formData.append('files', this.files[i])  // single file is sent as object.. multiple files as array..
                }

                if (who == "all"){
                    this.studentlist.forEach( (student) => {  
                        axios({
                            method: "post", 
                            url: `https://${student.clientip}:${this.clientApiPort}/client/data/receive/${student.token}`, 
                            data: formData, 
                            headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
                        })
                        .then( (response) => {
                            console.log(response)
                        })
                        .catch( err =>{    console.log(`${err}`) })
                    });
                }
                else {
                    let student = who
                    axios({
                        method: "post", 
                        url: `https://${student.clientip}:${this.clientApiPort}/client/data/receive/${student.token}`, 
                        data: formData, 
                        headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
                    })
                    .then( (response) => {
                        console.log(response)
                    })
                    .catch( err =>{    console.log(`${err}`) })
                }
            });    
        },  


        //stop and clear this exam server instance
        stopserver(){
            this.$swal.fire({
                title: this.$t("dashboard.exitexamsure"),
                text:  this.$t("dashboard.exitexam"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/stopserver/${this.servername}/${this.servertoken}`)
                    .then( async (response) => {
                        this.status(response.data.message);
                        console.log(response.data);
                        await this.sleep(2000);
                        this.$router.push({ path: '/serverlist' })
                    }).catch( err => {console.log(err)});
                } 
            });    
        },

        //show pincode bid
        showpin(){
            this.$swal.fire({
                title: this.pin,
                text: "Pincode",
                icon: "info",
            })
        },


        //triggers exam mode on specified clients
        startExam(who){
            let delfolder = $("#delfolder").is(':checked')
            if (who == "all"){
                if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); console.log("no clients connected") }
                else {  
                    this.studentlist.forEach( (student) => {
                        //check exam mode for students - dont initialize twice (right after exam stop it takes a few seconds for the students to update their exam status on the server again)
                        if (student.exammode){ this.status(this.$t("dashboard.exammodeactive")); return; }
                        axios.get(`https://${student.clientip}:${this.clientApiPort}/client/control/exammode/start/${student.token}/${this.examtype}/${delfolder}`)
                        .then( response => {
                            this.status(response.data.message);
                            console.log(response.data);
                        }).catch(error => {console.log(error)});
                    });
                }
            }
            else {
                let student = who
                if (student.exammode){ this.status(this.$t("dashboard.exammodeactive")); return; }
                axios.get(`https://${student.clientip}:${this.clientApiPort}/client/control/exammode/start/${student.token}/${this.examtype}/${delfolder}`)
                .then( response => {
                    this.status(response.data.message);
                    console.log(response.data);
                }).catch(error => {console.log(error)});
            }
        },

        // exit exam mode on all specified cilents
        endExam(who){
            if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); return; }
            
            this.$swal.fire({
                title: this.$t("dashboard.sure"),
                text:  this.$t("dashboard.exitkiosk"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    if (who == "all"){
                        this.studentlist.forEach( (student) => {
                            axios.get(`https://${student.clientip}:${this.clientApiPort}/client/control/exammode/stop/${student.token}`)
                            .then( async (response) => {
                                this.status(response.data.message);
                                console.log(response.data);
                            }).catch(error => {console.log(error)});
                        }); 
                    }
                    else {
                        let student = who
                        axios.get(`https://${student.clientip}:${this.clientApiPort}/client/control/exammode/stop/${student.token}`)
                        .then( async (response) => {
                            this.status(response.data.message);
                            console.log(response.data);
                        }).catch(error => {console.log(error)});
                    }
                } 
            }); 
        },

        // get finished exams (ABGABE) from students
        getFiles(who){
            if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); console.log("no clients connected"); return; }
            if (who == "all"){
                this.status(this.$t("dashboard.abgaberequest"));
                this.studentlist.forEach( (student) => {
                    //for some reason this has a 30sec timeout when triggered the second time with method GET only inside "electron"
                    axios({
                        url:`https://${student.clientip}:${this.clientApiPort}/client/data/abgabe/send/${student.token}`,
                        method: 'post'
                    })
                    .then( response => {
                        console.log(response.data.message);
                    }).catch(error => {console.log(error)});
                });
            }
            else {
                let student = who
                axios({
                    url:`https://${student.clientip}:${this.clientApiPort}/client/data/abgabe/send/${student.token}`,
                    method: 'post'
                })
                .then( response => {
                    console.log(response.data.message);
                }).catch(error => {console.log(error)});
            }
        },

        //remove student from exam
        kick(studenttoken, studentip){
            if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); return; }
            
            this.$swal.fire({
                title: this.$t("dashboard.sure"),
                text:  this.$t("dashboard.reallykick"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                     //unregister locally
                    axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`)
                    .then( response => {
                        console.log(response.data);
                        this.status(response.data.message);
                    }).catch(error => {console.log(error)});

                    //inform student
                    axios.get(`https://${studentip}:${this.clientApiPort}/client/control/kick/${studenttoken}`)
                    .then( response => {
                        console.log(response.data);
                    }).catch(error => {
                        console.info("Client not reachable")
                        //console.log(error)
                    });
                } 
            });  
        },

          //remove student from exam
        async restore(studenttoken, studentip){
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${studenttoken}/true`)
                .then( async (response) => {
                    this.status(response.data.message);
                    console.log(response.data);
                }).catch(error => {console.log(error)});


            axios.get(`https://${studentip}:${this.clientApiPort}/client/control/focus/${studenttoken}/true`)
                .then( response => { console.log(response.data)  })
                .catch( err => {console.log(err)});

        },


        // (dummy function - validate a specific token - trigger notification on client)
        async task2(token, ip){
             axios.get(`https://${ip}:${this.clientApiPort}/client/control/tokencheck/${token}`)
            .then(  response => {
                console.log(response.data);
            }).catch(error => {console.log(error)});
        },

        // show status message
        async status(text){  
            $("#statusdiv").text(text)
            $("#statusdiv").fadeIn("slow")
            await this.sleep(2000);
            $("#statusdiv").fadeOut("slow")
        },

        // implementing a sleep (wait) function
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

    },
    mounted() {  // when ready
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            $("#statusdiv").fadeOut("slow")
            this.fetchInfo();
            this.fetchinterval = setInterval(() => { this.fetchInfo() }, 4000)
        })
        if (this.electron){
            this.hostname = "localhost"
        }
    },
    beforeUnmount() {  //when leaving
        clearInterval( this.fetchinterval )
        clearInterval( this.abgabeinterval )
    },
}

</script>



<style scoped>



#pdfpreview {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:10000;
    backdrop-filter: blur(3px);
}
#pdfembed { 
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -30vw;
    margin-top: -48vh;
    width:60vw;
    height: 96vh;
   
    background-color: rgba(255, 255, 255, 1);
    border: 2px solid #212529;
    box-shadow: 0 0 15px rgba(22, 9, 9, 0.589);
    
    border-radius: 6px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #212529;
    z-index:-1;
}








#preview {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:1000;
}
#workfolder { 
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    z-index:1001;
    backdrop-filter: blur(3px);
    overflow-y: auto;
}






#studentinfocontainer {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    
    z-index:100;
    
}
#studentinfodiv {
    position: absolute;
    top: 0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-size:cover;
    background-repeat: no-repeat;
}
#controlbuttons {
    backdrop-filter: blur(3px);
    position: absolute;
    right: 0px;
    width: 128px; 
    height: 100%; 
    top: 0px;  
    background:  rgba(97, 97, 97, 0.693);
    color: white; 
    font-size: 1.4em; 
    padding: 10px;
}


hr {
    margin: 0.2em 0.9em 0.5em 0.3em;
   
    background-color: #b3b3b3;
    border: 0;
    opacity: 0.25;
}

</style>
