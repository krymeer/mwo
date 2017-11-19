<template>
 <div id="main_container" class="grid">
    <popup></popup>
    <notePopup></notePopup>
    <todoHeader></todoHeader>
    <login></login>
    <todoFooter></todoFooter>
 </div>
</template>

<script>
import { Login } from './user'
import todoHeader from './todoHeader.vue'
import todoFooter from './todoFooter.vue'
import notePopup from './notePopup.vue'
import popup from './popup.vue'
import EventBus from './eventBus'
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
    Login, todoHeader, todoFooter, popup, notePopup
  }
}
</script>

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>
