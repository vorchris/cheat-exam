<template>


<div  id="apphead" class="w-100 p-3 text-white bg-dark shadow text-right ">
    <router-link to="/" class="text-white m-1">
        <img src='/src/assets/img/svg/speedometer.svg' class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle  ms-3" style="float: right">Student</span>
    <div v-if="token" id="adv" class="btn btn-success btn-sm m-0  mt-1 " style="cursor: unset; float: right">{{ $t("student.connected") }}</div>
    <div v-if="!hostip" id="adv" class="btn btn-danger btn-sm m-0  mt-1 " style="cursor: unset; float: right">{{ $t("student.offline") }}</div>

</div>
 

<div id="wrapper" class="w-100 h-100 d-flex" >

    <!-- SIDEBAR -->
    <div class="p-3 text-white bg-dark h-100" style="width: 240px; min-width: 240px;">
        <div class="btn btn-light m-0 text-start infobutton"><img src='/src/assets/img/svg/server.svg' class="me-2"  width="16" height="16" > {{$t('student.exams')}} </div><br>
        <div v-if="!advanced" id="adv"  class="btn btn-sm btn-outline-secondary mt-2" @click="toggleAdvanced();"> {{ $t("student.advanced") }}</div>
        <div v-if="advanced" id="adv"  class="btn btn-sm btn-outline-secondary mt-2" @click="toggleAdvanced();"> {{ $t("student.simple") }}</div>
        <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
    </div>

    <!-- CONTENT -->
    <div id="content" class="fadeinslow p-3">
        <div class="col-8 mb-2">
            <div class="input-group  mb-1">
                <span class="input-group-text col-3" style="width:135px;" id="inputGroup-sizing-lg">{{ $t("student.username") }}</span>
                <input v-model="username" type="text" class="form-control" id="user" placeholder="" style="width:135px;max-width:135px;min-width:135px;">
            </div>   
            <div class="input-group  mb-1"> 
                <span class="input-group-text col-3" style="width:135px;" id="inputGroup-sizing-lg">{{ $t("student.pin") }}</span>
                <input  v-model="pincode" type="number" min="0" oninput="validity.valid||(value='')" class="form-control" id="pin" placeholder="" style="width:135px;max-width:135px;min-width:135px;">
            </div>
            <div v-if="advanced" class="input-group  mb-1"> 
                <span class="input-group-text col-3" style="width:135px;" id="inputGroup-sizing-lg">{{ $t("student.ip") }}</span>
                <input  v-model="serverip" class="form-control" id="serverip" placeholder="" style="width:135px;max-width:135px;min-width:135px;">
            </div>
        </div>

  
       
   
        <h4 class="mt-4">{{ $t("student.exams") }}</h4>
        <div id="list" class="placeholder" style="overflow-y:auto; height: 369px; display:flex; flex-wrap: wrap; flex-direction: row;">
            <div v-for="server in serverlist" class="row p-3 m-0 mb-2 border bg-light" style="margin-right: 10px !important; min-height:100px; max-height:100px;  min-width:270px; max-width: 270px;">
                <strong style=" padding: 0px;">{{server.servername}}</strong>
                <input v-if="!token" :id="server.servername" type="button" name="register" class="btn btn-sm btn-info" :value="$t('student.register')" @click="registerClient(server.serverip,server.servername)"/>
                <input v-if="token && clientinfo.servername !== server.servername" :id="server.servername" disabled type="button" name="register" class="btn btn-secondary" :value="$t('student.register')" />
                <input v-if="token && clientinfo.servername === server.servername" :id="server.servername" disabled type="button" name="register" class="btn btn-success" :value="$t('student.registered')" />
            </div>
            <div v-if="serverlist.length === 0"><h5>0</h5> </div>
        </div>
    </div>
</div>


</template>


<script>
import axios from "axios";
import validator from 'validator'

export default {
    data() {
        return {
            version: this.$route.params.version,
            token: "",
            username: config.development ? "Thomas":"",
            pincode: config.development ? "1337":"",
            clientinfo: {},
            serverlist: [],
            fetchinterval: null,
            serverApiPort: this.$route.params.serverApiPort,
            clientApiPort: this.$route.params.clientApiPort,
            electron: this.$route.params.electron,
            startExamEvent: null,
            advanced: false,
            serverip: "",
            servername: "",
            hostip: config.hostip
            
        };
    },
    methods: {
        fetchInfo() {
            let getinfo = ipcRenderer.sendSync('getinfo')  // we need to fetch the updated version of the systemconfig from express api (server.js)
            
            this.clientinfo = getinfo.clientinfo;
            this.token = this.clientinfo.token;

            if (getinfo.serverlist.length  === 0) {
                if (validator.isIP(this.serverip) || validator.isFQDN(this.serverip)){
                        console.log("fetching exams from server")
                        axios.get(`https://${this.serverip}:${this.serverApiPort}/server/control/serverlist`)
                        .then( response => { if (response.data && response.data.status == "success") {  this.serverlist = response.data.serverlist} }) 
                        .catch(err => { console.log(err.message)}) 
                }
                else { this.serverlist = getinfo.serverlist;  }
            }
            else { this.serverlist = getinfo.serverlist;   }
        },  
        
        toggleAdvanced(){
            if (this.advanced) {this.advanced = false} else {this.advanced = true}
            this.serverip = ""
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
    },
    mounted() {  
        this.fetchInfo();
        this.fetchinterval = setInterval(() => { this.fetchInfo() }, 2000)
    },
    beforeUnmount() {
        clearInterval( this.fetchinterval )
    }
}
</script>

<style scoped>
    
#content {
    background-color: whitesmoke;
    min-width: 680px;
}

.infobutton{
    width: 240px;
    min-width: 240px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: whitesmoke;
}

</style>
