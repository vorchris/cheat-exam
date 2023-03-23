<template>

 
<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <span class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-1 ">Next-Exam</span>
    </span>
    <span class="fs-4 align-middle ms-3" style="float: right">MSAuth</span>
</div>
 
<div id="wrapper" class="w-100 h-100 d-flex" >
    <!-- sidebar start -->
    <div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">
        <div class="form-check m-1 mb-3">
            <input  @click="loginPopup()" value="office365" class="form-check-input" type="radio" name="examtype" id="examtype4">
            <label class="form-check-label" for="examtype4"> office365  </label>
        </div>
    </div>
    <span style="position: absolute; bottom:2px; left: 4px; font-size:0.8em">{{version}}</span>
    <!-- sidebar end -->
</div>
</template>



<script >

import { VueDraggableNext } from 'vue-draggable-next'
import { useIsAuthenticated } from "../msalutils/composition-api/useIsAuthenticated";
import { useMsal } from '../msalutils/composition-api/useMsal';
import { loginRequest } from "../msalutils/authConfig";


export default {
    data() {
        return {
            version: this.$route.params.version,
            title: document.title,
            instanc: null
        };
    },
    methods: {
        loginPopup() {
            this.instance.instance.loginRedirect(loginRequest);
        },
        
    },
    mounted() {  // when ready
       
        this.isAuthenticated = useIsAuthenticated();
        this.instance = useMsal();
    },
    beforeUnmount() {  //when leaving
    } 
}
</script>
<style scoped>






#content {
    background-color: whitesmoke;
}

.infobutton{
    width: 240px;
    min-width: 240px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: whitesmoke;
}

#studentslist{
    border-radius: 5px;
    width: 100%;
    height: 90%;
    /* border: 1px solid rgb(99, 187, 175); */
    padding-bottom:100px;
    transition:0.1s;
    overflow-y:auto;
}


.disabledexam {
    filter: contrast(20%) grayscale(100%) brightness(80%) blur(0.6px);
   pointer-events: none;
}

#pdfpreview {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:10000;
    backdrop-filter: blur(3px);
}
#pdfembed { 
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -30vw;
    margin-top: -48vh;
    width:60vw;
    height: 96vh;
   
    background-color: rgba(255, 255, 255, 1);
    border: 2px solid #212529;
    box-shadow: 0 0 15px rgba(22, 9, 9, 0.589);
    
    border-radius: 6px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: #212529;
    z-index:-1;
}








#preview {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index:1000;
}
#workfolder { 
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    z-index:1001;
    backdrop-filter: blur(3px);
    overflow-y: auto;
}



#studentinfocontainer {
    display: none;
    position: absolute;
    top:0;
    left: 0;
    width:100vw;
    height: 100vh;
    z-index:100;
}
#studentinfodiv {
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height: 100vh;
    background-size:cover;
    background-repeat: no-repeat;
    overflow:hidden;
    background-color: #343a40;
 
}
#controlbuttons {
    backdrop-filter: blur(3px);
    position: absolute;
    right: 0px;
    width: 128px; 
    height: 100%; 
    top: 0px;  
    background:  rgba(97, 97, 97, 0.693);
    color: white; 
    font-size: 1.4em; 
    padding: 10px;
}


hr {
    margin: 0.2em 0.9em 0.5em 0.3em;
   
    background-color: #b3b3b3;
    border: 0;
    opacity: 0.25;
}

</style>
