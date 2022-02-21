<template>
  <div class="w-100 p-3 text-white bg-dark shadow text-right">
      <router-link to="/" class="text-white m-1">
        <img src="/src/assets/img/svg/speedometer.svg" class="white me-2  " width="32" height="32" >
        <span class="fs-4 align-middle me-4 ">Next-Exam</span>
      </router-link>
      <span class="fs-4 align-middle" style="float: right">Student</span>

  </div>










  <div>
  
    <router-view v-slot="{ Component }">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </router-view>
    
  </div>
</template>


