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
        <div class="btn btn-light m-0 text-start infobutton">
            <img src='/src/assets/img/svg/server.svg' class="me-2"  width="16" height="16" > {{$t('student.exams')}} 
        </div><br>
        <div v-if="!advanced" id="adv"  class="btn btn-sm btn-outline-secondary mt-2" @click="toggleAdvanced();"> {{ $t("student.advanced") }}</div>
        <div v-if="advanced" id="adv"  class="btn btn-sm btn-outline-secondary mt-2" @click="toggleAdvanced();"> {{ $t("student.simple") }}</div>
        

        <span @click="showCopyleft()" style="position: absolute; bottom:2px; left: 6px; font-size:0.8em;cursor: pointer;">
            <span style=" display:inline-block; transform: scaleX(-1);font-size:1.2em; ">&copy; </span> 
            <span style="vertical-align: text-bottom;">&nbsp;{{version}}</span>
        </span>

    </div>

    <!-- CONTENT -->
    <div id="content" class="fadeinslow p-3">



        <div class="col-8 mb-2">
            <div class="input-group  mb-1">
                <span class="input-group-text col-3" style="width:135px;" id="inputGroup-sizing-lg">{{ $t("student.username") }}</span>
                <input v-model="username" type="text" required="required" maxlength="25" class="form-control" id="user" placeholder="" style="width:200px;max-width:200px;min-width:200px;">
            </div>   
            <div class="input-group  mb-1"> 
                <span class="input-group-text col-3" style="width:135px;" id="inputGroup-sizing-lg">{{ $t("student.pin") }}</span>
                <input  v-model="pincode" type="number" min="0" oninput="validity.valid||(value='')" class="form-control" id="pin" placeholder="" style="width:100px;max-width:100px;min-width:100px;">
            </div>
            <div v-if="advanced" class="input-group  mb-1"> 
                <span class="input-group-text col-3" style="width:135px;" id="inputGroup-sizing-lg">{{ $t("student.ip") }}</span>
                <input  v-model="serverip" class="form-control" id="serverip" placeholder="" style="width:135px;max-width:135px;min-width:135px;">
            </div>
        </div>
  
  
       
   
        <h4 class="mt-4">{{ $t("student.exams") }}</h4>
        <div id="list" class="" style="overflow-y:auto; height: 369px; display:flex; flex-wrap: wrap; flex-direction: row;">
            <div v-for="server in serverlist" class="row p-3 m-0 mb-2 border bg-light" style="border-radius: 4px; margin-right: 10px !important; min-height:100px; max-height:100px;  min-width:234px; max-width: 234px;">
                <strong style="padding:0px;">{{server.servername}}
                <img v-if="!server.reachable" src="/src/assets/img/svg/emblem-warning.svg" :title="$t('student.unreachable')"  style="width:20px;float:right;vertical-align:top;cursor: help;" ></strong>  
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
            info: config.info,
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
            let getinfo = ipcRenderer.sendSync('getinfo')  // gets serverlist and clientinfo from multicastclient
            
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

            // check im networkconnection is still alive - otherwise exit here
            this.hostip = ipcRenderer.sendSync('checkhostip')
            if (!this.hostip) return;  
            for (let server of this.serverlist){ 
                    axios({method:'get',url:`https://${server.serverip}:${this.serverApiPort}/server/control/pong`, timeout:2000})
                    .then( response => { server.reachable=true }) 
                    .catch(err => { console.log(err.message);server.reachable=false  }) 
            }
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
                let IPCresponse = ipcRenderer.sendSync('register', {clientname:this.username, servername:servername, serverip, serverip, pin:this.pincode })
                console.log(IPCresponse)
                if (IPCresponse && IPCresponse.token){
                    this.token = IPCresponse.token  // set token (used to determine server connection status)
                }

                if (IPCresponse.status === "success") {
                        this.$swal.fire({
                            title: "OK",
                            text: this.$t("student.registeredinfo"),
                            icon: 'success',
                            timer: 3000,
                            showCancelButton: false,
                            didOpen: () => { this.$swal.showLoading(); },
                        })

               
                    }
                if (IPCresponse.status === "error") {
                    this.$swal.fire({
                        title: "Error",
                        text: IPCresponse.message,
                        icon: 'error',
                        showCancelButton: false,
                    })
                }
            }
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
    },
    mounted() {  
        this.fetchInfo();
        this.fetchinterval = setInterval(() => { this.fetchInfo() }, 4000)

        // add event listener to user input field to supress all special chars 
        document.getElementById("user").addEventListener("keypress", function(e) {
            var lettersOnly = /^[a-zA-Z ]+$/;
            var key = e.key || String.fromCharCode(e.which);
            if (!lettersOnly.test(key)) { e.preventDefault(); }
        });
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
