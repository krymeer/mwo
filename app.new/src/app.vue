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
      this.loggedIn = true
    });
    auth.getUser().then(result => {
      this.loggedIn = result !== null
    })
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

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>
