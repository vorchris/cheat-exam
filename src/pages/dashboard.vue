<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Dashboard</span>
</div>
 


<div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">


      <div class="btn btn-light m-1">Name <br><b> { it.servername }</b> </div><br>
      <div class="btn btn-danger m-1" onclick="stopserver()">Stop Server</div><br>
      <div class="btn btn-light m-1">Pin <br><b> { it.pin } </b>  </div><br>
      <br>
      <div id="statusdiv" class="btn btn-warning m-2"> connected </div>





</div>





</template>





<script setup>


</script>



<style scoped>



</style>
