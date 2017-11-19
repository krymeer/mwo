<template>
  <div class="popup" v-show="ifShowPopup">{{ listOfMessages[n] }}</div>
</template>

<script>
  import "./css/popups.css"
  export default {
    props: {
      ifShowPopup: {
        type: Boolean,
        default: false
      },
      n: {
        type: Number,
        default: 0
      }
    },
    data: function() {
      return {
        listOfMessages: ['Żadne pole nie może pozostać puste.', 'To pole nie może pozostać puste.', 'Nieprawidłowa nazwa użytkownika lub hasło.', 'Wylogowanie przebiegło pomyślnie.']
      }
    }
  }
</script>