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
        <form id="uploadform" method="POST" action="http://localhost:3000/server/data/send/all" enctype="multipart/form-data">
            <div class="mb-3">
                <label for="formFileMultiple" class="form-label">Send Files to ALL Clients</label> 
                <div class="btn-close d-inline float-end" @click="toggleUpload()"></div>
                <input class="form-control" type="file" name="file" id="formFileMultiple" multiple>
                <input class="form-control" type="hidden" name="csrfservertoken" id="csrfservertoken" value="<%= it.csrfservertoken%>">
                <input class="form-control" type="hidden" name="servername" id="servername" value="<%= it.servername%>">
            </div>
            <input type="submit" name="submit" class="btn btn-info"/>
            <span id="status"></span> 
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
        
                <img v-bind:src="'/files/'+student.token+'.jpg?ver='+student.timestamp"  onerror="this.src='/src/assets/img/icons/nouserscreenshot.png'" class=" rounded-3 border"><br>
                
                <div class="btn-group p-2 ${activeclass}" role="group">
                    <button @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm">send</button>
                    <button @click='task2(student.token,student.clientip)' type="button" class="btn btn-outline-success btn-sm">get</button>

                       
                    <button  v-if="student.focus"   @click='restore(student.token)' type="button" class="btn btn-outline-success btn-sm">restore</button>
                </div>
            </div>





        </div>
    </div>




</div>


</template>





<script >
import $ from 'jquery'
import axios from "axios";

export default {
    data() {
        return {
            fetchinterval: null,
            studentlist: [],
            servername: this.$route.params.servername,
            servertoken: this.$route.params.servertoken,
        };
    },
    components: {
    
    },
    methods: {

        fetchInfo() {
            axios.get(`/server/control/studentlist/${this.servername}/${this.servertoken}`)
            .then( response => {
                this.studentlist = response.data.studentlist;
               
            })
            .catch( err => {console.log(err)});
        },  


        //remove student from exam
        kick(studenttoken, studentip){
            //unregister locally
            axios.get(`http://localhost:3000/server/control/kick/${this.servername}/${this.servertoken}/${studenttoken}`)
            .then( response => {
                console.log(response.data);
                this.status(response.data.message);
            });
            //inform student
            axios.get(`http://${studentip}:3000/client/control/kick/${studenttoken}`)
            .then( response => {
                console.log(response.data);
            });
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
