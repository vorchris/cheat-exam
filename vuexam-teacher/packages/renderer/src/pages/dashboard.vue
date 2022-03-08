<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">{{title}}</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Dashboard</span>
</div>
 

<div id="wrapper" class="w-100 h-100 d-flex" >
    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
       
        <div class="btn btn-light m-1 text-start">Name <br><b> {{$route.params.servername}}</b> </div><br>
        <div class="btn btn-light m-1 mb-1 text-start">Pin <br><b> {{ $route.params.pin }} </b>  </div><br>
        <div class="btn btn-danger m-1 mb-3 text-start" @click="stopserver()">Stop Server</div><br>


        <div class="form-check m-1">
            <input v-model="examtype" value="language" class="form-check-input" type="radio" name="examtype" id="examtype1" checked>
            <label class="form-check-label" for="examtype1">
                Texteditor
            </label>
        </div>
        <div class="form-check m-1 mb-2">
            <input v-model="examtype" value="math" class="form-check-input" type="radio" name="examtype" id="examtype2">
            <label class="form-check-label" for="examtype2">
                Geogebra
            </label>
        </div>
        <div class="form-check form-switch  m-1 mb-4">
            <input @change="toggleAutoabgabe()"  v-model="autoabgabe" class="form-check-input" type="checkbox" id="autoabgabe">
            <label class="form-check-label" for="flexSwitchCheckDefault">Auto Abgabe</label>
        </div>


        <div id="statusdiv" class="btn btn-warning m-1"> connected </div>
    </div>

    <div id="uploaddiv" class="fadeinslow">
        <form id="uploadform" method="POST" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="formFileMultiple" class="form-label">Send Files to ALL Clients</label> 
                <div class="btn-close d-inline float-end" @click="toggleUpload()"></div>
                <input class="form-control" type="file" name="files" id="formFileMultiple" multiple @change="handleFileUpload($event)">
                <input class="form-control" type="hidden" name="servertoken" id="servertoken" v-model="servertoken">
                <input class="form-control" type="hidden" name="servername" id="servername" v-model="servername">
            </div>
            <input  @click="sendFiles('all')" type="buttom" name="submit" class="btn btn-info" value="senden"/>
        </form>
    </div>



    <div id="content" class="fadeinslow p-3">
        <div class="btn btn-success m-1 text-start" style="width:100px;"  @click="startExam('all')">Exam starten</div>
        <div class="btn btn-info m-1 text-start" style="width:100px;" @click="toggleUpload()">Datei senden</div>
        <div class="btn btn-info m-1 text-start" style="width:100px;" @click="getFiles('all')">Abgabe holen</div>
        <div class="btn btn-danger m-1 text-start" style="width:100px;" @click="endExam('all')" >Exam beenden</div>
        <div id="studentslist" class="placeholder pt-4"> 
            <div v-for="student in studentlist" v-bind:class="(!student.focus)?'focuswarn':'' "  class="studentwidget btn border-0 rounded-3 btn-block m-1 ">
                <div id="image" class="rounded" :style="`background-image:url(http://${serverip}:${serverApiPort}/files/${student.token}.jpg?ver=${student.timestamp})  `" style="position: relative; height:75%; background-size:cover;">
                    <span style="">{{student.clientname}}            
                    <button  @click='kick(student.token,student.clientip)' type="button" class=" btn-close  btn-close-white pt-2 pe-2 float-end" title="kick user"></button> </span>
                </div>
                <div class="btn-group pt-0" role="group">
                    <button v-if="(now - 60000 < student.timestamp)" @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm " style="border-top-left-radius:0px; border-top-right-radius:0px; ">send</button>
                    <button v-if="(now - 60000 < student.timestamp)"  @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm " style="border-top-left-radius:0px; border-top-right-radius:0px;">get</button>
                    <button  v-if="!student.focus && (now - 60000 < student.timestamp)"   @click='restore(student.token)' type="button" class="btn btn-danger btn-sm" style="border-top-left-radius:0px; border-top-right-radius:0px;">restore</button>
                </div>
            </div>
        </div>
    </div>


</div>
</template>



<script >
import $ from 'jquery'
import axios from "axios";
import FormData from 'form-data';

export default {
    data() {
        return {
            title: document.title,
            fetchinterval: null,
            abgabeinterval: null,
            studentlist: [],
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
            serverip: this.$route.params.serverip,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            electron: this.$route.params.electron,
            hostname: window.location.hostname,
            now : null,
            files: null,
            examtype: 'language',
            autoabgabe: false,
        };
    },
    components: { },
    methods: {
        // get all information about students status
        fetchInfo() {
            this.now = new Date().getTime()
            axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/studentlist/${this.servername}/${this.servertoken}`)
            .then( response => {
                this.studentlist = response.data.studentlist;
                //console.log(response.data)
                if (this.studentlist){
                    this.studentlist.forEach(student =>{
                        if (!student.focus){this.status(`${student.clientname} has left the exam`); }
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
            if (!this.files) { this.status("No Files selected"); return }
            this.status("File(s) uploading...");

            //create a new form
            const formData = new FormData()
            formData.append('servertoken', this.servertoken);
            formData.append('servername', this.servername);

            for (const i of Object.keys(this.files)) {
                formData.append('files', this.files[i])
            }

            axios({
                method: "post", 
                url: `http://${this.serverip}:${this.serverApiPort}/server/data/send/${who}`, 
                data: formData, 
                headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
                })
            .then( response => {
                this.status(response.data.message);
                if (response.data.status === "success") {
                    this.status("Files sent");
                    setTimeout(this.toggleUpload, 2000);  
                } 
            }).catch( err => {console.log(err)});
        },  

        //sets reactive variable "files" onChange of the file input field
        handleFileUpload( event ){
            this.files = event.target.files;
        },

        //stop and clear this exam server instance
        stopserver(){
             axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/stopserver/${this.servername}/${this.servertoken}`)
                .then( async (response) => {
                    this.status(response.data.message);
                    console.log(response.data);
                    await this.sleep(3000);
                    this.$router.push({ path: '/serverlist' })
                }).catch( err => {console.log(err)});
        },

        //triggers exam mode on specified clients
        startExam(who){
            console.log(this.examtype)
            if (who == "all"){

                if ( this.studentlist.length <= 0 ) { this.status("no clients connected"); console.log("no clients connected") }
                else {  
                    this.status("starting exam mode for all clients");
                    this.studentlist.forEach( (student) => {
                        //check exam mode for students - dont initialize twice
                        console.log(student)
                        if (student.exammode){ return; }
                        axios.get(`http://${student.clientip}:${this.clientApiPort}/client/control/exammode/start/${student.token}/${this.examtype}`)
                        .then( response => {
                            this.status(response.data.message);
                            console.log(response.data);
                        }).catch(error => {console.log(error)});
                    });
                }
            }
        },

        // exit exam mode on all specified cilents
        endExam(who){
            this.status("stopping exam mode");
            if (who == "all"){
                if ( this.studentlist.length <= 0 ) { this.status("no clients connected"); console.log("no clients connected") }
                else {  
                    this.studentlist.forEach( (student) => {
                        axios.get(`http://${student.clientip}:${this.clientApiPort}/client/control/exammode/stop/${student.token}`)
                        .then( async (response) => {
                            this.status(response.data.message);
                            console.log(response.data);
                        }).catch(error => {console.log(error)});
                    });
                }
            }
        },

        // get finished exams (ABGABE) from students
        getFiles(who){
            if (who == "all"){
                if ( this.studentlist.length <= 0 ) { this.status("no clients connected"); console.log("no clients connected") }
                else {  
                    console.log("Requesting Filetransfer from ALL Clients")
                    this.studentlist.forEach( (student) => {
                        axios.get(`http://${student.clientip}:${this.clientApiPort}/client/data/abgabe/send/${student.token}`)
                        .then( response => {
                            console.log(response.data.message);
                        }).catch(error => {console.log(error)});
                    });
                }
            }
        },

        //remove student from exam
        kick(studenttoken, studentip){
            //unregister locally
            axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`)
            .then( response => {
                console.log(response.data);
                this.status(response.data.message);
            }).catch(error => {console.log(error)});

            //inform student
            axios.get(`http://${studentip}:${this.clientApiPort}/client/control/kick/${studenttoken}`)
            .then( response => {
                console.log(response.data);
            }).catch(error => {
                console.info("Client not reachable")
                //console.log(error)
            });
        },

          //remove student from exam
        async restore(studenttoken){
            await axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${studenttoken}/true`)
                .then( async (response) => {
                    this.status(response.data.message);
                    console.log(response.data);
                }).catch(error => {console.log(error)});
        },

        // make upload div visible or hide it
        toggleUpload(){
            let status =  $("#uploaddiv").css("display");
            if (status == "none") {  
                $("#uploaddiv").css("display","block");
                $("#formFileMultiple").val('') 
            }
            else {  $("#uploaddiv").css("display","none"); }
        },

        // (dummy function - validate a specific token - trigger notification on client)
        async task2(token, ip){
             axios.get(`http://${ip}:${this.clientApiPort}/client/control/tokencheck/${token}`)
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



</style>
