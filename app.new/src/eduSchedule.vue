<template>
  <div class="grid" id="page_contents">
    <h2 class="page_name">plan zajęć</h2>
    <div id="no_schedule_msg">
      Tutaj pojawi się Twój plan zajęć z Edukacji.CL. Użyj rozszerzenia <b>eduParser</b> i pobierz wymagane informacje.
      <div class="margin-top" v-if="!tokenAlreadySent">
        Naciśnij przycisk <button class="margin-left-50 margin-right-50" @click="sendToken()">wyślij token</button> aby udostępnić <b>eduParserowi</b> swój token.
      </div>
      <div class="margin-top" v-if="tokenJustSent">
        Gotowe! Token został wysłany. Naciśnij ikonę <b>eduParsera</b> i postępuj zgodnie z podanymi instrukcjami.
      </div>
    </div>
  </div>
</template>

<script>
  import auth from './user/auth';
  export default {
    created: function() {
      if (window.localStorage.tokenAlreadySent) {
        this.tokenAlreadySent = true;
      }
    },
    methods: { 
      sendToken: function() {
        auth.getUser().then(result => {
          if (result !== null) {
            var userToken = result.idToken.jwtToken;
            var data = { page: 'ToDoApp', token: userToken };

            window.localStorage.setItem('tokenAlreadySent', true);
            window.postMessage(data, '*');
            this.tokenAlreadySent = true;
            this.tokenJustSent = true;
          }
        });
      }
    },
    data: function() {
      return {
        tokenAlreadySent: false,
        tokenJustSent: false
      }
    }
  }
</script>