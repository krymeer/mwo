window.onload = function() {

  var globals = {
    show_popup: false,
    popup_msg: '',
    messages: ['Żadne pole nie może pozostać puste.'],
  }

  Vue.component('popup', {
    template: '<div class="popup grid" v-show="show_popup">{{ popup_msg }} <i class="material-icons" @click="show_popup = !show_popup">close</i></div>',
    data: function() {
      return globals
    }
  })

  Vue.component('todo-footer', {
    template: '<footer><div class="font_small">&copy; 2017 R. Makowski, K. Osada, M. Regulski, K. Tatarynowicz</div></footer>'
  })

  Vue.component('todo-header', {
    template: '<header><h1>ToDoApp</h1></header>'
  })

  new Vue({
    el: '#main_container',
    data: {
      login: '',
      password: '',
      no_notes: true,
      notes: []
    },
    methods: {
      check_input: function() {
        if (this.login === '' || this.password === '') {
          globals.popup_msg = globals.messages[0];
          globals.show_popup = true;
        } else {
          window.location.href = 'index.html';
        }
      },
      add_note: function() {
        this.notes.push('');
      },
      add_first_note: function() {
        this.no_notes = false;
        this.add_note();
      }
    }
  });
}