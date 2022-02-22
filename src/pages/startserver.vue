<template>


<div class="w-100 p-3 text-white bg-dark shadow text-right">
    <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/shield-lock-fill.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
    </router-link>
    <span class="fs-4 align-middle" style="float: right">Teacher</span>
</div>
 





<div class="p-3 text-white bg-dark h-100 " style="width: 240px; min-width: 240px;">


  <ul class="nav nav-pills flex-column mb-auto ">
    <li class="nav-item">
      <a href="/startserver" id="startserver" class="nav-link active">
        <img src="/src/assets/img/svg/server.svg" class="white me-2"  width="16" height="16" >
        Start Exam Server
      </a>
    </li>
    <li>
      <a href="/serverlist" id="serverlist" class="nav-link">
        <img src="/src/assets/img/svg/person-lines-fill.svg" class="white me-2"  width="16" height="16" >
        Server List
      </a>
    </li>
    <li>
      <a href="#" class="nav-link">
        <img src="/src/assets/img/svg/question-square-fill.svg" class="white me-2"  width="16" height="16" >
        Help
      </a>
    </li>
  </ul>
  <div class="m-2">
    <br>
    <div id="statusdiv" class="btn btn-warning m-2"> </div>
  </div>
  <br>



</div>


</template>





<script setup>


</script>



<style scoped>



</style>
