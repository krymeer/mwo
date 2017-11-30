<template>
  <nav v-if="userLogged">
    <i data-title="plan zajęć" class="material-icons">school</i>
    <i data-title="wyloguj się" class="material-icons" @click="logOut()">power_settings_new</i>
  </nav>
</template>

<script>
  import EventBus from './eventBus'
  import './css/navBar.css';
  export default {
    created: function() {
      EventBus.$on("show-navbar", (loggedIn) => {
        if (loggedIn) {
          this.userLogged = true;
        }
      });
    },
    methods: {
      logOut: function() {
        this.userLogged = false;
        EventBus.$emit('user-logout');
      }
    },
    data: function() {
      return {
        userLogged: false
      }
    }
  }
</script>