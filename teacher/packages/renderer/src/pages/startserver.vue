<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/shield-lock-fill.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-1 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Teacher</span>
</div>
 


<div id="wrapper" class="w-100 h-100 d-flex" >

    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
        <ul class="nav nav-pills flex-column mb-auto ">
            <li class="nav-item">
                <div class="btn btn-light m-0 text-start infobutton">
                    <img src='/src/assets/img/svg/server.svg' class="me-2"  width="16" height="16" > 
                    {{$t("general.startserver")}}
                </div><br>
            </li>
            <li>
                <router-link to="serverlist" id="serverlist" class="nav-link">
                    <img src="/src/assets/img/svg/person-lines-fill.svg" class="white me-2"  width="16" height="16" >
                    {{$t("general.slist")}}
                </router-link> 
            </li>
        </ul>
        <div class="m-2">
            <br>
            <div id="statusdiv" class="btn btn-warning m-2 hidden">{{$t("startserver.connected")}}</div>
        </div>
        <br>
        <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
    </div>

    <div id="content" class="fadeinslow p-3">
        <div class="col-7">
            <div class="input-group  mb-1">
                <span class="input-group-text col-4" style="width:135px;" id="inputGroup-sizing-lg">{{$t("startserver.examname")}}</span>
                <input v-model="servername" type="text" class="form-control" id="servername" placeholder="Mathematik-5a" style="width:135px;max-width:135px;min-width:135px;">
            </div>   
            <div class="input-group  mb-3"> 
                <span class="input-group-text col-4" style="width:135px;" id="inputGroup-sizing-lg">{{$t("startserver.pwd")}}</span>
                <input v-model="password" type="text" class="form-control " id="password" placeholder="password" style="width:135px;max-width:135px;min-width:135px;">
            </div>
            <div class="col mb-4" >
                <button @click="startServer()" id="examstart" class="btn btn-success" value="start exam" style="width:135px;">{{$t("startserver.start")}}</button>
            </div>
        </div>
        <div id="list" class="placeholder"></div>
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
            title: document.title,
            servername : config.development ? "Mathe5A":"",
            password: config.development ? "password":"",
            prod : false,
            serverApiPort: this.$route.params.serverApiPort,
            electron: this.$route.params.electron,
            hostname: window.location.hostname
        };
    },
    components: {},
    methods: {
        async startServer(){
            if (this.servername ==="" || this.password ===""){
                this.status(this.$t("startserver.emptypw")); 
            }
            else {
                await axios.get(`https://${this.hostname}:${this.serverApiPort}/server/control/start/${this.servername}/${this.password}`)
                .then( async (response) => {
                    if (response.data.status === "success") {  //directly log in
                        this.status(response.data.message);
                        await this.sleep(1000);
                        if (this.electron){
                            this.$router.push({  // for some reason this doesn't work on mobile
                                name: 'dashboard', 
                                params:{
                                    servername: this.servername, 
                                    passwd: this.password
                                }
                            })
                        }
                        else {window.location.href = `#/dashboard/${this.servername}/${this.password}`}
                    }
                    else { this.status(response.data.message); }
                }).catch(err => { this.status(err)}); 
            } 
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
        if (this.prod) {  //clear input fields in production mode
            $("#servername").val("")
            $("#pin").val("")
            $("#password").val("")
        }
        if (this.electron){
            this.hostname = "localhost"
        }
    },
    beforeUnmount() {
        clearInterval( this.fetchinterval )
    },
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
