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
                    <b>{{truncatedClientName(activestudent.clientname,12)}}</b><br>
                    <div style="font-size: 0.6em; margin-bottom: 0px;">{{activestudent.clientip}}</div>
                    <div style="font-size: 0.6em; margin-top: 0px;">{{activestudent.hostname}}</div>
                    <div class="col d-inlineblock btn btn-info m-1 btn-sm"      @click="sendFiles(activestudent.token)" style="width: 100px">{{$t('dashboard.sendfile')}}</div>
                    <div class="col d-inlineblock btn btn-info m-1 btn-sm"      @click="getFiles(activestudent.token, true)" :class="(serverstatus.examtype === 'eduvidual' || serverstatus.examtype === 'gforms')? 'disabledblue':''" style="width: 100px">{{$t('dashboard.getfile')}}</div>
                    <div class="col d-inlineblock btn btn-dark m-1 btn-sm "     @click="openLatestFolder(activestudent)"  style="width: 100px;">{{$t('dashboard.showworkfolder')}} </div>
                    <div class="col d-inlineblock btn btn-warning m-1 btn-sm"   @click='kick(activestudent.token,activestudent.clientip);hideStudentview()'  style="width: 100px">{{$t('dashboard.kick')}}</div>
                </div>
            </div>
        </div>
    </div>


    <!-- dashboard EXPLORER start -->
    <div id=preview class="fadeinslow ">
        <div id=workfolder style="overflow-y:hidden">
            <button id="closefilebrowser" type="button" class=" btn-close pt-2 pe-2 float-end" title="close"></button>
            <h4>{{$t('dashboard.filesfolder')}}: <br> <h6 class="ms-3 mb-3"><strong> {{currentdirectory}}</strong>  </h6></h4>
            <div class="btn btn-dark pe-3 ps-3 me-1 mb-3 btn-sm" @click="loadFilelist(workdirectory) "><img src="/src/assets/img/svg/go-home.svg" class="" width="22" height="22" > </div>
            <div :class="( serverstatus.examtype === 'eduvidual' )? 'disabledblue':''" class="btn btn-primary pe-3 ps-3 me-1 mb-3 btn-sm" style="float: right;" :title="$t('dashboard.summarizepdf')" @click="getLatest() "><img src="/src/assets/img/svg/edit-copy.svg" class="" width="22" height="22" >{{$t('dashboard.summarizepdfshort')}}</div>
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

                    <div v-if="(file.type == 'file')" :class="(studentlist.length == 0 || serverstatus.examtype === 'eduvidual'|| serverstatus.examtype === 'microsoft365')? 'disabledexam':''"    class="btn btn-dark  me-1 mb-2 btn-sm " style="float: right;" @click="dashboardExplorerSendFile(file)" :title="$t('dashboard.send')"><img src="/src/assets/img/svg/document-send.svg" class="" width="22" height="22" ></div>
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
    <!-- dashboard EXPLORER end -->



    <!-- pdf preview start -->
    <div id="pdfpreview" class="fadeinslow p-4">
        <div class="btn btn-danger me-2  shadow" style="float: right;" @click="hidepreview()" :title="$t('dashboard.close')"><img src="/src/assets/img/svg/dialog-cancel.svg" class="" width="22" height="32" > </div>
        <div class="btn btn-dark me-2 shadow" style="float: right;" @click="print()" :title="$t('dashboard.print')"><img src="/src/assets/img/svg/print.svg" class="" width="22" height="32" > </div>
        <div class="btn btn-dark me-2 shadow" style="float: right;" @click="downloadFile('current')" :title="$t('dashboard.download')"><img src="/src/assets/img/svg/edit-download.svg" class="" width="22" height="32" > </div>
        <iframe src="" id="pdfembed"></iframe>
    </div>
    <!-- pdf preview end -->
   



    <!-- SIDEBAR start -->
    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
        <div class="btn btn-light m-1 mt-0 text-start infobutton" @click="showinfo()">{{$t('dashboard.name')}} <br><b> {{$route.params.servername}}</b> </div><br>
        <div class="btn btn-light m-1 text-start infobutton" @click="showinfo()">{{$t('dashboard.server')}} <br><b>{{serverip}}</b> </div><br>
        <div class="btn btn-light m-1 mb-3 text-start infobutton" @click="showinfo()">{{$t('dashboard.pin')}}<br><b> {{ serverstatus.pin }} </b>  </div><br>
        
        <div style="font-size:0.9em">
            <!-- geogebra -->
            <div class="form-check m-1 mb-1"  :class="(serverstatus.exammode)? 'disabledexam':''">
                <input v-model="serverstatus.examtype" value="math" class="form-check-input" type="radio" name="examtype" id="examtype2" checked>
                <label class="form-check-label" for="examtype2"> {{$t('dashboard.math')}}  </label>
            </div>
            <!-- editor -->
            <div class="form-check m-1" :class="(serverstatus.exammode)? 'disabledexam':''">
                <input v-model="serverstatus.examtype" @click="activateSpellcheck()" value="editor" class="form-check-input" type="radio" name="examtype" id="examtype1">
                <label class="form-check-label" for="examtype1"> {{$t('dashboard.lang')}} <span v-if="(serverstatus.spellcheck)">({{serverstatus.spellchecklang}})</span></label>
            </div>
            <!-- eduvidual -->
            <div class="form-check m-1 mb-1" :class="(serverstatus.exammode)? 'disabledexam':''">
                <input v-model="serverstatus.examtype" @click="getTestID()" value="eduvidual" class="form-check-input" type="radio" name="examtype" id="examtype3">
                <label class="form-check-label" for="examtype3"> {{$t('dashboard.eduvidual')}}  </label>
            </div>
            <!-- google forms -->
            <div class="form-check m-1 mb-1" :class="(serverstatus.exammode)? 'disabledexam':''">
                <input v-model="serverstatus.examtype" @click="getFormsID()" value="gforms" class="form-check-input" type="radio" name="examtype" id="examtype5">
                <label class="form-check-label" for="examtype5"> {{$t('dashboard.gforms')}}  </label>
            </div>

            <!-- microsoft365 -->
            <div class="form-check m-1 mb-3" :class="(serverstatus.exammode)? 'disabledexam':''">
                <input v-model="serverstatus.examtype" value="microsoft365" class="form-check-input" type="radio" name="examtype" id="examtype4">
                <label class="form-check-label" for="examtype4"> Microsoft365 <span v-if="(this.config.accessToken)">({{$t('dashboard.connected')}})</span> </label>
                
                <button v-if="(serverstatus.examtype === 'microsoft365' && !this.config.accessToken)"  @click="openAuthWindow()" class="btn btn-sm btn-primary mt-1  ">
                    <img  src="/src/assets/img/svg/win.svg" xmlns="http://www.w3.org/2000/svg"  width="24" height="24">
                    <span style="padding: 0 6px 0 4px; vertical-align:middle;"> Verbinden </span>
                </button>

                <button v-if="(serverstatus.examtype === 'microsoft365' && this.config.accessToken && !serverstatus.msOfficeFile)"  @click="onedriveUploadselect()" class="btn btn-sm btn-info mt-1  ">
                    <img  src="/src/assets/img/svg/win.svg" xmlns="http://www.w3.org/2000/svg"  width="24" height="24">
                    <span style="padding: 0 6px 0 4px; vertical-align:middle;"> Datei wählen </span>
                </button>

                <button v-if="(serverstatus.examtype === 'microsoft365' && this.config.accessToken && serverstatus.msOfficeFile)"  @click="onedriveUploadselect()" class="btn btn-sm btn-success mt-1  " style=" white-space: nowrap;  width: 170px;overflow: hidden; text-overflow: ellipsis; ">
                    <img  src="/src/assets/img/svg/win.svg" xmlns="http://www.w3.org/2000/svg"  width="24" height="24">
                    <span style="padding: 0 6px 0 4px; vertical-align:middle;">{{serverstatus.msOfficeFile.name}} </span>
                </button>
            </div>



            <!-- other options -->
            <div class="form-check form-switch  m-1 mb-2" :class="(serverstatus.examtype === 'eduvidual' || serverstatus.examtype === 'gforms')? 'disabledexam':''">
                <input @change="toggleAutoabgabe()"  @click="setAbgabeInterval()" v-model="autoabgabe" class="form-check-input" type="checkbox" id="autoabgabe">
                <label class="form-check-label" for="flexSwitchCheckDefault">{{$t('dashboard.autoget')}}</label>
                <span v-if="autoabgabe" > ({{ abgabeintervalPause }}min)</span>
            </div>
            <div class="form-check form-switch  m-1 mb-2">
                <input  @change="toggleScreenshot()" @click="setScreenshotInterval()" checked class="form-check-input" type="checkbox" id="screenshotinterval">
                <label class="form-check-label" for="flexSwitchCheckDefault">{{$t('dashboard.screenshot')}}</label>
                <span v-if="serverstatus.screenshotinterval > 0" > ({{ serverstatus.screenshotinterval }}s)</span>
            </div>
        </div>

        <div id="statusdiv" class="btn btn-warning m-1"> {{$t('dashboard.connected')}}  </div>
        <span @click="showCopyleft()" style="position: absolute; bottom:2px; left: 6px; font-size:0.8em;cursor: pointer;">
            <span style=" display:inline-block; transform: scaleX(-1);font-size:1.2em; ">&copy; </span> 
            <span style="vertical-align: text-bottom;">&nbsp;{{version}}</span>
        </span>
       
    </div>
    <!-- SIDEBAR end -->


   
    <div id="content" class="fadeinslow p-3">
        
        <!-- control buttons start -->        
        <div v-if="(serverstatus.exammode)" class="btn btn-danger m-1 mt-0 text-start ms-0 " style="width:140px; height:62px;" @click="endExam()" >                                                                                                                                         <img src="/src/assets/img/svg/shield-lock.svg" class="white mt-2" :title="$t('dashboard.lock')" width="32" height="32" style="vertical-align: top;"> <div style="display:inline-block; margin-left:4px; width:70px;"> {{numberOfConnections}} {{$t('dashboard.stopexam')}} </div></div>
        <div v-if="(!serverstatus.exammode)" @click="startExam()" :class="(serverstatus.examtype === 'microsoft365' && (!this.config.accessToken || !serverstatus.msOfficeFile))? 'disabledgreen':''" class="btn btn-success m-1 mt-0 text-start ms-0" style="width:140px; height:62px;">   <img src="/src/assets/img/svg/shield-lock.svg" class="white mt-2" :title="$t('dashboard.lock')" width="32" height="32" style="vertical-align: top;"> <div style="display:inline-block; margin-left:4px; width:70px;"> {{numberOfConnections}} {{$t('dashboard.startexam')}}</div></div>
     
        <div class="btn btn-info m-1 mt-0 text-start ms-0 " @click="sendFiles('all')"  style="width:62px; height:62px;"><img src="/src/assets/img/svg/document-send.svg" class="mt-2" :title="$t('dashboard.sendfile')" width="32" height="32"></div>
        <div class="btn btn-info m-1 mt-0 text-start ms-0 " @click="getFiles('all', true)" :class="(serverstatus.examtype === 'eduvidual' || serverstatus.examtype === 'gforms')? 'disabledblue':''"  style="width:62px; height:62px;" ><img src="/src/assets/img/svg/edit-download.svg" class="mt-2" :title="$t('dashboard.getfile')" width="32" height="32"></div>
        <div class="col d-inlineblock btn btn-info m-1 mt-0 text-start ms-0 " @click="loadFilelist(workdirectory)"  style="width: 62px; height:62px;"><img src="/src/assets/img/svg/folder-open.svg" class="mt-2" :title="$t('dashboard.showworkfolder')" width="32" height="32" ></div>
        <div  v-if="(serverstatus.screenslocked)" class="btn btn-danger m-1 mt-0 text-start ms-0 " style="width:62px; height:62px;" @click="lockscreens(false)"> <img src="/src/assets/img/svg/eye-fill.svg" class="white mt-2" title="unlock" width="32" height="32" >   </div>
        <div  v-if="(!serverstatus.screenslocked)" class="btn btn-dark m-1 mt-0 text-start ms-0 " style="width:62px; height:62px;" @click="lockscreens(true)"> <img src="/src/assets/img/svg/eye-slash-fill.svg" class="white mt-2" :title="$t('dashboard.lock')" width="32" height="32" >  </div>
        <div  id="delfolder" class="btn btn-dark m-1 mt-0 ms-0 text-start" style="width:62px; height:62px;" @click="delfolderquestion()" :class="(serverstatus.exammode || serverstatus.examtype === 'eduvidual'|| serverstatus.examtype === 'microsoft365'  || serverstatus.examtype === 'gforms')? 'disabledexam':''"> <img src="/src/assets/img/svg/edit-delete.svg" class="mt-2" :title="$t('dashboard.del')" width="32" height="32" ></div>
        
        <!-- control buttons end -->




        <!-- studentlist start -->
        <div id="studentslist" class="pt-1">        
            <draggable v-model="studentwidgets" :move="handleMoveItem" @end="handleDragEndItem" ghost-class="ghost">
    
                <div v-for="student in studentwidgets" style="cursor:auto" v-bind:class="(!student.focus)?'focuswarn':''" class="studentwidget btn rounded-3 btn-block ">
                    <div v-if="student.clientname">
                        <div class="studentimage rounded" style="position: relative; height:132px;">     
                            <div v-cloak :id="student.token" style="position: relative;background-size: cover; height: 132px;" v-bind:style="(student.imageurl && now - 20000 < student.timestamp)? `background-image: url('${student.imageurl}')`:'background-image: url(user-red.svg)'"></div>
                            <div v-if="student.virtualized" class="virtualizedinfo" >{{$t("dashboard.virtualized")}}</div>
                            <div v-if="!student.focus" class="kioskwarning" >{{$t("dashboard.leftkiosk")}}</div>
                            <div v-if="student.status.sendexam" class="examrequest" >{{$t("dashboard.examrequest")}}</div>
                           
                            <span>   
                                <div style="display:inline;" v-bind:title="(student.files) ? 'Documents: '+student.files : ''"> 
                                    <img v-for="file in student.files" style="width:22px; margin-left:-4px; position: relative; filter: sepia(10%) hue-rotate(306deg) brightness(0.3) saturate(75);" class="" src="/src/assets/img/svg/document.svg"><br>
                                </div>
                                {{ truncatedClientName(student.clientname) }}  
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

import { VueDraggableNext } from 'vue-draggable-next'
import { uploadselect, onedriveUpload, onedriveUploadSingle, uploadAndShareFile, createSharingLink, fileExistsInAppFolder, downloadFilesFromOneDrive} from '../msalutils/onedrive'
import { handleDragEndItem, handleMoveItem, sortStudentWidgets, initializeStudentwidgets} from '../utils/dragndrop'
import {loadFilelist, print, getLatest, getLatestFromStudent,  loadImage, loadPDF, dashboardExplorerSendFile, downloadFile, showWorkfolder, fdelete,  openLatestFolder } from '../utils/filemanager'
import {stopserver, toggleScreenshot, sendFiles, lockscreens, setScreenshotInterval, getFiles, startExam, endExam, kick, restore, toggleAutoabgabe, setAbgabeInterval } from '../utils/exammanagement.js'

export default {
    components: {
        draggable: VueDraggableNext,
    },
    data() {
        return {
            version: this.$route.params.version,
            info: config.info,
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
            config :this.$route.params.config,
            now : null,
            files: null,
            autoabgabe: false,
            activestudent: null,
            localfiles: null,
            currentpreview: null,
            currentpreviewname: null,
            numberOfConnections: 0,
            studentwidgets: [],
            emptyWidget: {
                clientname: false,
                token: `${Math.random()}`,
                imageurl:"user-black.svg"
            },
            originalIndex: 20,
            futureIndex: 20,
            freeDiscspace: 1000,
            replaceMSOfile: false,
            printrequest: false,

            serverstatus:{   // this object contains all neccessary information for students about the current exam settings
                exammode: false,
                examtype: 'math',
                delfolder: false,
                delfolderonexit: false,
                spellcheck: false,
                spellchecklang: 'de',
                suggestions: false,
                moodleTestId: null,
                moodleTestType: null,
                moodleDomain: 'eduvidual.at',
                cmargin: { side: 'right', size: 3 },
                gformsTestId: null,
                screenshotinterval: 4,
                msOfficeFile: null,
                screenslocked: false,
                pin: this.$route.params.pin,
              
            }
        };
    },



    methods: {
        /**
         * Microsoft OneDrive API Authentication and File Handling
         */
        openAuthWindow(){ ipcRenderer.sendSync('openmsauth')  },
        onedriveUploadselect: uploadselect,
        onedriveUpload: onedriveUpload,
        onedriveUploadSingle : onedriveUploadSingle,
        uploadAndShareFile: uploadAndShareFile,
        createSharingLink: createSharingLink,
        fileExistsInAppFolder: fileExistsInAppFolder,
        downloadFilesFromOneDrive: downloadFilesFromOneDrive,


        /**
         * Drag & Drop Methods
         */
        handleDragEndItem:handleDragEndItem,
        handleMoveItem:handleMoveItem,
        sortStudentWidgets:sortStudentWidgets,
        initializeStudentwidgets:initializeStudentwidgets,


        /**
         * Dashboard Explorer (Filemanager)
         */
        loadFilelist:loadFilelist,
        print:print, 
        getLatest:getLatest, 
        getLatestFromStudent:getLatestFromStudent, 
        loadImage:loadImage, 
        loadPDF:loadPDF, 
        dashboardExplorerSendFile:dashboardExplorerSendFile, 
        downloadFile:downloadFile, 
        showWorkfolder:showWorkfolder, 
        fdelete:fdelete,  
        openLatestFolder:openLatestFolder,


        /**
         * Runs every 4 seconds and fetches the current stundentlist from the backend
         * Handles Student-Widgets (create, delete, update)
         * Checks Screenshots and MSO Share Links
         */
        fetchInfo() {
            this.config = ipcRenderer.sendSync('getconfig')  // this is only needed in order to get the accesstoken from the backend for MSAuthentication - but it doesn't hurt
            this.now = new Date().getTime()
            axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/studentlist/${this.servername}/${this.servertoken}`)
            .then( response => {
                this.studentlist = response.data.studentlist;
                this.numberOfConnections = this.studentlist.length

                if (this.numberOfConnections >= this.studentwidgets.length){ this.studentwidgets.push(this.emptyWidget); this.studentwidgets.push(this.emptyWidget)} //check if there are more students connected than empty widgets available. 

                if (this.studentlist && this.studentlist.length > 0){
                    this.studentlist.forEach( student => { 
                        if (this.activestudent && student.token === this.activestudent.token) { this.activestudent = student}  // on studentlist-receive update active student (for student-details)
                        if (!student.imageurl){ student.imageurl = "user-black.svg"  }
                        
                        // if the chosen exam mode is OFFICE and everything is Setup already check if students already got their share link (re-connect, late-connect)
                        if (this.serverstatus.examtype === "microsoft365" && this.config.accessToken && this.serverstatus.msOfficeFile){
                           
                            if (!student.status.msofficeshare) {  // this one is late to the party
                                console.log("this student has no sharing link yet")
                                this.onedriveUploadSingle(student, this.serverstatus.msOfficeFile)   // trigger upload of this.serverstatus.msOfficeFile, create sharelink and set student.status.msofficeshare to sharelink
                            }
                        }
                        if (student.printrequest){  // student sent a printrequest to the teacher
                            this.getLatestFromStudent(student) 
                        }   
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
                                if (!this.studentwidgets[i].clientname){ //clientname == false in an emptyWidget so we found one
                                    this.studentwidgets[i] = student; // replace emptywidget
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

        /**
         * Exam Managment functions
         */
        startExam:startExam,                         // enable exam mode 
        endExam:endExam,                             // disable exammode 
        kick: kick,                                  //remove student from exam
        restore: restore,                            //restore focus state for specific student -- we tell the client that his status is restored which will then (on the next update) update it's focus state on the server 
        toggleAutoabgabe:toggleAutoabgabe,
        setAbgabeInterval:setAbgabeInterval,         // set abgabe interval
        getFiles:getFiles,                           // get finished exams (ABGABE) from students
        toggleScreenshot:toggleScreenshot,           //this just keeps the state of the toggle
        setScreenshotInterval:setScreenshotInterval, //sets a new screenshot update interval - the value is sent to the students and then used to update the screenshots
        lockscreens:lockscreens,                     // temporarily lock screens
        sendFiles:sendFiles,                         //upload files to all students
        stopserver:stopserver,                       //Stop and Exit Exam Server Instance


        visualfeedback(message, timeout=1000){
             this.$swal.fire({
                text: message,
                timer: timeout,
                timerProgressBar: true,
                didOpen: () => { this.$swal.showLoading() }
            });
        },
        visualfeedbackClosemanually(message){
            const closeWhenFinished = async () => {
                while (!this.serverstatus.msOfficeFile) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                }
                this.$swal.close();
            };
            // Your existing Swal configuration
            this.$swal.fire({
                text: message,
                timerProgressBar: true,
                didOpen: () => {
                    this.$swal.showLoading();
                    closeWhenFinished();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
            });
        },


        /**
         * Google Forms
         */
         async getFormsID(){
            this.$swal.fire({
                title: this.$t("dashboard.gforms"),
                icon: 'question',
                input: 'text',
                html: `
                ${this.$t("dashboard.eduvidualidhint")} <br>
                <span style="font-size:0.8em">
                    (https://docs.google.com/forms/d/e/<span style="background-color: lightblue; padding:0 3px 0 3px;">1FAIpQLScuTG7yldD0VRhFgOC_2fhbVdgXn95Kf_w2rUbJm79S1kJBnA</span>/viewform)
                </span>`,
                inputValidator: (value) => {
                    if (!value) {return 'No ID given!'}
                }
            }).then((input) => {
                if (!input.value) {document.getElementById('examtype2').checked = true; this.serverstatus.examtype = "math"}
                this.serverstatus.gformsTestId = input.value
                console.log(this.serverstatus.examtype)
            })  
        },

        /**
         * Eduvidual
         */
        async getTestID(){
            this.$swal.fire({
                title: this.$t("dashboard.eduvidualid"),
                icon: 'question',
                input: 'number',
                html: `
                    <div class="row m-4 mt-1">                   
                        
                        ${this.$t("dashboard.eduvidualdomain")}
                        <input class="form-control col-sm-2" type=text id=moodledomain placeholder="eduvidual.at">
                    </div>
                    
                    <div  style="text-align: left; width: 150px; margin: auto auto;">
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
                    </div>
                    <br>
                    ${this.$t("dashboard.eduvidualidhint")} <br>
                    <span style="font-size:0.8em">(https://www.eduvidual.at/mod/quiz/view.php?id=<span style="background-color: lightblue; padding:0 3px 0 3px;">2546250</span>)</span>`,
                inputValidator: (value) => {
                    if (!value) {return 'No ID given!'}
                },
                preConfirm: () => {
                    this.serverstatus.moodleTestType =  document.querySelector('input[name="etesttype"]:checked').value;  
                }
            }).then((input) => {
                if (!input.value) {document.getElementById('examtype2').checked = true; this.serverstatus.examtype = "math"}
                this.serverstatus.moodleTestId = input.value
                this.serverstatus.moodleDomain = this.isValidDomainName(  document.getElementById('moodledomain').value ) ? document.getElementById('moodledomain').value : "eduvidual.at"
                console.log( this.serverstatus.moodleDomain )
            })  
        },

        isValidDomainName(str) {
            // Regex for matching a simple domain name structure
            var regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/i;
            return regex.test(str);
        },


        /**
         * Text Editor
         */
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

            const updateMarginValueDisplay = () => {
                const marginValueInput = document.getElementById('marginValue');
                const marginValueDisplay = document.getElementById('marginValueDisplay');
                marginValueDisplay.textContent = marginValueInput.value;
            };

            const { value: language } = await this.$swal.fire({
                title: this.$t("dashboard.texteditor"),
                html: `
                <div>
                    <label>
                        ${this.$t("dashboard.cmargin-value")}<br>
                        <input style="width:100px" type="range" id="marginValue" name="margin_value" min="2" max="4" step="0.5" />
                        <div style="width:32px; display: inline-block"  id="marginValueDisplay">${this.serverstatus.cmargin.size}</div>(cm)
                    </label>
                    <br>
                    <label>
                        <input type="radio" name="correction_margin" value="left"  />
                        ${this.$t("dashboard.cmargin-left")}
                    </label>
                    <label>
                        <input type="radio" name="correction_margin" value="right" checked/>
                        ${this.$t("dashboard.cmargin-right")}
                    </label>
                </div>
                <br>
                <div style="border: 0px solid black;">
                    <h4 style: margin-bottom: 0px;padding-bottom: 0px;>${this.$t("dashboard.spellcheck")}</h4>
                    <input class="form-check-input" type="checkbox" id="checkboxsuggestions">
                    <label class="form-check-label" for="checkboxsuggestions"> ${this.$t("dashboard.suggest")} </label>
                    <br><br>
                    <span>${this.$t("dashboard.spellcheckchoose")}</span>
                </div>`,
                input: 'select',
                inputOptions: inputOptions,
                focusConfirm: false,
                didOpen: () => {
                    const marginValueInput = document.getElementById('marginValue');
                    marginValueInput.addEventListener('input', updateMarginValueDisplay);
                },
                willClose: () => {
                    const marginValueInput = document.getElementById('marginValue');
                    marginValueInput.removeEventListener('input', updateMarginValueDisplay);
                },
                inputValidator: (value) => {
                    if (!value) {
                    return 'You need to choose something!'
                    }
                },
                preConfirm: () => {
                    this.serverstatus.suggestions = document.getElementById('checkboxsuggestions').checked; 
                    const radioButtons = document.querySelectorAll('input[name="correction_margin"]');
                    const marginValue = document.getElementById('marginValue').value;
                    let selectedMargin = '';
                    radioButtons.forEach((radio) => {
                        if (radio.checked) {
                            selectedMargin = radio.value;
                        }
                    });
                    if (marginValue && selectedMargin) {
                        this.serverstatus.cmargin = {
                            side: selectedMargin,
                            size: parseInt(marginValue)
                        }
                    }
                }
            })
            if (language) {
                this.serverstatus.spellcheck = true
                this.serverstatus.spellchecklang = language
                if (language === 'none'){this.serverstatus.spellcheck = false}
            }  
        },


        // show warning
        delfolderquestion(){
            
                this.$swal.fire({
                    title: this.$t("dashboard.attention"),
                    text: this.$t("dashboard.delsure"),
                    icon: "info"
                })
            
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
        // hide pdf preview
        hidepreview() {
            $("#pdfpreview").css("display","none");
        },
        //show pincode 
        showinfo(){
            let info = `<span> IP: <strong>${this.serverip}</strong> \nName: ${this.servername}  \nPin: ${this.serverstatus.pin} </span>`
            this.$swal.fire({ 
                title: `<span style="font-weight:normal"> IP:</span>  ${this.serverip} </span> 
                        <span style="font-weight:normal"> Name:</span>  ${this.servername}  
                        <span style="font-weight:normal"> Pin:</span> ${this.serverstatus.pin}`,
                icon: "info",
                customClass: {
                    popup: 'custom-swal2-popup',
                },
            })
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
        truncatedClientName(value, len=16) {
            if (!value) return
            return value.length > len ? value.substr(0, len) + '...' : value;
        },
        // we save serverstatus everytime we start an exam - therefore exams can be resumed easily by the teacher if something wicked happens
        getPreviousServerStatus(){
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/getserverstatus/${this.servername}/${this.servertoken}`, { method: 'POST', headers: {'Content-Type': 'application/json' },})
            .then( res => res.json())
            .then( response => {
                if (response.serverstatus === false) {return}
                this.serverstatus = response.serverstatus // we slowly move things over to a centra serverstatus object
         
                if (this.serverstatus.examtype === "microsoft365"){  // unfortunately we can't automagically reconnect the teacher without violating privacy
                    this.serverstatus.exammode = false
                    this.serverstatus.msOfficeFile = false
                    this.$swal.fire({
                        title: this.$t("dashboard.attention"),
                        text: this.$t("dashboard.msoWarn"),
                        icon: "info"
                    })
                }

                this.setServerStatus()  //  we fetched a backup of serverstatus and now we make sure the backend has the updated settings for the students to fetch
            })
            .catch(err => { console.warn(err) })
        },
        showCopyleft(){
            this.$swal.fire({
                title: "<span style='display:inline-block; transform: scaleX(-1); vertical-align: middle; cursor: pointer;'>&copy;</span>",
                icon: 'info',
                html: `
                Thomas Michael Weissel <br>
                <span style="font-size:0.8em">
                  <a href="https://next-exam.at/#kontakt" target="_blank">next-exam.at</a>
                </span><br><br>
                <span style="font-size:0.8em">Version: ${this.version} ${this.info}</span>
                `,
            })
        },
        /**
         * store the current serverstatus object in the backend
         * this should be the goTo function from now on to update the backend in a single request
        */
        setServerStatus(){
            fetch(`https://${this.serverip}:${this.serverApiPort}/server/control/setserverstatus/${this.servername}/${this.servertoken}`, { 
                method: 'POST',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify({ serverstatus: this.serverstatus })
            })
            .then( res => res.json())
            .then( response => { console.log(response.message)})
            .catch(err => { console.warn(err) })
        }

    },
    mounted() {  // when ready
        this.$nextTick(function () { // Code that will run only after the entire view has been rendered
            $("#statusdiv").fadeOut("slow")
            this.getPreviousServerStatus()
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

.examrequest {
    position: absolute;
    top:54px;
    left:0;
    background-color: #0dcaf0;
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

.disabledblue {
    filter: contrast(100%) grayscale(50%) brightness(120%) blur(0.9px);
   pointer-events: none;
   color: #adebff;
}

.disabledgreen {
    filter: contrast(100%) grayscale(50%) brightness(120%) blur(0.9px);
   pointer-events: none;
   color: #d6ffe1
}

.disabledexam {
    filter: contrast(100%) grayscale(100%) brightness(80%) blur(0.6px);
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


<style>
/**in order to override swal settings the css needs to be global not scoped*/
.swal2-popup{
    opacity: 0.9 !important; 
}

.swal2-container {
    backdrop-filter: blur(2px); 
} 
</style>
