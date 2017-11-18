<template>
  <div class="grid" id="page_contents">
    <h2>zaloguj się</h2>
    <form action="loginexe.php" method="POST" class="grid" id="login_form" @submit.prevent>
      <div>nazwa użytkownika</div>
      <input name="login" type="text" @keyup.enter="check_input" v-model="login" maxlength="24">
      <div>hasło</div>
      <input name="password" type="password" @keyup.enter="check_input" v-model="password" maxlength="32">
      <a class="block font_small" href="lost_pass.html">zapomniałem hasła</a>
      <input type="submit">
      <button @click="check_input">zaloguj się</button>
    </form>
    <div id="sign_up">
      <span class="font_small">nie masz konta?</span><br>
      <a class="font_large" href="sign_up.html">zarejestruj się</a>
    </div>
  </div>
</template>

<script>
//auth = require("./auth");
export default {
  data: function() {
    return {
      login: '',
      password: ''
    };
  },
  methods: {
    signin: function() {},
    check_input: function() {
      if (this.login === '' || this.password === '') {
        this.$parent.showPopup = true;
        this.$parent.popupMessage = this.$parent.listOfMessages[0];
      } else {
        document.getElementById('login_form').submit();
      }
    }
  }
};
</script>

<style src="./../css/login.css"></style>
