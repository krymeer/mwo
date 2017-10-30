window.onload = function() {
  var globals = {
    no_notes: true,
    show_popup: false,
    show_big_popup: false,
    show_placeholder: true,
    popup_msg: '',
    messages: [ 'Żadne pole nie może pozostać puste.'],
    notes: [],
    note_id: -1
  }

  Vue.component('popup', {
    template: '<div class="popup" v-show="show_popup">{{ popup_msg }}<i class="material-icons" @click="show_popup = !show_popup">close</i></div>',
    data: function() {
      return globals
    }
  })

  Vue.component('note-popup', {
    template: '\
      <div class="popup big_popup" v-show="show_big_popup"> \
        <div class="header grid grid_horizontal"> \
          <h2>Edytuj notatkę</h2> \
          <i class="material-icons" @click="show_big_popup = !show_big_popup">close</i> \
        </div> \
        <div class="contents_wrapper"> \
          <div id="note_placeholder" v-show="show_placeholder">Tu wpisz swoją notatkę...</div> \
          <div contentEditable="true" v-on:keyup="handle_note_text" class="contents" id="note_contents" v-if="notes.length > 0 && note_id > -1"> \
            {{ notes[note_id].contents }} \
          </div> \
        </div> \
        <button class="save" @click="save_note">zapisz</button> \
      </div>',
    methods: {
      save_note: function() {
        var text = document.getElementById('note_contents').innerText;
        Vue.set(globals.notes, globals.note_id, {contents: text, show_deletion_bar: false});
        globals.note_id = -1;
        globals.show_big_popup = false;
      },
      handle_note_text: function(event) {
        var text = event.target.innerText;
        if (text.length > 0) {
          globals.show_placeholder = false;
        } else {
          globals.show_placeholder = true;
        }
        if (event.keyCode === 13) {
          return event.preventDefault();
        }
      }
    },
    data: function() {
      return globals
    }
  })

  Vue.component('any-notes-btn', {
    template: '<i class="material-icons" v-show="!no_notes && !show_big_popup" @click="add_note" id="add_note">note_add</i>',
    data: function() {
      return globals
    },
    methods: {
      add_note: function() {
        app.add_note();
      }
    }
  })

  Vue.component('list-of-notes', {
    template: '\
      <div v-show="!no_notes" class="grid" id="grid_of_notes"> \
        <div class="note" v-for="(note, index) in notes"> \
          <div class="deletion_bar" v-show="note.show_deletion_bar"><span>usunąć?</span> \
            <i class="material-icons" @click="delete_note(index)">check</i> <i class="material-icons" @click="note.show_deletion_bar = !note.show_deletion_bar">close</i>  \
          </div> \
          <span>{{ note.contents }}</span> \
          <div class="btn_panel" v-show="!show_big_popup && !note.show_deletion_bar"> \
            <i class="material-icons" @click="edit_note(index)">mode_edit</i> \
            <i class="material-icons" @click="note.show_deletion_bar = !note.show_deletion_bar">delete</i> \
          </div> \
        </div> \
      </div>',
    data: function() {
      return globals;
    },
    methods: {
      edit_note: function(k) {
        if (k > -1 && k < globals.notes.length) {
          app.edit_note(k);
        }
      },
      delete_note: function(k) {
        if (k > -1 && k < globals.notes.length) {
          app.delete_note(k);
        }
      }
    }
  })

  Vue.component('no-notes', {
    template: '\
      <div v-show="no_notes" id="no_notes"> \
        Nie masz jeszcze żadnych notatek. \
        <button @click="add_first_note">dodaj nową</button> \
      </div>',
    data: function() {
      return globals
    },
    methods: {
      add_first_note: function() {
        app.add_first_note();
      }
    }
  })

  Vue.component('todo-footer', {
    template: '<footer><div class="font_small">&copy; 2017 R. Makowski, K. Osada, M. Regulski, K. Tatarynowicz</div></footer>'
  })

  Vue.component('todo-header', {
    template: '<header><a class="block" href="index.html"><h1>ToDoApp</h1></a></header>'
  })

  var app = new Vue({
    el: '#main_container',
    data: {
      login: '',
      password: ''
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
        globals.notes.push({
          contents: '',
          show_deletion_bar: false
        });
      },
      add_first_note: function() {
        globals.no_notes = false;
        this.add_note();
      },
      delete_note: function(k) {
        if (k > -1 && k < globals.notes.length) {
          globals.notes.splice(k, 1);
          if (globals.notes.length === 0) {
            globals.no_notes = true;
          }
        }
      },
      edit_note: function(k) {
        if (k > -1 && k < globals.notes.length) {
          globals.note_id = k;
          globals.show_big_popup = true;
          if (globals.notes[k].contents.replace(/ /g, '').length === 0) {
            globals.show_placeholder = true;
          }
        }
      }
    }
  });
}