<template>
 <div id="main_container" class="grid">
    <popup :ifShowPopup="showPopup" :message="popupMessage"></popup>
    <todoHeader></todoHeader>
    <login></login>
    <todoFooter></todoFooter>
 </div>
</template>

<script>
import { Login } from './user'
import todoHeader from './todoHeader.vue'
import todoFooter from './todoFooter.vue'
import popup from './popup.vue'
export default {
  data: function() {
    return {
      showPopup: false,
      popupMessage: '',
      listOfMessages: ['Żadne pole nie może pozostać puste.', 'To pole nie może pozostać puste.', 'Nieprawidłowa nazwa użytkownika lub hasło.', 'Wylogowanie przebiegło pomyślnie.']
    };
  },
  components: {
    Login, todoHeader, todoFooter, popup
  }
}
</script>

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>
