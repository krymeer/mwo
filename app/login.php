<div class="grid" id="main_container">
  <popup></popup>
  <todo-header></todo-header>
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
  <todo-footer></todo-footer>
</div>