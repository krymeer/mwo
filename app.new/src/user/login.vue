<template>
  <div class="grid" id="page_contents">
    <div class="login-signin grid">
      <h2 class="page_name">{{activeTab.actionLabel}}</h2>
      <a class="btn-toggle" @click="setTab(activeTab.toggleTarget())"><span v-if="activeTab.toggleLabel" class="font_small block">{{activeTab.toggleLabel}}</span> <span class="font_large">{{activeTab.toggleAction}}</span></a>
      <form class="login-form" :class="activeTab.name">
        <div v-if="showEmailField" class="form-field">
          <label for="input-email">email</label>
          <input type="email" id="input-email" :class="{error: !emailValid}" v-model="email" />
        </div>
        <div class="form-field">
          <label for="input-login">nazwa użytkownika</label>
          <input type="text" id="input-login" @keyup.enter="triggerSignin" :class="{error: !loginValid}" v-model="login" maxlength="24" />
        </div>
        <div class="form-field">
          <label for="input-password">hasło</label>
          <input type="password" id="input-password" @keyup.enter="triggerSignin" :class="{error: !passwordValid}" v-model="password" maxlength="32" />
        </div>
        <div class="spacer_zero span_2"></div>
        <a id="resetPassBtn" v-if="showResetPassLink" @click="setTab(Tab.RESET_PASS)" class="fblock">nie pamiętam hasła</a>
        <button class="block btn-action" @click="activeTab.action()" :disabled="!isValid" type="button">{{activeTab.actionLabel}}</button>
        <div class="spacer_zero span_2"></div>
        <div class="spacer_zero span_2"></div>
        <a id="gsignin-button" @click="googleSignIn">zaloguj się z Google</a>
        <a id="gsignout-button" style="display: none;" @click="googleSignOut">Wyloguj z Google</a>
      </form>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import auth from "./auth";
import EventBus from "../eventBus";
import "./login.css";

const Tab = {
  LOGIN: {
    name: "login",
    actionLabel: "zaloguj się",
    toggleLabel: "nie masz konta?",
    toggleAction: "zarejestruj się",
    toggleTarget: () => Tab.REGISTER,
    action: function() {
      console.debug("[login:Tab:LOGIN:action]");
      this.signin();
    }
  },
  REGISTER: {
    name: "register",
    actionLabel: "zarejestruj się",
    toggleLabel: "masz już konto?",
    toggleAction: "zaloguj się",
    toggleTarget: () => Tab.LOGIN,
    action: function() {
      console.debug("[login:Tab:REGISTER:action");
      this.signup();
    }
  },
  RESET_PASS: {
    name: "reset-pass",
    actionLabel: "zresetuj hasło",
    toggleLabel: "",
    toggleAction: "wróć",
    toggleTarget: () => Tab.LOGIN,
    action: function() {
      console.debug("[login:Tab:RESET_PASS:action]");
      this.resetPass();
    }
  }
};

export default {
  data: function() {
    return {
      Tab,
      activeTab: undefined,
      login: undefined,
      password: undefined,
      email: undefined
    };
  },
  created: function() {
    this.activeTab = this.Tab.LOGIN;
    console.debug("[login:created] Active tab:", this.activeTab);
    this.activeTab.action = this.activeTab.action.bind(this);
  },
  computed: {
    loginValid() {
      return typeof this.login === "undefined" || !!this.login;
    },
    passwordValid() {
      return typeof this.password === "undefined" || !!this.password;
    },
    emailValid() {
      // only require the '@' character, because the proper regex for all correct emails
      // and we already validate the address by sending the confirmation code by email
      return typeof this.email === "undefined" || this.email.includes("@");
    },
    isValid() {
      if (this.activeTab === this.Tab.LOGIN) {
        return (
          this.loginValid &&
          this.passwordValid &&
          [this.login, this.password].every(x => !!x)
        );
      }
      if (this.activeTab === this.Tab.REGISTER) {
        return this.loginValid && this.passwordValid && this.emailValid;
      }
      return true;
    },
    showEmailField() {
      return this.activeTab !== this.Tab.LOGIN;
    },
    showResetPassLink() {
      return this.activeTab === this.Tab.LOGIN;
    }
  },
  methods: {
    triggerSignin: function() {
      if (this.isValid && this.activeTab === this.Tab.LOGIN) {
        this.signin();
      }
    },
    signin: function() {
      console.debug("[login:signin] called");
      auth.signIn(this.login, this.password).then(
        session => {
          EventBus.$emit("user-login", session.idToken);
          this.clearInputs();
          EventBus.$emit("hide-popup");
        },
        err => {
          console.error(err);
          this.status = { error: true, details: err };
          EventBus.$emit("show-popup", 2);
        }
      );
    },  
    signup: function() {
      console.debug("[login:signup] called");
      auth.signUp(this.login, this.password, this.email).then(
        user => {
          EventBus.$emit("user-register", user);
          this.clearInputs();
        },
        err => {
          console.error(err);
          this.status = { error: true, details: err };
        }
      );
    },
    resetPass: function() {},
    clearInputs: function() {
      this.login = undefined;
      this.password = undefined;
      this.email = undefined;
    },
    setTab: function(target) {
      console.debug(
        `[login:setTab] Transition: ${this.activeTab.name} -> ${target.name}`
      );
      this.clearInputs();
      target.action = target.action.bind(this);
      this.activeTab = target;
    },
    googleSignIn: function() {
      console.log("Trying to sign in with google");
      Vue.googleAuth().signIn(this.onSignInSuccess, this.onSignInError);
      console.log("No chyba ide");
    },
    onSignInSuccess: function(authorizationCode) {
      document.getElementById("gsignin-button").style.display = "none";
      document.getElementById("gsignout-button").style.display = "block";
      this.$http.post('http://your-backend-server.com/auth/google', { code: authorizationCode, redirect_uri: 'postmessage' }).then(function(response) {
        if (response.body) {
          var data = response.body
          // Save to vuex
          var token = 'Bearer ' + data.token
          this.$store.commit('SET_USER', data.user_data)
          this.$store.commit('SET_TOKEN', token)
          // Save to local storage as well
          // ( or you can install the vuex-persistedstate plugin so that you won't have to do this step, only store to Vuex is sufficient )
          if (window.localStorage) {
            window.localStorage.setItem('user', JSON.stringify(data.user_data))
            window.localStorage.setItem('token', token)
          }
          // redirect to the dashboard
          this.$router.push({ name: 'home' })
        }
      }, function(response) {
        var data = response.body
        this.response = data.error
        console.log('BACKEND SERVER - SIGN-IN ERROR', data)
      })
    },
    onSignInError: function(error) {
      this.response = 'Failed to sign-in'
      console.log('GOOGLE SERVER - SIGN-IN ERROR', error)
    },
    googleSignOut: function() {
      Vue.googleAuth().signOut(function () {
        // things to do when sign-out succeeds
        console.log("Signed out from Google!");
        document.getElementById("gsignin-button").style.display = "block";
        document.getElementById("gsignout-button").style.display = "none";
      }, function (error) {
        // things to do when sign-out fails
        console.log("Done fucked it up signin' out from Google.");
      })
    }
  }
};
</script>

<style scoped>

</style>
