<template>
 <div id="main_container" class="grid">
    <popup></popup>
    <todoHeader></todoHeader>
    <noContents v-if="typeof loggedIn == 'undefined'"></noContents>
    <login v-if="loggedIn === false"></login>
    <listOfNotes v-if="loggedIn === true"></listOfNotes>
    <todoFooter></todoFooter>
 </div>
</template>

<script>
import './css/styles.css'
import { Login, auth } from './user'
import listOfNotes from './listOfNotes.vue'
import noContents from './noContents.vue'
import todoHeader from './todoHeader.vue'
import todoFooter from './todoFooter.vue'
import popup from './popup.vue'
import EventBus from './eventBus'
export default {
	created: function() {
    EventBus.$on("user-login", e => {
      EventBus.$emit("show-navbar", true);
      this.loggedIn = true;
    });
    EventBus.$on("user-logout", () => {
      auth.signOut();
      this.loggedIn = false;
      EventBus.$emit("show-popup", 3);    
    });
    auth.getUser().then(result => {
      this.loggedIn = result !== null
      EventBus.$emit("show-navbar", this.loggedIn);
    });
  },
  data: function() {
    return {
			loggedIn: undefined
    };
  },
  components: {
    Login, todoHeader, todoFooter, popup, listOfNotes, noContents
  }
}
</script>