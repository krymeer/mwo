<template>
  <div class="popup" v-if="showPopup">{{ messages[msgId] }}</div>
</template>

<script>
import "./css/popups.css";
import EventBus from "./eventBus";
export default {
  created: function() {
    EventBus.$on("show-popup", msgId => {
      this.msgId = msgId;
      this.showPopup = true
      setTimeout(() => {this.showPopup = false}, 1500);
    });
  },
  data: function() {
    return {
      showPopup: false,
      msgId: -1,
      messages: [
        "Żadne pole nie może pozostać puste.",
        "To pole nie może pozostać puste.",
        "Nieprawidłowa nazwa użytkownika lub hasło.",
        "Wylogowanie przebiegło pomyślnie."
      ]
    };
  }
};
</script>