<template>
  <div class="grid" id="page_contents">
    <h2 class="page_name">pulpit</h2>
    <div class="grid" v-if="loadingFinished">
      <div class="grid" id="control_panel">
        <i v-if="!noNotes" class="material-icons" @click="downloadAllNotes" data-title="pobierz notatki">file_download</i>
        <i v-if="!noNotes" class="material-icons" @click="addNote" data-title="dodaj notatkę" id="add_note">note_add</i>
      </div>
      <div v-if="!noNotes">
        <notePopup></notePopup>
        <div class="grid" id="grid_of_notes">
          <div class="note" v-for="(note, index) in notes">
            <div class="deletion_bar" v-show="note.showDeletionBar">
              <span>usunąć?</span>
              <i class="material-icons" @click="deleteNote(index)">check</i> <i class="material-icons" @click="note.showDeletionBar = !note.showDeletionBar">close</i>
            </div>
            <span v-html="note.contents"></span>
            <div class="btn_panel" >
              <i class="material-icons" data-title="edytuj notatkę" @click="editNote(index)">mode_edit</i>
              <i class="material-icons" data-title="usuń notatkę" @click="note.showDeletionBar = !note.showDeletionBar">delete</i>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="noNotes" id="no_notes">
        Nie masz jeszcze żadnych notatek.
        <button @click="addFirstNote">dodaj nową</button>
      </div>
    </div>
    <div v-else-if="!loadingFinished">
      <loader></loader>
    </div>
  </div>
</template>

<script>
  const apiURL  = 'https://xjtxrfc6a1.execute-api.eu-central-1.amazonaws.com/v1/todo';
  import './css/listOfNotes.css';
  import notePopup from './notePopup.vue';
  import loader from './loader.vue';
  import auth from './user/auth';
  import EventBus from './eventBus';
  import Vue from 'vue';
  import VueResource from'vue-resource';
  Vue.use(VueResource);
  export default {
    created: function() {
      auth.getUser().then(result => {
        this.token = result.idToken.jwtToken;
        this.username = result.idToken.payload["cognito:username"];

        if (typeof this.token != 'undefined') {
          this.$http.get(apiURL, { headers: { 'Authorization': this.token } }).then(done => {
            var items = done.body.Items;
            if (items.length > 0) {
              this.noNotes = false;
              for (var k = 0; k < items.length; k++) {
                if (typeof items[k].Content !== 'object') {
                  this.notes.push(
                    { id: items[k].ID, contents: items[k].Content, showDeletionBar: false }
                  );
                }
              }
            }
            // Here we hide the loader
            this.loadingFinished = true;
          }, fail => {
            console.error('Loading notes failed');
          });
        }
      }).catch(e => {
        console.error(e);
      });
      EventBus.$on("update-note", (contents, k) => {
        this.notes[k].contents = contents;

        if (typeof this.token != 'undefined') {
          this.$http.put(apiURL + '/' + this.notes[k].id, { Content: contents }, { headers: { 'Authorization': this.token } }).then(done => {}, fail => {
            console.error('Updating note failed');
          });
        }
      });
      EventBus.$on("save-new-note", (noteContents) => {
        if (typeof this.token != 'undefined') {
          this.$http.post(apiURL, { Content: noteContents }, { headers: { 'Authorization': this.token } }).then(done => {
            this.notes.push(
              { id: done.body.ID, contents: noteContents, showDeletionBar: false }
            )            
          }, fail => {
            console.error('Adding note failed');
          });
        }
      });
    },
    data: function() {
      return {
        notes: [],
        noNotes: true,
        loadingFinished: false,
        username: undefined
      }
    },
    methods: {
      downloadAllNotes: function() {
        var fileContents  = '### Notatki użytkownika ' + this.username + '\n\n'
        var link          = document.createElement('a');
        var filename  = 'todo_notes.' + this.username + '.txt';
        var encodedURI;

        for (var k = 0; k < this.notes.length; k++) {
          fileContents += '* ' + this.notes[k].contents.replace(/<br>/g, '\n') + '\n\n';
        }

        fileContents = fileContents.replace(/\n\n$/, '');

        encodedURI  = encodeURI(fileContents);;
        link.setAttribute('download', filename);
        link.setAttribute('href', 'data:charset=utf-8,' + encodedURI);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        EventBus.$emit("show-popup", 4);
      },
      addFirstNote: function() {
        this.noNotes = false;
        this.addNote();
      },
      addNote: function() {
        EventBus.$emit("add-note");
      },
      editNote: function(k) {
        var n = this.notes.length;

        if (k > -1 && k < n) {
          EventBus.$emit("edit-note", this.notes[k].contents, k);
        }
      },
      deleteNote: function(k) {
        var n = this.notes.length;

        if (k > -1 && k < n) {
          var noteId = this.notes[k].id;
          this.notes[k].showDeletionBar = false;
          this.notes.splice(k, 1);
          n--;

          if (n === 0) {
            this.noNotes = true;
          }

          if (typeof this.token != 'undefined') {
            this.$http.delete(apiURL + '/' + noteId, { headers: { 'Authorization': this.token } }).then(done => {}, fail => {
              console.error('Deleting note failed');
            });
          }
        }
      }
    },
    components: {
      notePopup, loader
    }
  }
</script>