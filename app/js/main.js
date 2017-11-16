var mail_regex = /[a-z0-9@._-]/i,
    login_regex = /[a-z0-9_]/i,
    password_regex = /[a-z0-9!@#$%^&*()\-_+=~]/i

var user_id = (typeof session_user_id != "undefined") ? session_user_id : 0;

function handle_input(e, regex) {
  if (!regex.test(e.key)) {
    return false;
  }
  return true;
}

function sort_by_id(a, b) {
  return a.id > b.id;
}

function get_date() {
  var date = new Date();
  var d = date.toISOString().slice(0, 19).replace('T', ' ');
  d = d.replace(d.slice(11, 19), date.toLocaleTimeString());
  return d;
}

window.onload = function() {
  var globals = {
    no_notes: true,
    show_popup: false,
    show_big_popup: false,
    show_placeholder: true,
    popup_msg: '',
    messages: ['Żadne pole nie może pozostać puste.', 'To pole nie może pozostać puste.', 'Nieprawidłowa nazwa użytkownika lub hasło.', 'Wylogowanie przebiegło pomyślnie.'],
    notes: [],
    note_no: -1
  }

  Vue.component('popup', {
    template: '<div class="popup" v-show="show_popup">{{ popup_msg }}</div>',
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
          <div contentEditable="true" v-on:paste="remove_styling" v-on:keyup="handle_note_text" class="contents" id="note_contents" v-if="notes.length > 0 && note_no > -1"> \
            {{ notes[note_no].contents }} \
          </div> \
        </div> \
        <button class="save" @click="save_note">zapisz</button> \
      </div>',
    methods: {
      remove_styling: function(event) {
        event.preventDefault();
        var data = (event.clipboardData || window.clipboardData).getData('text').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        document.execCommand('insertHTML', false, data);
      },
      save_note: function() {
        var text = document.getElementById('note_contents').innerText;
        var note_id = globals.notes[globals.note_no].id;
        Vue.set(globals.notes, globals.note_no, {id: note_id, contents: text, show_deletion_bar: false});
        Vue.http.post( "php_query.php", {action: "save_note", contents: text, user_id: user_id, note_id: note_id});
        globals.note_no = -1;
        globals.show_big_popup = false;
      },
      handle_note_text: function(event) {
        var text = event.target.innerText.trim();
        if (text.length > 0) {
          globals.show_placeholder = false;
        } else {
          globals.show_placeholder = true;
        }
        /*
        if (event.keyCode === 13) {
          return event.preventDefault();
        }*/
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
        <div class="note" v-for="(note, index) in notes" v-bind:class="{ no_hover: show_big_popup }"> \
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
    }, mounted: function() {
      Vue.http.post( "php_query.php", {action: 'get_notes', user_id: user_id}).then(response => {
        var arr = response.body;
        if (arr !== '""' && arr.length > 0) {
          for (var k in arr) {
            globals.notes.push({
              id: arr[k].id,
              contents: arr[k].msg,
              show_deletion_bar: false
            });
            globals.notes.sort(sort_by_id);
            globals.no_notes = false;
          }
        }
      }, response => {
        console.error('Loading notes failed')
      });
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
    props: ['materialIcon'],
    template: '\
      <header> \
        <a class="block" href="./"> \
          <h1>ToDoApp</h1> \
        </a> \
        <i v-show="materialIcon" class="material-icons" @click="click_icon">{{ materialIcon }}</i>\
      </header>',
    methods: {
      click_icon: function() {
        var i_id = this._props.materialIcon;
        if (i_id === 'power_settings_new') {
          window.location.href = "./logout.php";
        }
      }
    }
  })

  Vue.component('tooltip', {
    props: ['hidden-contents', 'contents'],
    template: '\
      <span class="tooltip"> \
        <span class="hidden" style="display: none">{{ hiddenContents }}</span> \
        <span class="visible" v-on:mouseout="mouse_out" v-on:mouseover="mouse_over">{{ contents }}</span>\
      </span>',
    methods: {
      mouse_over: function(e) {
        var tooltip_contents = e.target.parentElement.childNodes[0];
        tooltip_contents.style.display = 'block';

        var parent = e.target.parentElement,
            top = parent.offsetTop,
            left = parent.offsetLeft,
            h = tooltip_contents.offsetHeight,
            w = tooltip_contents.offsetWidth;
        tooltip_contents.style.top = (top-h)+'px';
        tooltip_contents.style.left = left+'px';
        tooltip_contents.style.right = '';
        if (parent.parentElement.offsetWidth-left < w) {
          tooltip_contents.style.left = '';
          tooltip_contents.style.right = '0px';
        }
      },
      mouse_out: function(e) {
        var tooltip_contents = e.target.parentElement.childNodes[0];
        tooltip_contents.style.display = 'none';
      }
    }
  })

  var app = new Vue({
    el: '#main_container',
    data: {
      login: '',
      password: '',
      password_cp: '',
      mail: '',
      valid_mail: false,
      sign_up_success: false
    },
    mounted: function() {
      if( typeof invalid_login_data != 'undefined' ) {
        globals.popup_msg = globals.messages[2];
        globals.show_popup = true;
      } else if( typeof user_logged_out != 'undefined' ) {
        globals.popup_msg = globals.messages[3];
        globals.show_popup = true;
      }
    },
    methods: {
      input_blur: function(e) {
        if (e.target.value === '') {
          if (e.target.className.indexOf('empty') === -1) {
            e.target.className += ' empty';
          }
        } else {
          e.target.className = e.target.className.replace('empty', '');
        }
      },
      input_focus: function(e) {
        if (e.target.className.indexOf('empty') >= 0) {
          e.target.className = e.target.className.replace('empty', '');
        }
      },
      goto: function(name) {
        var url;
        switch(name) {
          case 'login':
            url = 'login.html';
            break;
          default:
            url = 'index.html';
        }
        window.location.href = url;
      },
      check_sign_up_form: function() {
        if (this.login === '' || this.password === '' || this.password_cp === '' || this.mail === '') {
          globals.popup_msg = globals.messages[0];
          globals.show_popup = true;
          var input_fields = document.getElementsByClassName('sign_up_input');
          for (var k = 0; k < input_fields.length; k++) {
            if (input_fields[k].value === '') {
              if (input_fields[k].className.indexOf('empty') === -1) {
                input_fields[k].className += ' empty';
              }
            } else {
              input_fields[k].className = input_fields[k].className.replace('empty', '');
            }
          }
        } else {
          document.getElementById("sign_up_form").submit();
          /*
          globals.show_popup = false;
          this.sign_up_success = true;
          */
        }
      },
      check_input: function() {
        if (this.login === '' || this.password === '') {
          globals.popup_msg = globals.messages[0];
          globals.show_popup = true;
        } else {
          // window.location.href = 'index.html';
          document.getElementById("login_form").submit();
        }
      },
      check_mail_for_pass: function() {
        if (this.mail === '') {
          globals.popup_msg = globals.messages[1];
          globals.show_popup = true;
        } else {
          globals.show_popup = false;
          this.valid_mail = true;
        }
      },
      add_note: function() {
      	var k = 0;
        if( globals.notes.length > 0 ) k = globals.notes[ globals.notes.length - 1 ].id + 1;
        // var k = globals.notes[ Math.max( 0, globals.notes.length - 1 ) ].id + 1;
        globals.notes.push({
          id: k,
          contents: '',
          show_deletion_bar: false
        });
        var obj = {action: 'add_note', user_id: user_id, note_id: k, date: get_date()}
        Vue.http.post( "php_query.php", obj);
      },
      add_first_note: function() {
        globals.no_notes = false;
        this.add_note();
      },
      delete_note: function(k) {
        if (k > -1 && k < globals.notes.length) {
          var note_id = globals.notes[k].id;
          globals.notes.splice(k, 1);
          if (globals.notes.length === 0) {
            globals.no_notes = true;
          }
          Vue.http.post( "php_query.php", {action: 'delete_note', user_id: user_id, note_id: note_id});
        }
      },
      edit_note: function(k) {
        if (k > -1 && k < globals.notes.length) {
          globals.note_no = k;
          globals.show_big_popup = true;
          if (globals.notes[k].contents.replace(/ /g, '').length === 0) {
            globals.show_placeholder = true;
          } else {
            globals.show_placeholder = false;
          }
        }
      }
    }
  });

}