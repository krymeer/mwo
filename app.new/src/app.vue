<template>
 <div id="main_container" class="grid">
    <popup></popup>
    <notePopup></notePopup>
    <todoHeader></todoHeader>
    <login v-if="!loggedIn"></login>
    <todoFooter></todoFooter>
 </div>
</template>

<script>
import { Login, auth } from './user'
import todoHeader from './todoHeader.vue'
import todoFooter from './todoFooter.vue'
import notePopup from './notePopup.vue'
import popup from './popup.vue'
import EventBus from './eventBus'
export default {
	created: function() {
    EventBus.$on("user-login", e => {
      this.loggedIn = true
    });
    auth.getUser().then(result => {
      this.loggedIn = result !== null
    })

  },
  data: function() {
    return {
			loggedIn: false
    };
  },
  components: {
    Login, todoHeader, todoFooter, popup, notePopup
  }
}
</script>

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>
