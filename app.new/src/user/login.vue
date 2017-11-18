<template>
  <div class="grid" id="page_contents">
    <div class="login-signin">
      <h2>zaloguj się</h2>
      <div>nazwa użytkownika</div>
      <input name="login" type="text" v-model="login" :class="{error: loginInvalid}" maxlength="24">
      <div>hasło</div>
      <input name="password" type="password" :class="{error: passwordInvalid}" v-model="password" maxlength="32">
      <a class="block font_small" href="lost_pass.html">zapomniałem hasła</a>
      <button @click="signin" :enabled="isValid">zaloguj się</button>
      <span class="font_small">nie masz konta?</span><br>
      <a class="font_large" :click="toggle">zarejestruj się</a>
    </div>
    <div class="login-signup">
      
    </div>
  </div>
  
</template>

<script>
import auth from "./auth";
import EventBus from "../eventBus";
window.auth = auth;
export default {
  data: function() {
    return {
      login: undefined,
      password: undefined,
      token: {},
      activeTab: "login"
    };
  },
  computed: {
    loginInvalid() {
      return typeof this.login !== "undefined" && !this.login;
    },
    passwordInvalid() {
      return typeof this.password !== "undefined" && !this.password;
    },
    isValid() {
      return !(this.loginInvalid && this.passwordInvalid);
    }
  },
  methods: {
    signin: function() {
      auth.signIn(this.login, this.password).then(
        session => {
          EventBus.$emit("login-success", session.idToken);
        },
        err => {
          this.status = { error: true, details: err };
        }
      );
    },
    signup: function() {
      auth.signUp(this.login, this.password, this.email).then(user => {});
    }
  }
};
</script>

<style src="./../css/login.css"></style>
