<template>
 <div id="main_container" class="grid">
    <popup></popup>
    <todoHeader></todoHeader>
    <noContents v-if="typeof loggedIn == 'undefined'"></noContents>
    <login v-if="!showSchedule && loggedIn === false"></login>
    <listOfNotes v-if="!showSchedule && loggedIn === true"></listOfNotes>
    <eduSchedule v-if="showSchedule"></eduSchedule>
    <todoFooter></todoFooter>
 </div>
</template>

<script>
import './css/styles.css'
import { Login, auth } from './user'
import eduSchedule from './eduSchedule.vue'
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
    EventBus.$on("user-schedule", () => {
      this.showSchedule = true;
    });
    EventBus.$on("user-logout", () => {
      auth.signOut();
      this.loggedIn = false;
      EventBus.$emit("show-popup", 3);    
    });

    // When the error comes, try to catch it
    auth.getUser().then(result => {
      this.loggedIn = result !== null
      EventBus.$emit("show-navbar", this.loggedIn);
        
      if (window.localStorage.getItem('todoAuthErr') !== null) {
        window.localStorage.removeItem('todoAuthErr');
      }
    }).catch(e => {
      console.error(e);
      if (e.toString().indexOf('User is not authenticated') > 0 && window.localStorage.getItem('todoAuthErr') === null) {
        window.setTimeout(function() {
          window.localStorage.setItem('todoAuthErr', true);
          window.location.href = '/';
        }, 2000);
      }
    });
  },
  data: function() {
    return {
			loggedIn: undefined,
      showSchedule: false
    };
  },
  components: {
    Login, todoHeader, todoFooter, popup, listOfNotes, noContents, eduSchedule
  }
}
</script>