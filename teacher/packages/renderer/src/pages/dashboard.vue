<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Dashboard</span>
</div>
 

<div id="wrapper" class="w-100 h-100 d-flex" >
    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
       
        <div class="btn btn-light m-1 text-start">{{$t('dashboard.name')}} <br><b> {{$route.params.servername}}</b> </div><br>
        <div class="btn btn-light m-1 mb-1 text-start" @click="showpin()">{{$t('dashboard.pin')}}<br><b> {{ $route.params.pin }} </b>  </div><br>
        <div class="btn btn-danger m-1 mb-3 text-start" @click="stopserver()">{{$t('dashboard.stopserver')}}</div><br>


        <div class="form-check m-1">
            <input v-model="examtype" value="language" class="form-check-input" type="radio" name="examtype" id="examtype1" checked>
            <label class="form-check-label" for="examtype1">
                {{$t('dashboard.lang')}}
            </label>
        </div>
        <div class="form-check m-1 mb-2">
            <input v-model="examtype" value="math" class="form-check-input" type="radio" name="examtype" id="examtype2">
            <label class="form-check-label" for="examtype2">
                {{$t('dashboard.math')}}
            </label>
        </div>
        <div class="form-check form-switch  m-1 mb-4">
            <input @change="toggleAutoabgabe()"  v-model="autoabgabe" class="form-check-input" type="checkbox" id="autoabgabe">
            <label class="form-check-label" for="flexSwitchCheckDefault">{{$t('dashboard.autoget')}}</label>
        </div>
        <div id="statusdiv" class="btn btn-warning m-1"> connected </div>
    </div>

    <div id="content" class="fadeinslow p-3">
        <div class="btn btn-success m-1 text-start" style="width:120px;"  @click="startExam('all')">{{$t('dashboard.startexam')}}</div>
        <div class="btn btn-info m-1 text-start" style="width:100px;" @click="sendFiles('all')">{{$t('dashboard.sendfile')}}</div>
        <div class="btn btn-info m-1 text-start" style="width:100px;" @click="getFiles('all')">{{$t('dashboard.getfile')}}</div>
        <div class="btn btn-danger m-1 text-start" style="width:120px;" @click="endExam('all')" >{{$t('dashboard.stopexam')}}</div>
        <div id="studentslist" class="placeholder pt-4"> 
            <div v-for="student in studentlist" v-bind:class="(!student.focus)?'focuswarn':'' "  class="studentwidget btn border-0 rounded-3 btn-block m-1 ">
                <div id="image" class="rounded" :style="`background-image:url(http://${serverip}:${serverApiPort}/files/${student.token}.jpg?ver=${student.timestamp})  `" style="position: relative; height:75%; background-size:cover;">
                    <span style="">{{student.clientname}}            
                    <button  @click='kick(student.token,student.clientip)' type="button" class=" btn-close  btn-close-white pt-2 pe-2 float-end" title="kick user"></button> </span>
                </div>
                <div class="btn-group pt-0" role="group">
                    <button v-if="(now - 20000 < student.timestamp)" @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm " style="border-top:0px; border-top-left-radius:0px; border-top-right-radius:0px; ">online</button>
                    <button v-if="(now - 20000 < student.timestamp) && student.exammode"  @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-warning btn-sm " style="border-top:0px;border-top-left-radius:0px; border-top-right-radius:0px;">exammode</button>
                    <button v-if="!student.focus && (now - 20000 < student.timestamp)"   @click='restore(student.token,student.clientip)' type="button" class="btn btn-danger btn-sm " style="border-top:0px;border-top-left-radius:0px; border-top-right-radius:0px;"> restore </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>



<script >
import $ from 'jquery'
import axios from "axios"
import FormData from 'form-data'

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
            pin : this.$route.params.pin,
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
                        if (!student.focus){this.status(`${student.clientname} ${this.$t("dashboard.leftkiosk")}`); }
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
                        this.status(this.$t("dashboard.filessent"));
                    } 
                }).catch( err => {console.log(err)});



            });    
        },  


        //stop and clear this exam server instance
        stopserver(){
            this.$swal.fire({
                title: this.$t("dashboard.sure"),
                text:  this.$t("dashboard.exitexam"),
                icon: "question",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/stopserver/${this.servername}/${this.servertoken}`)
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
            console.log(this.examtype)
            if (who == "all"){
                if ( this.studentlist.length <= 0 ) { this.status(this.$t("dashboard.noclients")); console.log("no clients connected") }
                else {  
                    this.studentlist.forEach( (student) => {
                        //check exam mode for students - dont initialize twice (right after exam stop it takes a few seconds for the students to update their exam status on the server again)
                        if (student.exammode){ this.status("student(s) still in exam mode"); return; }
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
                            axios.get(`http://${student.clientip}:${this.clientApiPort}/client/control/exammode/stop/${student.token}`)
                            .then( async (response) => {
                                this.status(response.data.message);
                                console.log(response.data);
                            }).catch(error => {console.log(error)});
                        }); 
                    }
                } 
            }); 
        },

        // get finished exams (ABGABE) from students
        getFiles(who){
            if (who == "all"){
                if ( this.studentlist.length <= 0 ) { this.status("no clients connected"); console.log("no clients connected") }
                else {  
                    console.log("Requesting Filetransfer from ALL Clients")
                    this.studentlist.forEach( (student) => {
                        //for some reason this has a 30sec timeout when triggered the second time with method GET only inside "electron"
                        axios({
                            url:`http://${student.clientip}:${this.clientApiPort}/client/data/abgabe/send/${student.token}`,
                            method: 'post'
                        })
                        .then( response => {
                            console.log(response.data.message);
                        }).catch(error => {console.log(error)});

                    });
                }
            }
        },

        //remove student from exam
        kick(studenttoken, studentip){
       if ( this.studentlist.length <= 0 ) { this.status("no clients connected"); return; }
            
            this.$swal.fire({
                title: this.$t("dashboard.sure"),
                text:  this.$t("dashboard.kick"),
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: this.$t("dashboard.cancel"),
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
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
                } 
            });  
        },

          //remove student from exam
        async restore(studenttoken, studentip){
            axios.get(`http://${this.serverip}:${this.serverApiPort}/server/control/studentlist/statechange/${this.servername}/${studenttoken}/true`)
                .then( async (response) => {
                    this.status(response.data.message);
                    console.log(response.data);
                }).catch(error => {console.log(error)});


            axios.get(`http://${studentip}:${this.clientApiPort}/client/control/focus/${studenttoken}/true`)
                .then( response => { console.log(response.data)  })
                .catch( err => {console.log(err)});

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
