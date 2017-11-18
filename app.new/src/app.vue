<template>
 <div id="main_container" class="grid">
    <todoHeader></todoHeader>
    <login></login>
    <todoFooter></todoFooter>
 </div>
</template>

<script>
import { Login } from './user'
import todoHeader from './todoHeader.vue'
import todoFooter from './todoFooter.vue'
export default {
  components: {
    Login, todoHeader, todoFooter
  }
}
</script>

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>
