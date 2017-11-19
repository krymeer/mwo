<template>
  <div class="grid" id="page_contents">
    <div class="login-signin">
      <h2>{{activeTab.actionLabel}}</h2>
      <form class="login-form">
        <div v-if="showEmailField" class="form-field">
          <label for="input-email">email</label>
          <input type="email" id="input-email" :class="{error: !emailValid}" v-model="email" />
        </div>
        <div class="form-field">
          <label for="input-login">nazwa użytkownika</label>
          <input type="text" id="input-login" :class="{error: !loginValid}" v-model="login" maxlength="24" />
        </div>
        <div class="form-field">
          <label for="input-password">hasło</label>
          <input type="password" id="input-password" :class="{error: !passwordValid}" v-model="password" maxlength="32" />
        </div>
        <a v-if="showResetPassLink" @click="setTab(Tab.RESET_PASS)" class="block">nie pamiętam hasła</a>
        <button class="block btn-action" @click="activeTab.action()" :disabled="!isValid" type="button">{{activeTab.actionLabel}}</button>
        <a class="btn-toggle" @click="setTab(activeTab.toggleTarget())">{{activeTab.toggleLabel}} {{activeTab.toggleAction}}</a>
      </form>
    </div>
  </div>
</template>

<script>
import auth from "./auth";
import EventBus from "../eventBus";
import "./login.css";

const Tab = {
  LOGIN: {
    name: "login",
    actionLabel: "Zaloguj się",
    toggleLabel: "Nie masz konta?",
    toggleAction: "Zarejestruj się",
    toggleTarget: () => Tab.REGISTER,
    action: function() {
      console.debug("[login:Tab:LOGIN:action]");
      this.signin();
    }
  },
  REGISTER: {
    name: "register",
    actionLabel: "Zarejestruj się",
    toggleLabel: "Masz już konto?",
    toggleAction: "Zaloguj się",
    toggleTarget: () => Tab.LOGIN,
    action: function() {
      console.debug("[login:Tab:REGISTER:action");
      this.signup();
    }
  },
  RESET_PASS: {
    name: "reset-pass",
    actionLabel: "Zresetuj hasło",
    toggleLabel: "",
    toggleAction: "Wróć",
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
    signin: function() {
      console.debug("[login:signin] called");
      auth.signIn(this.login, this.password).then(
        session => {
          EventBus.$emit("user-login", session.idToken);
          this.clearInputs();
        },
        err => {
          console.error(err);
          this.status = { error: true, details: err };
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
    }
  }
};
</script>

<style scoped>

</style>
