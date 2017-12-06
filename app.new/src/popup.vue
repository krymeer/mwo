<template>
  <div class="popup" v-if="showPopup">
    <span class="popup-message" v-html="text"></span>
    <input :type="message.input"
  </div>
</template>

<script>
import "./css/popups.css";
import EventBus from "./eventBus";

const Message = function(text, timeout) {
  this.text = text
  this.timeout = timeout
}

export default {
  created: function() {
    EventBus.$on("show-popup", msgId => {
      this.msgId = msgId;
      this.showPopup = true
      let message = this.messages[msgId] 
      if (message.timeout) {
        setTimeout(() => {this.showPopup = false}, message.timeout);
      }
    });
    EventBus.$on("hide-popup", () => {
      this.showPopup = false;
    });
  },
  computed: {
    message: function() {
      
    },
    text: function() {
      let message = this.messages[this.msgId] 
      console.log("[popup:text] message:", message)
      if (typeof message === "string") {
        return message
      }
      if (message instanceof Message) {
        return message.text
      }
    }
  },
  data: function() {
    return {
      showPopup: false,
      msgId: -1,
      messages: [
        "Żadne pole nie może pozostać puste.",
        "To pole nie może pozostać puste.",
        "Nieprawidłowa nazwa użytkownika lub hasło.",
        "Wylogowanie przebiegło pomyślnie.",
        new Message("Twoje konto nie jest jeszcze aktywne.", false)
      ]
    };
  }
};
</script>