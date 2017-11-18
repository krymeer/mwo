<template>
 <div>
    <login></login>
 </div>
</template>

<script>
import { Login } from "./user";
import EventBus from "./eventBus";
export default {
  created: function() {
    EventBus.$on("login-success", token => {
			console.log('event:', token)
      this.token = token;
    });
  },
  data: function() {
    return {
      token: undefined
    };
  },
  components: {
    Login
  }
};
</script>

<style>

</style>
