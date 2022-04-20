<template>


<div  id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right ">
    <router-link to="/" class="text-white m-1">
        <img src='/src/assets/img/svg/speedometer.svg' class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
     <!-- <router-link to="/ltest/" class="text-white m-1">
        <img src='/src/assets/img/svg/speedometer.svg' class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>  -->

    <div v-if="token" id="adv" class="btn btn-success btn-sm m-0 " style="cursor: unset;">{{ $t("student.connected") }}</div>

    <span class="fs-4 align-middle" style="float: right">Student</span>
</div>
 

<div id="wrapper" class="w-100 h-100 d-flex" >

    <!-- SIDEBAR -->
    <div class="p-3 text-white bg-dark h-100" style="width: 240px; min-width: 240px;">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item mb-2">
                <router-link to="student" id="exams" class="nav-link active" style="cursor: unset;">
                    <img src='/src/assets/img/svg/server.svg' class="white me-2"  width="16" height="16" >
                    {{ $t("student.exams") }}
                </router-link>
            </li>
            <li class="nav-item mb-2" >
                <div v-if="!advanced" id="adv" style="float: right" class="btn btn-sm btn-outline-secondary" @click="toggleAdvanced();"> {{ $t("student.advanced") }}</div>
                <div v-if="advanced" id="adv" style="float: right" class="btn btn-sm btn-outline-secondary" @click="toggleAdvanced();"> {{ $t("student.simple") }}</div>
            </li>
        </ul>
      
        <div class="m-2">
            <br>
            <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
        </div>
    </div>

    <!-- CONTENT -->
    <div id="content" class="fadeinslow p-3">
        <div class="col-8 mb-2" v-if="!remoterequest">
            <div class="input-group  mb-1">
                <span class="input-group-text col-3" style="min-width:135px;" id="inputGroup-sizing-lg">{{ $t("student.username") }}</span>
                <div class="col-sm-7"> 
                    <input v-model="username" type="text" class="form-control" id="user" placeholder="" style="min-width:135px;">
                </div>
            </div>   
            <div class="input-group  mb-1"> 
                <span class="input-group-text col-3" style="min-width:135px;" id="inputGroup-sizing-lg">{{ $t("student.pin") }}</span>
                <div class="col-sm-7"> 
                    <input  v-model="pincode" type="number" min="0" oninput="validity.valid||(value='')" class="form-control" id="pin" placeholder="" style="min-width:135px;">
                </div>
            </div>
            <div v-if="advanced" class="input-group  mb-1"> 
                <span class="input-group-text col-3" style="min-width:135px;" id="inputGroup-sizing-lg">{{ $t("student.ip") }}</span>
                <div class="col-sm-7"> 
                    <input  v-model="serverip" class="form-control" id="serverip" placeholder="" style="min-width:135px;">
                </div>
            </div>
             <div v-if="advanced" class="input-group  mb-2"> 
                <span class="input-group-text col-3" style="min-width:135px;" id="inputGroup-sizing-lg">{{ $t("student.examname") }}</span>
                <div class="col-sm-7"> 
                    <input  v-model="servername" class="form-control" id="servername" placeholder="" style="min-width:135px;">
                </div>
            </div>
        <div  v-if="advanced" class="btn btn-success" @click="registerClient()">{{ $t("student.register") }}</div> <br>
        </div>


  
       
        
        
        
        
        
        
        <h4 v-if="!advanced">{{ $t("student.exams") }}</h4>
      
 
        <div id="list" class="placeholder" style="overflow-y:auto; height: 369px; display:flex; flex-wrap: wrap; flex-direction: row;">

            <div v-if="!advanced" v-for="server in serverlist" class="row p-3 m-0 mb-2 border bg-light" style="margin-right: 10px !important; min-height:130px; max-height:140px;  min-width:240px; max-width: 240px;">
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
import axios from "axios";

export default {
    data() {
        return {
            version: this.$route.params.version,
            token: "",
            username: config.development ? "Thomas":"",
            pincode: config.development ? "1337":"",
            clientinfo: {},
            serverlist: [],
            remoterequest: false,
            fetchinterval: null,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            electron: this.$route.params.electron,
            startExamEvent: null,
            advanced: false,
            serverip: "",
            servername: ""
        };
    },

    components: {
    
    },
    methods: {
        fetchInfo() {
            axios.get(`https://localhost:${this.clientApiPort}/client/control/getinfo`)
            .then( response => {
                this.clientinfo = response.data.clientinfo;
                this.serverlist = response.data.serverlist;
                this.token = this.clientinfo.token;
            })
            .catch( err => {console.log(err)});
        },  
        
        toggleAdvanced(){
            if (this.advanced) {this.advanced = false} else {this.advanced = true}
        },
        
        /** register client on the server **/
        registerClient(serverip, servername){
           if (this.username === "" || this.pincode ===""){
               this.$swal.fire({
                            title: "Error",
                            text: this.$t("student.nopw"),
                            icon: 'error',
                            showCancelButton: false,
                        })
             
            }
            else {
                // we allow students to manually insert domain/ip - just in case multicast is blocked for some reason
                if (this.advanced){
                    if (this.serverip === "" || this.servername ===""){
                        this.$swal.fire({
                            title: "Error",
                            text: this.$t("student.noip"),
                            icon: 'error',
                            showCancelButton: false,
                        })
                        return;
                    }
                    serverip = this.serverip;
                    servername = this.servername;
                    console.log(serverip)
                }
             

                axios.get(`https://localhost:${this.clientApiPort}/client/control/register/${serverip}/${servername}/${this.pincode}/${this.username}`)
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
                .catch( err => {
                    this.$swal.fire({
                            title: "Error",
                            text: err.data.message,
                            icon: 'error',
                            showCancelButton: false,
                        })
                });
            }
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
