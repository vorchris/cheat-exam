<template>


<div  id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right ">
    <router-link to="/" class="text-white m-1">
        <img src='/src/assets/img/svg/speedometer.svg' class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
     <!-- <router-link to="/ltest/" class="text-white m-1">
        <img src='/src/assets/img/svg/speedometer.svg' class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link> -->
    <span class="fs-4 align-middle" style="float: right">Student</span>
</div>
 

<div id="wrapper" class="w-100 h-100 d-flex" >

    <!-- SIDEBAR -->
    <div class="p-3 text-white bg-dark h-100" style="width: 240px; min-width: 240px;">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <router-link to="student" id="exams" class="nav-link active">
                    <img src='/src/assets/img/svg/server.svg' class="white me-2"  width="16" height="16" >
                    {{ $t("student.exams") }}
                </router-link>
            </li>
        </ul>
        <div class="m-2">
            <br>
            <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
        </div>
    </div>

    <!-- CONTENT -->
    <div id="content" class="fadeinslow p-3">
        <div class="col-8" v-if="!remoterequest">
            <div class="input-group  mb-1">
                <span class="input-group-text col-3" style="min-width:135px;" id="inputGroup-sizing-lg">{{ $t("student.username") }}</span>
                <div class="col-sm-7"> 
                    <input v-model="username" type="text" class="form-control" id="user" placeholder="Thomas" style="min-width:135px;">
                </div>
            </div>   
            <div class="input-group  mb-3"> 
                <span class="input-group-text col-3" style="min-width:135px;" id="inputGroup-sizing-lg">{{ $t("student.pin") }}</span>
                <div class="col-sm-7"> 
                    <input  v-model="pincode" type="text" class="form-control" id="pin" placeholder="1337" style="min-width:135px;">
                </div>
            </div>
        </div>
        <h4>{{ $t("student.exams") }}</h4>
      
 
        <div id="list" class="placeholder" style="overflow-y:auto; height: 369px; display:flex; flex-wrap: wrap; flex-direction: row;">

            <div v-for="server in serverlist" class="row p-3 m-0 mb-2 border bg-light" style="margin-right: 10px !important; min-height:130px; max-height:140px;  min-width:240px; max-width: 240px;">
                <dl class="row">
                    <dt class="col-sm-4">{{ $t("student.name") }}</dt>
                    <dd class="col-sm-9">{{server.servername}}</dd>
                </dl>
                  
                <input v-if="!token" :id="server.servername" type="button" name="register" class="btn btn-info" :value="$t('student.register')" @click="registerClient(server.serverip,server.servername)"/>
                <input v-if="token && clientinfo.servername !== server.servername" :id="server.servername" disabled type="button" name="register" class="btn btn-secondary" :value="$t('student.register')" />
                <input v-if="token && clientinfo.servername === server.servername" :id="server.servername" disabled type="button" name="register" class="btn btn-success" :value="$t('student.registered')" />
      
            </div>
        </div>
    </div>
</div>


</template>


<script>
import $ from 'jquery'
import axios from "axios";


export default {
    data() {
        return {
            version: this.$route.params.version,
            token: "",
            username: "Thomas",
            pincode: "1337",
            clientinfo: {},
            serverlist: [],
            remoterequest: false,
            fetchinterval: null,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            electron: this.$route.params.electron,
            startExamEvent: null
        };
    },

    components: {
    
    },
    methods: {
        fetchInfo() {
            axios.get(`http://localhost:${this.clientApiPort}/client/control/getinfo`)
            .then( response => {
                this.clientinfo = response.data.clientinfo;
                this.serverlist = response.data.serverlist;
                this.token = this.clientinfo.token;
            })
            .catch( err => {console.log(err)});
        },      
        
        /** register client on the server **/
        registerClient(serverip, servername){
            axios.get(`http://localhost:${this.clientApiPort}/client/control/register/${serverip}/${servername}/${this.pincode}/${this.username}`)
            .then( response => { 
                this.token = response.data.token  // set token immediately for further use (editor , geogebra)

                if (response.data.status === "success") {
                    this.$swal.fire({
                        title: "OK",
                        text: this.$t("student.registeredinfo"),
                        icon: 'success',
                        showCancelButton: false,
                    })
                }
                
                if (response.data.status === "error") {
                    this.$swal.fire({
                        title: "Error",
                        text: response.data.message,
                        icon: 'error',
                        showCancelButton: false,
                    })
                }
               


            })
            .catch( err => console.log(err));
        },

       
        // implementing a sleep (wait) function
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    },

    mounted() {  
      
        this.fetchInfo();
        this.fetchinterval = setInterval(() => { this.fetchInfo() }, 2000)

        if (this.electron){
             this.startExamEvent = ipcRenderer.on('exam', (event, token, examtype) => {
                if (examtype === "language") {
                    this.$router.push({ name: 'editor', params:{ token: token } });
                }
                else {
                    this.$router.push({ name: 'math', params:{ token: token } });
                }
            });
        }
    },

    beforeUnmount() {
        clearInterval( this.fetchinterval )
        this.startExamEvent.removeAllListeners('exam')   //remove  self
    },
}
</script>




<style scoped>
</style>
