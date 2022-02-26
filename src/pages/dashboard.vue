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
        <div class="btn btn-light m-1">Name <br><b> {{$route.params.servername}}</b> </div><br>
        <div class="btn btn-danger m-1" @click="stopserver()">Stop Server</div><br>
        <div class="btn btn-light m-1">Pin <br><b> {{ $route.params.pin }} </b>  </div><br><br>
        <div id="statusdiv" class="btn btn-warning m-2"> connected </div>
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
        <div class="btn btn-success m-1" style="width:100px;"  @click="startExam('all')">Exam starten</div>
        <div class="btn btn-info m-1" style="width:100px;" @click="toggleUpload()">Datei senden</div>
        <div class="btn btn-info m-1" style="width:100px;" @click="getFiles('all')">Abgabe holen</div>
        <div class="btn btn-danger m-1" style="width:100px;" @click="endExam('all')" >Exam beenden</div>
        <div id="studentslist" class="placeholder pt-4"> 


            <div v-for="student in studentlist" class="studentwidget btn  btn-block shadow-sm border rounded-3 m-1">
                {{student.clientname}}             
                <button  @click='kick(student.token,student.clientip)' type="button" class="btn btn-outline-danger btn-sm btn-close float-end" title="kick user"></button><br>
                <img class="rounded-3 border" v-bind:class="(now - 60000 > student.timestamp)?'disabled':'' "   v-bind:src="'/files/'+student.token+'.jpg?ver='+student.timestamp"  onerror="this.src='/src/assets/img/icons/nouserscreenshot.png'"><br>
                
                <div class="btn-group p-2" role="group" >
                    <button v-if="(now - 60000 < student.timestamp)" @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm">send</button>
                    <button v-if="(now - 60000 < student.timestamp)"  @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm">get</button>
                    <button  v-if="!student.focus && (now - 60000 < student.timestamp)"   @click='restore(student.token)' type="button" class="btn btn-outline-success btn-sm">restore</button>
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
            fetchinterval: null,
            studentlist: [],
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
            serverip: this.$route.params.serverip,
            now : null,
            files: null,
        };
    },
    components: {
    
    },
    methods: {

        fetchInfo() {
            this.now = new Date().getTime()
            axios.get(`/server/control/studentlist/${this.servername}/${this.servertoken}`)
            .then( response => {
                this.studentlist = response.data.studentlist;
            }).catch( err => {console.log(err)});
        },  

        //upload files to all students
        sendFiles(who) {

            if (!this.files) { this.status("No Files selected"); return }
            this.status("File(s) uploading...");

            const formData = new FormData()
            formData.append('servertoken', this.servertoken);
            formData.append('servername', this.servername);
            for (const i of Object.keys(this.files)) {
                formData.append('files', this.files[i])
            }

            axios({
                method: "post", 
                url: `http://${this.serverip}:3000/server/data/send/${who}`, 
                data: formData, 
                headers: { 'Content-Type': `multipart/form-data; boundary=${formData._boundary}` }  
                })
                .then( response => {
                    this.status(response.data.message);
                    console.log(response.data);

                    if (response.data.status === "success") {
                        this.status("Files sent");
                        setTimeout(this.toggleUpload, 2000);  
                    } 

                }).catch( err => {console.log(err)});
        },  

        handleFileUpload( event ){
            this.files = event.target.files;
        },

        //stop and clear this exam server instance
        stopserver(){
             axios.get(`http://${this.serverip}:3000/server/control/stopserver/${this.servername}/${this.servertoken}`)
                .then( async (response) => {
                    this.status(response.data.message);
                    console.log(response.data);
                    await this.sleep(3000);
                    this.$router.push({ path: '/serverlist' })
                }).catch( err => {console.log(err)});
        },


        startExam(who){
            this.status("starting exam mode");
            if (who == "all"){
                if ( studentList.length <= 0 ) { this.status("no clients connected"); console.log("no clients connected") }
                else {  
                    studentList.forEach( (student) => {
                        //check exam mode for students - dont initialize twice
                        if (student.exammode){ return; }
                        axios.get(`http://${student.clientip}:3000/client/control/exammode/start/${student.token}`)
                            .then( response => {
                                this.status(response.data.message);
                                console.log(response.data);
                            }).catch(error => {console.log(error)});
                    });
                }
            }
        },



        endExam(who){
            this.status("stopping exam mode");
            if (who == "all"){
                if ( studentList.length <= 0 ) { this.status("no clients connected"); console.log("no clients connected") }
                else {  
                    studentList.forEach( (student) => {
                        axios.get(`http://${student.clientip}:3000/client/control/exammode/stop/${student.token}`)
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
                        axios.get(`http://${student.clientip}:3000/client/data/abgabe/send/${student.token}`)
                        .then( response => {
                            this.status(response.data.status);
                            console.log(response.data.message);
                        }).catch(error => {console.log(error)});
                    });
                }
            }
        },




        //remove student from exam
        kick(studenttoken, studentip){
            //unregister locally
            axios.get(`http://localhost:3000/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`)
            .then( response => {
                console.log(response.data);
                this.status(response.data.message);
            }).catch(error => {console.log(error)});

            //inform student
            axios.get(`http://${studentip}:3000/client/control/kick/${studenttoken}`)
            .then( response => {
                console.log(response.data);
            }).catch(error => {console.log(error)});
        },

          //remove student from exam
        async restore(studenttoken){
            await axios.get(`http://${this.serverip}:3000/server/control/studentlist/statechange/${this.servername}/${studenttoken}/true`)
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


        //validate a specific token
        async task2(token, ip){
             axios.get(`http://${ip}:3000/client/control/tokencheck/${token}`)
            .then(  response => {
                console.log(response.data);
            }).catch(error => {console.log(error)});
        },

        //show status message
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
        $("#statusdiv").fadeOut("slow")
        this.fetchInfo();
        this.fetchinterval = setInterval(() => { this.fetchInfo() }, 2000)
    },
    beforeUnmount() {
         clearInterval( this.fetchinterval )
    },
}

</script>



<style scoped>



</style>
