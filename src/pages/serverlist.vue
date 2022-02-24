<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/shield-lock-fill.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Teacher</span>
</div>
 



<div id="wrapper" class="w-100 h-100 d-flex" >

    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
        <ul class="nav nav-pills flex-column mb-auto ">
        <li class="nav-item">
            <router-link to="startserver" id="startserver" class="nav-link">
            <img src="/src/assets/img/svg/server.svg" class="white me-2"  width="16" height="16" >
            Start Exam Server
            </router-link >
        </li>
        <li>
            <router-link to="serverlist" id="serverlist" class="nav-link active">
            <img src="/src/assets/img/svg/person-lines-fill.svg" class="white me-2"  width="16" height="16" >
            Server List
            </router-link>
        </li>
        <li>
            <router-link to="#" class="nav-link">
            <img src="/src/assets/img/svg/question-square-fill.svg" class="white me-2"  width="16" height="16" >
            Help
            </router-link>
        </li>
        </ul>
        <div class="m-2">
        <br>
        <div id="statusdiv" class="btn btn-warning m-2 hidden"> </div>
        </div>
        <br>
    </div>


    <div id="content" class="fadeinslow p-3">
        <div id="list" class="container-fluid m-0 p-0">



            <div class='row g-2'>
           
                <div  v-for="server in serverlist" class="col-6" style="min-width:310px; max-width: 400px;">
                            <div class="p-3 border bg-light">
                                <dl class="row">
                                    <dt class="col-sm-4 p-1">Name</dt>
                                    <dd class="col-sm-8 p-1">{{server.servername}}</dd>
                                    <dt class="col-sm-4 p-1">IP Address</dt>
                                    <dd class="col-sm-8 p-1">{{server.serverip}}</dd>
                                    <dt class="col-sm-4 p-1 pt-2">Password</dt>
                                    <dd class="col-sm-8 p-1">
                                        <form method="POST" enctype="multipart/form-data" action='http://localhost:3000/server/ui/dashboard/${server.servername}' id='${server.servername}'> 
                                        <input type="password" class="form-control" name="loginpassword" id="loginpassword" placeholder="password" value="password">
                                        <input type="submit" name="login" class="btn btn-success mt-2" value="Log In"/> </form>
                                    </dd>
                                    <dt class="col-sm-4"></dt>
                                    <dd class="col-sm-8">
                                    </dd>
                                </dl>
                            </div>
                        </div>
            
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
            fetchinterval: null,
            serverlist: [],
        };
    },
    components: {
    
    },
    methods: {

        fetchInfo() {
            axios.get("/server/control/serverlist")
            .then( response => {
                this.serverlist = response.data.serverlist;
            })
            .catch( err => {console.log(err)});
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
