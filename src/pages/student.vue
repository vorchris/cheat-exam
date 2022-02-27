<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Student</span>
</div>
 

<div id="wrapper" class="w-100 h-100 d-flex" >

    <!-- SIDEBAR -->
    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item">
                <router-link to="student" id="exams" class="nav-link active">
                    <img src="/src/assets/img/svg/server.svg" class="white me-2"  width="16" height="16" >
                    Running Exams
                </router-link>
            </li>
            <li>
                <router-link v-bind:to="'/editor/' + clientinfo.token" class="nav-link">
                    <img src="/src/assets/img/svg/question-square-fill.svg" class="white me-2"  width="16" height="16" >
                    Editor
                </router-link>
            </li>
        </ul>
        <div class="m-2">
            <br>
            <div id="statusdiv" class="btn btn-warning m-2"> Client started </div>
        </div>
    </div>

    <!-- CONTENT -->
    <div id="content" class="fadeinslow p-3">

       
        <div class="col-8" v-if="!remoterequest">
            <div class="input-group  mb-1">
                <span class="input-group-text col-3" style="min-width:120px;" id="inputGroup-sizing-lg">Username</span>
                <div class="col-sm-7"> 
                    <input v-model="username" type="text" class="form-control" id="user" placeholder="Thomas">
                </div>
            </div>   
            <div class="input-group  mb-3"> 
                <span class="input-group-text col-3" style="min-width:120px;" id="inputGroup-sizing-lg">Pincode</span>
                <div class="col-sm-7"> 
                    <input  v-model="pincode" type="text" class="form-control" id="pin" placeholder="1337">
                </div>
            </div>
        </div>
        <h4>Running Exams</h4>
        <div id="list" class="placeholder">

            <div v-for="server in serverlist" class="row p-3 m-0 mb-2 border bg-light" style="margin-right: 10px !important; width: 300px; min-width:250px; ">
                <dl class="row">
                    <dt class="col-sm-4">Name</dt>
                    <dd class="col-sm-8">{{server.servername}}</dd>
                    <!-- <dt class="col-sm-4">Last seen</dt>
                    <dd class="col-sm-8">{{server.timestamp}}</dd>
                    <dt class="col-sm-4">UUID</dt>
                    <dd class="col-sm-8">{{server.id}}</dd>
                    <dt class="col-sm-4">IP Address</dt>
                    <dd class="col-sm-8">{{server.serverip}}</dd> -->
                </dl>

                <input v-if="!token" :id="server.servername" type="button" name="register" class="btn btn-info" value="register" @click="registerClient(server.serverip,server.servername)"/>
                <input v-if="token && clientinfo.servername !== server.servername" :id="server.servername" type="button" name="register" class="btn btn-secondary" value="register" />
                <input v-if="token && clientinfo.servername === server.servername" :id="server.servername" type="button" name="register" class="btn btn-success" value="registered" />

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
            token: "",
            username: "Thomas",
            pincode: "1337",
            clientinfo: {},
            serverlist: [],
            remoterequest: false,
            fetchinterval: null,
        };
    },

    components: {
    
    },
    methods: {
        fetchInfo() {
            axios.get("/client/control/getinfo")
            .then( response => {
                this.clientinfo = response.data.clientinfo;
                this.serverlist = response.data.serverlist;
                this.token = this.clientinfo.token;
                if (this.clientinfo && this.clientinfo.token){  // if client is already registered disable button (this is also handled on api level)
                    let registerbuttons =  document.getElementsByName("register");
                    registerbuttons.forEach( button => {button.disabled = true; });
                }
            })
            .catch( err => {console.log(err)});
        },      
        

        /** register client on the server **/
        async registerClient(serverip, servername){
            $(`#${servername}`).val("registering...");   //well be overwritten by fetchInfo()
            await axios.get(`http://localhost:3000/client/control/register/${serverip}/${servername}/${this.pincode}/${this.username}`)
            .then( response => { 
                this.status(response.data.message);
                console.log(response.data.message);
            }).catch( err => console.log(err));
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

    mounted() {
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
