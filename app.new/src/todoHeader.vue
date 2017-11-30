<template>
  <header>
    <a class="block" href="./">
      <h1>ToDoApp</h1>
    </a>
    <navBar></navBar>
  </header>
</template>

<script>
  import './css/header.css';
  import navBar from './navBar.vue'
  export default {
    components: {
      navBar
    }
  }
</script>