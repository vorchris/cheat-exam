<template>

 
<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link v-if="!electron" to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-1 ">Next-Exam</span>
    </router-link>
    <span v-if="electron" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-1 ">Next-Exam</span>
    </span>

    <span class="fs-4 align-middle ms-3" style="float: right">Dashboard</span>
     <div class="btn btn-sm btn-danger m-0 mt-1" @click="stopserver()" style="float: right">{{$t('dashboard.stopserver')}}</div>
</div>
 




<div id="wrapper" class="w-100 h-100 d-flex" >
    
    <div id="studentinfocontainer" class="fadeinslow p-4">
        <div v-if="activestudent!= null" id="studentinfodiv">
            <div v-cloak><img style="position: absolute; height: 100%" :src="(activestudent.imageurl && now - 20000 < activestudent.timestamp)? `${activestudent.imageurl}`:'user-red.svg'"></div>

            <div style="height:100%">
                <div id="controlbuttons" style="text-align: center;">
                    <button class="btn btn-close  btn-close-white align-right" @click="hideStudentview()"  style="width: 100px"></button>
                    <b>{{activestudent.clientname}}</b><br>
                    <div style="font-size: 0.6em; margin-bottom: 0px;">{{activestudent.clientip}}</div>
                    <div style="font-size: 0.6em; margin-top: 0px;">{{activestudent.hostname}}</div>
                    <div class="col d-inlineblock btn btn-info m-1 btn-sm"      @click="sendFiles(activestudent.token)"  style="width: 100px">{{$t('dashboard.sendfile')}}</div>
                    <div class="col d-inlineblock btn btn-info m-1 btn-sm"      @click="getFiles(activestudent.token, true)"  style="width: 100px">{{$t('dashboard.getfile')}}</div>
                    <div class="col d-inlineblock btn btn-warning m-1 btn-sm"   @click='kick(activestudent.token,activestudent.clientip);hideStudentview()'  style="width: 100px">{{$t('dashboard.kick')}}</div>
                </div>
            </div>
        </div>
    </div>


    <!--   workfolder view start -->
    <div id=preview class="fadeinslow ">
        <div id=workfolder style="overflow-y:hidden">
            <button id="closefilebrowser" type="button" class=" btn-close pt-2 pe-2 float-end" title="close"></button>
            <h4>{{$t('dashboard.filesfolder')}}: <br> <h6 class="ms-3 mb-3"><strong> {{currentdirectory}}</strong>  </h6></h4>
            <div class="btn btn-dark pe-3 ps-3 me-1 mb-3 btn-sm" @click="loadFilelist(workdirectory) "><img src="/src/assets/img/svg/go-home.svg" class="" width="22" height="22" > </div>
            <div class="btn btn-primary pe-3 ps-3 me-1 mb-3 btn-sm" style="float: right;" :title="$t('dashboard.summarizepdf')" @click="getLatest() "><img src="/src/assets/img/svg/edit-copy.svg" class="" width="22" height="22" >{{$t('dashboard.summarizepdfshort')}}</div>
            <div  v-if="(currentdirectory !== workdirectory)" class="btn btn-dark pe-3 ps-3 me-1 mb-3 btn-sm" @click="loadFilelist(currentdirectoryparent) "><img src="/src/assets/img/svg/edit-undo.svg" class="" width="22" height="22" >up </div>
            <div style="height: 76vh; overflow-y:auto;">
                <div v-for="file in localfiles" class="d-inline">
                    <hr v-if="(file.type == 'file' || file.type == 'dir')">
                    <div  v-if="(file.type == 'file' || file.type == 'dir')" class="btn btn-dark me-1 mb-2 btn-sm" style="float: right;" @click="fdelete(file)" :title="$t('dashboard.delete')"><img src="/src/assets/img/svg/edit-delete.svg" class="" width="22" height="22" ></div>

                    <!-- pdf -->
                    <div v-if="(file.type == 'file' && file.ext === '.pdf')" class="btn btn-primary pe-3 ps-3 me-3 mb-2 btn-sm" @click="loadPDF(file.path, file.name)" style="max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><img src="/src/assets/img/svg/document.svg" class="" width="22" height="22" > {{file.name}} </div>
                    <!-- images -->
                    <div v-if="(file.type == 'file' && (file.ext === '.png'|| file.ext === '.jpg'|| file.ext === '.webp'|| file.ext === '.jpeg' ) )" class="btn btn-primary pe-3 ps-3 me-3 mb-2 btn-sm" @click="loadImage(file.path)" style=" max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><img src="/src/assets/img/svg/document.svg" class="" width="22" height="22" > {{file.name}} </div>
                    <!-- other files -->
                    <div v-if="(file.type == 'file' && !(file.ext === '.pdf' || file.ext === '.png'|| file.ext === '.jpg'|| file.ext === '.webp'|| file.ext === '.jpeg' )  )" class="btn btn-info pe-3 ps-3 me-3 mb-2 btn-sm"  style=" max-width: 240px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: default;"><img src="/src/assets/img/svg/document.svg" class="" width="22" height="22" > {{file.name}} </div>

                    <div v-if="(file.type == 'file')"  :class="(studentlist.length == 0)? 'disabled':''"  class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="dashboardExplorerSendFile(file)" :title="$t('dashboard.send')"><img src="/src/assets/img/svg/document-send.svg" class="" width="22" height="22" ></div>
                    <div v-if="(file.type == 'file')" class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="downloadFile(file)" :title="$t('dashboard.download')"><img src="/src/assets/img/svg/edit-download.svg" class="" width="22" height="22" ></div>
                    <div v-if="(file.type == 'file' && file.ext === '.pdf')" class="btn btn-dark me-1 mb-2 btn-sm" style="float: right;" @click="loadPDF(file.path, file.name)" :title="$t('dashboard.preview')"><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" ></div>
                    <div v-if="(file.type == 'file' && (file.ext === '.png'|| file.ext === '.jpg'|| file.ext === '.webp'|| file.ext === '.jpeg' ))" class="btn btn-dark me-1 mb-2 btn-sm" style="float: right;" @click="loadImage(file.path)" :title="$t('dashboard.preview')"><img src="/src/assets/img/svg/eye-fill.svg" class="white" width="22" height="22" ></div>
                    <!-- folders -->
                    <div v-if="(file.type == 'dir')" class="btn btn-success pe-3 ps-3 me-3 mb-2 btn-sm" @click="loadFilelist(file.path)"><img src="/src/assets/img/svg/folder-open.svg" class="" width="22" height="22" > {{file.name}} </div>
                    <div v-if="(file.type == 'dir')" class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="downloadFile(file)" :title="$t('dashboard.download')"><img src="/src/assets/img/svg/edit-download.svg" class="" width="22" height="22" ></div>
                </div>
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
        <div class="btn btn-light m-1 mt-0 text-start infobutton" @click="showinfo()">{{$t('dashboard.name')}} <br><b> {{$route.params.servername}}</b> </div><br>
        <div class="btn btn-light m-1 text-start infobutton" @click="showinfo()">{{$t('dashboard.server')}} <br><b>{{serverip}}</b> </div><br>
        <div class="btn btn-light m-1 mb-3 text-start infobutton" @click="showinfo()">{{$t('dashboard.pin')}}<br><b> {{ $route.params.pin }} </b>  </div><br>
        
        <div style="font-size:0.9em">
        
        
       
        <div class="form-check m-1 mb-1"  :class="(exammode)? 'disabledexam':''">
            <input v-model="examtype" value="math" class="form-check-input" type="radio" name="examtype" id="examtype2" checked>
            <label class="form-check-label" for="examtype2"> {{$t('dashboard.math')}}  </label>
        </div>
        <div class="form-check m-1" :class="(exammode)? 'disabledexam':''">
            <input v-model="examtype" @click="activateSpellcheck()" value="editor" class="form-check-input" type="radio" name="examtype" id="examtype1">
            <label class="form-check-label" for="examtype1"> {{$t('dashboard.lang')}} <span v-if="(spellcheck)">({{spellchecklang}})</span></label>
        </div>
        <div class="form-check m-1 mb-1" :class="(exammode)? 'disabledexam':''">
            <input v-model="examtype" @click="getTestID()" value="eduvidual" class="form-check-input" type="radio" name="examtype" id="examtype3">
            <label class="form-check-label" for="examtype3"> {{$t('dashboard.eduvidual')}}  </label>
        </div>


        <div v-if="config.development" class="form-check m-1 mb-3" :class="(exammode)? 'disabledexam':''">
            <input v-model="examtype" @click="openAuthWindow()" value="office365" class="form-check-input" type="radio" name="examtype" id="examtype4">
            <label class="form-check-label" for="examtype4"> Office365 <span v-if="(config.accessToken)">({{$t('dashboard.connected')}})</span> </label>
        </div>
       



        <div class="form-check form-switch  m-1 mb-2">
            <input @change="toggleAutoabgabe()"  @click="setAbgabeInterval()" v-model="autoabgabe" class="form-check-input" type="checkbox" id="autoabgabe">
            <label class="form-check-label" for="flexSwitchCheckDefault">{{$t('dashboard.autoget')}}</label>
            <span v-if="autoabgabe" > ({{ abgabeintervalPause }}min)</span>
        </div>
        <div class="form-check form-switch m-1 mb-2">
            <input v-model="delfolder" @click="delfolderquestion()" value="del" class="form-check-input" type="checkbox" name="delfolder" id="delfolder">
            <label class="form-check-label" for="delfolder"> {{$t('dashboard.del')}}  </label>
        </div>
    </div>

        <div id="statusdiv" class="btn btn-warning m-1"> {{$t('dashboard.connected')}}  </div>
        <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
    </div>
    <!-- sidebar end -->


   
    <div id="content" class="fadeinslow p-3">
        
        <!-- control buttons start -->        
        <div v-if="(exammode)" class="btn btn-danger m-1 mt-0 text-start ms-0 " style="width:100px; height:62px;" @click="endExam()" >{{numberOfConnections}} {{$t('dashboard.stopexam')}}</div>

        <div v-else-if="(examtype === 'office365')" @click="onedriveUploadselect()" :class="(examtype === 'office365' && !config.accessToken)? 'disabledexambutton':''" class="btn btn-success m-1 mt-0 text-start ms-0" style="width:100px; height:62px;">{{numberOfConnections}} {{$t('dashboard.startexam')}}</div>
        <div v-else-if="(examtype !== 'office365')" @click="startExam()" class="btn btn-success m-1 mt-0 text-start ms-0" style="width:100px; height:62px;">{{numberOfConnections}} {{$t('dashboard.startexam')}}</div>
       
        <div class="btn btn-info m-1 mt-0 text-start ms-0 " style="width:100px; height:62px;" @click="sendFiles('all')">{{$t('dashboard.sendfile')}}</div>
        <div class="btn btn-info m-1 mt-0 text-start ms-0 " style="width:100px; height:62px;" @click="getFiles('all', true)">{{$t('dashboard.getfile')}}</div>
        <div class="col d-inlineblock btn btn-dark m-1 mt-0 text-start ms-0 " @click="loadFilelist(workdirectory)"  style="width: 100px;">{{$t('dashboard.showworkfolder')}} </div>
        <div  v-if="(screenslocked)" class="btn btn-danger m-1 mt-0 text-start ms-0 " style="width:62px; height:62px;" @click="lockscreens(false)"> <img src="/src/assets/img/svg/shield-lock-fill.svg" class="white mt-2" title="unlock" width="32" height="32" >   </div>
        <div  v-if="(!screenslocked)" class="btn btn-dark m-1 mt-0 text-start ms-0 " style="width:62px; height:62px;" @click="lockscreens(true)"> <img src="/src/assets/img/svg/shield-lock.svg" class="white mt-2" title="lock" width="32" height="32" >  </div>
        <!-- control buttons end -->




        <!-- studentlist start -->
        <div id="studentslist" class="placeholder pt-1">        
            <draggable v-model="studentwidgets" :move="handleMoveItem" @end="handleDragEndItem" ghost-class="ghost">
    
                <div v-for="student in studentwidgets" style="cursor:auto" v-bind:class="(!student.focus)?'focuswarn':''" class="studentwidget btn rounded-3 btn-block ">
                    <div v-if="student.clientname">
                        <div class="studentimage rounded" style="position: relative; height:132px;">     
                            <div v-cloak :id="student.token" style="position: relative;background-size: cover; height: 132px;" v-bind:style="(student.imageurl && now - 20000 < student.timestamp)? `background-image: url('${student.imageurl}')`:'background-image: url(user-red.svg)'"></div>
                            <div v-if="student.virtualized" class="virtualizedinfo" >{{$t("dashboard.virtualized")}}</div>
                            <div v-if="!student.focus" class="kioskwarning" >{{$t("dashboard.leftkiosk")}}</div>
                            <span>   
                                <div style="display:inline;" v-bind:title="(student.files) ? 'Documents: '+student.files : ''"> 
                                    <img v-for="file in student.files" style="width:22px; margin-left:-4px; position: relative; filter: sepia(10%) hue-rotate(306deg) brightness(0.3) saturate(75);" class="" src="/src/assets/img/svg/document.svg"><br>
                                </div>
                                {{student.clientname}}  
                                <button  @click='kick(student.token,student.clientip)' type="button" class=" btn-close  btn-close-white pt-1 pe-2 float-end" title="kick user"></button> 
                            </span>
                        </div>

                        <div class="btn-group pt-0" role="group">
                            <button v-if="(now - 20000 < student.timestamp)" @click="showStudentview(student)" type="button" class="btn btn-outline-success btn-sm " style="border-top:0px; border-top-left-radius:0px; border-top-right-radius:0px; ">{{$t('dashboard.online')}} </button>
                            <button v-if="(now - 20000 > student.timestamp)" type="button" class="btn btn-outline-danger btn-sm " style="border-top:0px; border-top-left-radius:0px; border-top-right-radius:0px; ">{{$t('dashboard.offline')}} </button>
                            <button v-if="(now - 20000 < student.timestamp) && student.exammode && student.focus"  @click='showStudentview(student)' type="button" class="btn btn-outline-warning btn-sm " style="border-top:0px;border-top-left-radius:0px; border-top-right-radius:0px;">{{$t('dashboard.secure')}}</button>
                            <button v-if="(now - 20000 < student.timestamp) && !student.focus "   @click='restore(student.token)' type="button" class="btn btn-danger btn-sm " style="border-top:0px;border-top-left-radius:0px; border-top-right-radius:0px;"> {{$t('dashboard.restore')}} </button>
                        </div>
                    </div>
                </div> 
               
            </draggable>  
        </div>
        <!-- studentlist end -->
    </div>
 
    <div style="position: fixed; bottom:20px; right: 20px; filter:opacity(50%)" class="col d-inlineblock btn " @click="sortStudentWidgets()">
     <img src="/src/assets/img/svg/view-sort-ascending-name.svg" class="white" title="sort" width="24" height="24" >  
 </div>


</div>
</template>



<script >
import $ from 'jquery'
import axios from "axios"
import FormData from 'form-data'
import { VueDraggableNext } from 'vue-draggable-next'

export default {
    components: {
        draggable: VueDraggableNext,
    },
    data() {
        return {
            version: this.$route.params.version,
            title: document.title,
            fetchinterval: null,
            abgabeinterval: null,
            abgabeintervalPause:5,
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
            config :this.$route.params.config,
            now : null,
            files: null,
            examtype: 'math',
            autoabgabe: false,
            activestudent: null,
            localfiles: null,
            currentpreview: null,
            currentpreviewname: null,
            exammode: false,
            delfolder: false,
            delfolderonexit: false,
            numberOfConnections: 0,
            spellcheck: false,
            spellchecklang: 'de',
            suggestions: false,
            moodleTestId: null,
            moodleTestType: null,
            screenslocked: false,
            studentwidgets: [],
            emptyWidget: {
                clientname: false,
                token: `${Math.random()}`,
                imageurl:"user-black.svg"
            },
            originalIndex : 20,
            futureIndex : 20,
            freeDiscspace : 1000,
            msOfficeFile : null
        };
    },




    methods: {
        openAuthWindow(){
            ipcRenderer.sendSync('openmsauth') 
        },
 
        //upload file to authorized onedrive "next-exam" appfolder
        async onedriveUploadselect() {
            if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}
            this.$swal.fire({
                title: this.$t("dashboard.officefilesend"),
                text: this.$t("dashboard.officefilesendtext"),
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
                    accept: ".xlsx",
                }
            })
            .then(async (input) => {
                if (!input.value) { this.status(this.$t("dashboard.nofiles")); return }
                this.status(this.$t("dashboard.uploadfiles"));
           
                //check for allowed file extension again
                const fileExtension = input.value.name.split('.').pop().toLowerCase();
                if (fileExtension !== 'xlsx') {
                    this.$swal.fire({
                    title: this.$t("dashboard.invalid_file"),
                    text: this.$t("dashboard.invalid_file_text"),
                    icon: 'error',
                    });
                    return;
                }

                //save valid file info for other students that connect later or reconnect (they all should get a file in onedrive and a sharing link if not 'none')
                this.msOfficeFile = input.value
                await this.onedriveUpload()
                console.log("awaited")
                //when finished uploading we start exam safe mode for everybody (every student should already have it's own sharing link in its config for excel mode)
                this.startExam()
            });    
        },


        async onedriveUpload(){
            if (!this.msOfficeFile){return}
            for (let student of this.studentlist){
                let studenttoken = student.token
                let fileName =  `${student.clientname}.xlsx`
                await this.fileExistsInAppFolder(fileName).then(async fileExists => {
                    console.log(fileExists)
                    if (fileExists) {
                        // user probably already in exam and editing file - HOW TO HANDLE?
                        // probably the best way would be to ask the teacher if he wants to replace the file for the specific student
                        console.log(`File with name "${fileName}" exists in the app folder.`);

                    } else {
                        const sharingLink = await this.uploadAndShareFile(this.msOfficeFile, fileName);
                        console.log('onedriveUpload(): Link created:', sharingLink);

                        // WRITE Share link to student info ojbect so it can be retrieved on the next student update 
                        // together with the new examtype office365 and directly load and secure the sharinglink
                        fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/sharelink/${this.servername}/${this.servertoken}/${studenttoken}`, { 
                            method: 'POST',
                            headers: {'Content-Type': 'application/json' },
                            body: JSON.stringify({ sharelink: sharingLink  })
                            })
                        .then( res => res.json())
                        .then( response => {console.log(response.message) })
                        .catch(err => { console.warn(err) })


                    }
                });
            }
        },



        async uploadAndShareFile(file, targetfilename) {
            this.config = ipcRenderer.sendSync('getconfig')  // we need to fetch the updated version of the systemconfig from express api (server.js)

            // Upload the file to the app folder
            const uploadEndpoint = `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${targetfilename}:/content`;
            const fileUploadResponse = await fetch(uploadEndpoint, {
                method: 'PUT',
                headers: new Headers({
                    'Authorization': `Bearer ${this.config.accessToken}`,
                    'Content-Type': file.type // Use the file's content type
                }),
                body: file // Send the file directly as the request body
            }).then(response => response.json());

       
            // Create a sharing link with edit permissions using the file ID
            const fileId = fileUploadResponse.id; // Retrieve the file ID of the uploaded file
            const sharingEndpoint = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/createLink`;
            const sharingData = {
                type: 'edit', // edit permissions
                scope: 'anonymous' // anyone with the link can edit
            };

            const sharingResponse = await fetch(sharingEndpoint, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${this.config.accessToken}`,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(sharingData)
            }).then(response => response.json());

            const sharingLink = sharingResponse.link.webUrl;
            return sharingLink;
        },


        async fileExistsInAppFolder(fileName) {
            this.config = ipcRenderer.sendSync('getconfig')
            const appFolderEndpoint = `https://graph.microsoft.com/v1.0/me/drive/special/approot/search(q='${encodeURIComponent(fileName)}')`;
            const fileExists = await fetch(appFolderEndpoint, {
                method: 'GET',
                headers: new Headers({'Authorization': `Bearer ${this.config.accessToken}`})
            })
            .then(response => response.json())
            .then( response => {  
                let res =  response.value.some(file => file.name === fileName);
                return res
            })
            .catch(err => { console.warn(err) })
            return fileExists
        },














        handleDragEndItem() {
            this.movingItem = this.studentwidgets[this.originalIndex];
            this.futureItem = this.studentwidgets[this.futureIndex];
            if (this.movingItem && this.futureItem) {
                this.studentwidgets[this.futureIndex] = this.movingItem;
                this.studentwidgets[this.originalIndex] = this.futureItem;
            }
            document.querySelectorAll('.studentwidget').forEach((el) => (el.style.backgroundColor = 'transparent'));
        },
        handleMoveItem(event) {
            document.querySelectorAll('.studentwidget').forEach((el) => (el.style.backgroundColor = 'transparent'));
            const { index, futureIndex } = event.draggedContext;
            this.originalIndex = index;
            this.futureIndex = futureIndex;
            if (this.studentwidgets[this.futureIndex]) { event.to.children[this.futureIndex].style.backgroundColor = 'rgba(13, 202, 240, 0.15)'; }
            return false; // disable sort
        },
        sortStudentWidgets() {
            this.studentwidgets.sort((a, b) => {
                let one = a.clientname
                let two = b.clientname
                if ( !one) { one = "zzzz"}  // noone is named zzzz so empty widget comes last
                if ( !two) { two = "zzzz"}
                if (one > two) {return 1; }
                if (one < two) {return -1;}
                return 0;
            })
        },
        // create 40 empty widgets for whole class (should be sufficient)
        initializeStudentwidgets(){
            let widgets = []
            for (let i = 0; i<40; i++ ){
                widgets.push(this.emptyWidget)
            }
            this.studentwidgets = widgets;
        },








        
        // get all information about students status and do some checks
        fetchInfo() {
            this.config = ipcRenderer.sendSync('getconfig')  // this is only needed in order to get the accesstoken from the backend for MSAuthentication - but it doesn't hurt
            this.now = new Date().getTime()
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/studentlist/${this.servername}/${this.servertoken}`)
            .then( response => {
                this.studentlist = response.data.studentlist;
                this.numberOfConnections = this.studentlist.length

                if (this.studentlist && this.studentlist.length > 0){
                    this.studentlist.forEach( student => { 
                        console.log(student.status)
                        if (this.examtype === "office365" && !student.status) {
                            console.log("this student has no sharing link yet")
                            if (this.msOfficeFile) {
                                // trigger upload of msoffice file for this student and set sharelink for this student
                            }

                            //UNSEt MSOFFICE file on exam end
                        }


                        if (this.activestudent && student.token === this.activestudent.token) { this.activestudent = student}  // on studentlist-receive update active student (for student-details)
                        if (!student.imageurl){ student.imageurl = "user-black.svg"  }
                    });

                    //update widgets list here - we keep our own independent widgetlist (aka studentlist) for drag&drop 
                    for (let student of this.studentlist) {
                        let studentWidget = this.studentwidgets.filter( el => el.token ===  student.token)  // get widget with the same token
                        if ( studentWidget.length > 0){  //studentwidget exists -> update it
                            for (let i = 0; i < this.studentwidgets.length; i++){  // we cant use (for .. of) or forEach because it creates a workingcopy of the original object
                                if (student.token == this.studentwidgets[i].token){ this.studentwidgets[i] = student; }  //now update the entry in the original widgets object
                            }
                        }
                        else {
                            //replace empty widget with student
                            for (let i = 0; i < this.studentwidgets.length; i++){  // we cant use (for .. of) or forEach because it creates a workingcopy of the original object
                                if (!this.studentwidgets[i].clientname){ 
                                    this.studentwidgets[i] = student; // replace studentwidget with emptywidget
                                    break;
                                } 
                            }
                        }
                    }
                }
                //remove studentwidget from widgetslist if student was removed
                for (let widget of this.studentwidgets) { //find student in studentwidgets list  
                    let studentExists = this.studentlist.filter( el => el.token ===  widget.token).length === 0 ? false : true  // now check if a widget has a student in studentlist otherwise remove it
                    if (!studentExists && widget.token.includes('csrf')){ //if the student the widget belongs to does not exist (and the widget actually represents a student - token starting with csrf)
                        for (let i = 0; i < this.studentwidgets.length; i++){  // we cant use (for .. of) or forEach because it creates a workingcopy of the original object
                             if (widget.token == this.studentwidgets[i].token){ 
                              
                                this.studentwidgets[i] = this.emptyWidget; // replace studentwidget with emptywidget
                            } 
                        }
                    } 
                }
            }).catch( err => {console.log(err)});
        }, 


        // enable exam mode 
        async startExam(){
            this.lockscreens(false, false); // deactivate lockscreen
            this.exammode = true;
            console.log("starting")
            this.visualfeedback(this.$t("dashboard.startexam"))
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/exam/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ exammode: this.exammode, examtype: this.examtype, delfolder: this.delfolder, delfolderonexit: this.delfolderonexit, spellcheck: this.spellcheck, spellchecklang:this.spellchecklang, suggestions: this.suggestions, testid: this.moodleTestId, moodleTestType: this.moodleTestType  })
                })
            .then( res => res.json())
            .then( response => { })
            .catch(err => { console.warn(err) })
        },
        // disable exammode 
        endExam(){
            
            this.getFiles('all') // fetch files from students before ending exam for everybody

            this.$swal.fire({
                title: this.$t("dashboard.sure"),
              
                html: `<div>
                    <input class="form-check-input" type="checkbox" id="checkboxdel">
                    <label class="form-check-label" for="checkboxdel"> ${this.$t("dashboard.exitdelete")} </label>
                    <br><br>
                    <span>${this.$t("dashboard.exitkiosk")}</span>
                </div>`,
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true,
                preConfirm: () => {
                    this.delfolderonexit = document.getElementById('checkboxdel').checked; 
                }
            })
            .then((result) => {
                if (result.isConfirmed) {
                    this.exammode = false;
                    this.lockscreens(false, false); // deactivate lockscreen

                    fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/exam/${this.servername}/${this.servertoken}`, { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json' },
                        body: JSON.stringify({ exammode: this.exammode, examtype: this.examtype, delfolder: this.delfolder, delfolderonexit: this.delfolderonexit  })
                        })
                    .then( res => res.json())
                    .then( response => { })
                    .catch(err => { console.warn(err) })
                } 
            }); 
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
                } 
            });  
        },
        //restore focus state for specific student -- we tell the client that his status is restored which will then (on the next update) update it's focus state on the server 
        restore(studenttoken){
            this.visualfeedback(this.$t("dashboard.restore"),2000)
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/restore/${this.servername}/${this.servertoken}/${studenttoken}`)
                .then( response => { console.log(response.data)  })
                .catch( err => {console.log(err)});
        },
        visualfeedback(message, timeout=1000){
             this.$swal.fire({
                text: message,
                timer: timeout,
                timerProgressBar: true,
                didOpen: () => { this.$swal.showLoading() }
            });
        },






        ////////////////////////
        // DASHBOARD EXPLORER

        //delete file or folder
        fdelete(file){
            this.$swal.fire({
                title: this.$t("dashboard.sure"),
                text:  this.$t("dashboard.filedelete"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/delete/${this.servername}/${this.servertoken}`, { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json' },
                        body: JSON.stringify({ filepath:file.path })
                    })
                    .then( res => res.json() )
                    .then( result => { 
                        console.log(result)
                        this.loadFilelist(this.currentdirectory)
                    });
                }
            });
        },
        // show workfloder  TODO:  the whole workfolder thing is getting to complex.. this should be a standalone vue.js component thats embedded here
        showWorkfolder(){
            $("#preview").css("display","block");
            $("#closefilebrowser").click(function(e) { $("#preview").css("display","none"); });  // the surroundings of #workfolder can be clicked to close the view
            $('#workfolder').click(function(e){ e.stopPropagation(); });    // don't propagate clicks through the div to the preview div (it would hide the view)
        },
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
        dashboardExplorerSendFile(file){
            const inputOptions = new Promise((resolve) => {  // prepare input options for radio buttons
                let connectedStudents = {}
                this.studentlist.forEach( (student) => { connectedStudents[student.token]=student.clientname });
                resolve(connectedStudents)
            })
            this.$swal.fire({
                title: this.$t("dashboard.choosestudent"),
                input: 'select',
                icon: 'success',
                showCancelButton: true,
                reverseButtons: true,
                inputOptions: inputOptions,
                inputValidator: (value) => { if (!value) { return this.$t("dashboard.chooserequire") } }
            })
            .then((input) => {
                if (input.isConfirmed) {
                    let student = this.studentlist.find(element => element.token === input.value)  // fetch cerrect student that belongs to the token
                    fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/sendtoclient/${this.servername}/${this.servertoken}/${student.token}`, { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json' },
                        body: JSON.stringify({ files:[ {name:file.name, path:file.path } ] })
                    })
                    .then( res => res.json() )
                    .then( result => { console.log(result)});
                }
            });
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
        // fetches latest files of all connected students in one combined pdf
        getLatest(){
            this.visualfeedback(this.$t("dashboard.summarizepdf"))
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/data/getlatest/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
            })
            .then( response => response.arrayBuffer() )
            .then( lastestpdf => {
                if (lastestpdf.byteLength === 0){
                    console.log("nothing found")
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
                filelist.sort()
                filelist.reverse()
                this.localfiles = filelist;
                this.currentdirectory = directory
                this.currentdirectoryparent = filelist[filelist.length-1].parentdirectory // the currentdirectory and parentdirectory properties are always on [0]
                if (directory === this.workdirectory) {this.showWorkfolder(); }
            }).catch(err => { console.warn(err)});
        },
 
         // DASHBOARD EXPLORER END
        ////////////////////////////

        async setAbgabeInterval(){
            if (!this.autoabgabe) {
                this.$swal.fire({
                    title: this.$t("dashboard.abgabeauto"),
                    icon: 'question',
                    input: 'range',
                    html: `${this.$t("dashboard.abgabeautoquestion")} <br>  ${this.$t("dashboard.abgabeautohint")}`,
                    inputAttributes: {
                        min: 1,
                        max: 20,
                        step: 1
                    },
                    inputValue: this.abgabeintervalPause
                }).then((input) => {
                    this.abgabeintervalPause= input.value
                })
            }
        },
        async getTestID(){
            if (!this.autoabgabe) {
                this.$swal.fire({
                    title: this.$t("dashboard.eduvidualid"),
                    icon: 'question',
                    input: 'number',
                    html: `
                     <div style="text-align:left; width: 140px; margin: auto auto;">
                        <input class="form-check-input" name=etesttype type="radio" id="quiz" value="quiz" checked>
                        <label class="form-check-label" for="quiz"> 
                            <img  width="24" height="24" src="data:image/png;base64,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"/>
                            Test 
                        </label>
                        <br>
                        <input class="form-check-input"  name=etesttype type="radio" id="activequiz" value="activequiz">
                        <label class="form-check-label" for="activequiz"> 
                            <img  width="24" height="24" src="data:image/png;base64,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"/>
                            LiveTest
                        </label>
                    </div><br>
                    ${this.$t("dashboard.eduvidualidhint")} <br>
                    <span style="font-size:0.8em">(https://www.eduvidual.at/mod/quiz/view.php?id=<span style="background-color: lightblue; padding:0 3px 0 3px;">4172287</span>)</span>`,
                    inputValidator: (value) => {
                        if (!value) {return 'No ID given!'}
                    },
                    preConfirm: () => {
                        this.moodleTestType =  document.querySelector('input[name="etesttype"]:checked').value;  
                    }
                }).then((input) => {
                    if (!input.value) {document.getElementById('examtype2').checked = true;}
                    this.moodleTestId = input.value
                    console.log(this.moodleTestType)
                })
            }
        },
        async activateSpellcheck(){
            const inputOptions = new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        'none':this.$t("dashboard.none"),
                        'de': this.$t("dashboard.de"),
                        'en-GB': this.$t("dashboard.en"),
                        'fr': this.$t("dashboard.fr"),
                        'es': this.$t("dashboard.es"),
                        'it': this.$t("dashboard.it"),
                    })
                }, 100)
            })
            const { value: language } = await this.$swal.fire({
                title: this.$t("dashboard.spellcheck"),
                html: `<div>
                    <input class="form-check-input" type="checkbox" id="checkboxsuggestions">
                    <label class="form-check-label" for="checkboxsuggestions"> ${this.$t("dashboard.suggest")} </label>
                    <br><br>
                    <span>${this.$t("dashboard.spellcheckchoose")}</span>
                </div>`,
                input: 'select',
                inputOptions: inputOptions,
                inputValidator: (value) => {
                    if (!value) {
                    return 'You need to choose something!'
                    }
                },
                preConfirm: () => {
                    this.suggestions = document.getElementById('checkboxsuggestions').checked; 
                }
            })
            if (language) {
                this.spellcheck = true
                this.spellchecklang = language
                if (language === 'none'){this.spellcheck = false}
            }
            
        },

        // show warning
        delfolderquestion(){
            if (!this.delfolder) {
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
            this.activestudent = false
        },
        toggleAutoabgabe(){
            if (this.autoabgabe) { this.abgabeinterval = setInterval(() => { this.getFiles('all') }, 60000 * this.abgabeintervalPause) }   //trigger getFiles('all') every other minute
            else { clearInterval( this.abgabeinterval )} 
        },

        lockscreens(state, feedback=true){
            if (this.studentlist.length === 0) { this.status(this.$t("dashboard.noclients")); return;}

            if (state === false) { this.screenslocked = false; if (feedback) { this.visualfeedback(this.$t("dashboard.unlock")); } }   // the feedback interferes with endexam screen
            else { this.screenslocked = true; this.visualfeedback(this.$t("dashboard.lock"))} 

            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/serverstatus/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ screenlock: this.screenslocked  })
                })
            .then( res => res.json())
            .then( response => { })
            .catch(err => { console.warn(err) })
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
                    let filename = encodeURIComponent(this.files[i].name) // we need to encode the filename because sending formdata encodes non-ASCII characters in a not reversable way
                    formData.append('files', this.files[i], filename)  // single file is sent as object.. multiple files as array..
                }
                
                axios({
                    method: "post", 
                    url: `https://${this.serverip}:${this.serverApiPort}/server/data/upload/${this.servername}/${this.servertoken}/${who}`, 
                    data: formData, 
             
              
                })
                .then( (response) => {console.log(response.data) })
                .catch( err =>{ console.log(`${err}`) })
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
                        //console.log(response.data);
                        await this.sleep(2000);
                        this.$router.push({ path: '/startserver' })
                    }).catch( err => {console.log(err)});
                } 
            });    
        },
        //show pincode 
        showinfo(){
            let info = `<span> IP: <strong>${this.serverip}</strong> \nName: ${this.servername}  \nPin: ${this.pin} </span>`
            this.$swal.fire({ 
                title: `<span style="font-weight:normal"> IP:</span>  ${this.serverip} </span> 
                        <span style="font-weight:normal"> Name:</span>  ${this.servername}  
                        <span style="font-weight:normal"> Pin:</span> ${this.pin}`,
                icon: "info"
            })
        },
        // get finished exams (ABGABE) from students
        getFiles(who, feedfack=false){
            this.checkDiscspace()
            if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); console.log("no clients connected"); return; }
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/fetch/${this.servername}/${this.servertoken}/${who}`)  //who is either all or token
            .then( async (response) => { if (feedfack){ this.visualfeedback(response.data.message, 2000) }else { this.status(response.data.message); } })  // we do not want intrusive feedback on automated tasks })
            .catch( err => {console.log(err)});
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
        checkDiscspace(){   // achtung: custom workdir spreizt sich mit der idee die teacher instanz als reine webversion laufen zulassen - wontfix?
            this.freeDiscspace = ipcRenderer.sendSync('checkDiscspace')
            if (this.freeDiscspace < 0.5) {
                this.status(this.$t("dashboard.freespacewarning")) 
            }
        },
        
    },
    mounted() {  // when ready
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            $("#statusdiv").fadeOut("slow")
            this.fetchInfo()
            this.initializeStudentwidgets()
            this.fetchinterval = setInterval(() => { this.fetchInfo() }, 4000)
        })
        if (this.electron){
            this.hostname = "localhost"
            this.currentdirectory = ipcRenderer.sendSync('getCurrentWorkdir') 
            this.workdirectory= `${this.currentdirectory}/${this.servername}`
        }
    },
    beforeUnmount() {  //when leaving
        clearInterval( this.fetchinterval )
        clearInterval( this.abgabeinterval )
    }
}
</script>





















<style scoped>
.studentwidget {
    width: 204px;
    height: 172px;
    white-space: nowrap;
    text-overflow:    ellipsis; 
    overflow: hidden; 
    padding: 0;
    text-align: left; 
    padding-top:0px;
    border: 0px solid #5f5f5f46;
    margin: 0 !important;;
    margin-right: 4px!important;
    background-color: transparent;
    transition: 0.5s;
}


.studentwidget span {
    margin:0;
    backdrop-filter: blur(1px);
    display: inline-block; 
    width:100%; 
    color: white; 
    font-size: 1em; 
    background: linear-gradient(0deg,rgba(0, 0, 0, 0.808) 0%,  rgba(0, 0, 0, 0.5) 31%, rgba(0, 0, 0, 0.1) 77%,rgba(255,255,255,0) 100% );
    padding: 2px;
    padding-left:6px;
    position: absolute;
    bottom: 0;
    right: 0;
}

.studentimage {
    background-color:transparent!important;
}

.ghost {
   opacity: 0.3;
}


[v-cloak] { display: none; }
.virtualizedinfo {
    position: absolute;
    top:30px;
    left:0;
    background-color: #ffc107c7;
    font-size: 0.7em;
    padding: 2px;
    padding-left: 4px;
    padding-right: 10px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
}

.kioskwarning {
    position: absolute;
    top:6px;
    left:0;
    background-color: #dc3545c7;
    color:white;
    font-size: 0.7em;
    padding: 2px;
    padding-left: 4px;
    padding-right: 10px;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
}


#content {
    background-color: whitesmoke;
}

.infobutton{
    width: 240px;
    min-width: 240px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: whitesmoke;
}

#studentslist{
    border-radius: 5px;
    width: 100%;
    height: 90%;
    /* border: 1px solid rgb(99, 187, 175); */
    padding-bottom:100px;
    transition:0.1s;
    overflow-y:auto;
}


.disabledexam {
    filter: contrast(20%) grayscale(100%) brightness(80%) blur(0.6px);
   pointer-events: none;
}
.disabledexambutton {
    filter: contrast(47%) grayscale(98%) brightness(170%) blur(0.6px);
    pointer-events: none;
}

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
    width:100%;
    height: 100vh;
    background-size:cover;
    background-repeat: no-repeat;
    overflow:hidden;
    background-color: #343a40;
 
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
