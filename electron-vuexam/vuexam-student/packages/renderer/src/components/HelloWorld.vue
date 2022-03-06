<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
    <h1>{{ msg }}</h1>

    <div id="button" @click="get()" class="btn btn-success">Bootstrap</div><br>
    <br>
    Dynamic Var: {{username}}
    <br>
    <br>

</template>


<script lang="ts">
    import axios from "axios";

    export default {
        data() {
            return {
                username: "42",
            };
        },

        components: {
        
        },
        methods: {
            get() {
                axios.get("http://localhost:3000/")
                .then( response => {
                    this.username = response.data.message;
                })
                .catch( err => {console.log(err)});
            }

        },  
        mounted() {
        $("#button").text("this text is set by jquery - click me to fetch something from express")
       
        },
        beforeUnmount() {
    
        },
    }
</script>



<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
