<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img :src="'./img/svg/server.svg'" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">VUExam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Teacher</span>
</div>
 


<div id="wrapper" class="w-100 h-100 d-flex" >
    <div id="container" class="fadeinslow text-center">
        <div class="position-absolute start-50 translate-middle text-center" style="top: 180px; min-width:268px">
        
            <div class="row position-relative text-center p-3" >  
                <h4> Welcome </h4>
            </div>
        
            <div class="row justify-content-md-center">
                <div class="col ">
                    <router-link to="startserver" id="studentbutton" class="text-center btn btn-lg btn-success position-relative p-3 m-2 padding-lr-2"> 
                        <img src='/src/assets/img/svg/shield-lock.svg' class="white"  width="32" height="32" > 
                        <svg width="1.5em" height="1.5em" viewBox="0 0 16 14" class="arrow position-absolute top-100 start-50 translate-middle mt-1 bi bi-caret-down-fill" fill="#198754" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    </router-link>
                </div>
            </div>

            <div class="row">
                <div class="col m-1">
                    start exam
                </div>
                
              
            </div>

        
        </div>
    </div>
</div>
 





</template>





<script setup>


</script>



<style scoped>



</style>
