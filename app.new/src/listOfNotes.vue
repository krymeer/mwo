<template>
  <div class="grid" id="page_contents">
    <h2 class="page_name">pulpit</h2>
    <div class="grid" v-if="loadingFinished">
      <div v-if="!noNotes">
        <notePopup></notePopup>
        <i class="material-icons" @click="addNote" id="add_note">note_add</i>
        <div class="grid" id="grid_of_notes">
          <div class="note" v-for="(note, index) in notes">
            <div class="deletion_bar" v-show="note.showDeletionBar">
              <span>usunąć?</span>
              <i class="material-icons" @click="deleteNote(index)">check</i> <i class="material-icons" @click="note.showDeletionBar = !note.showDeletionBar">close</i>
            </div>
            <span v-html="note.contents"></span>
            <div class="btn_panel" >
              <i class="material-icons" @click="editNote(index)">mode_edit</i>
              <i class="material-icons" @click="note.showDeletionBar = !note.showDeletionBar">delete</i>
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
  var token;
  var vr      = require('vue-resource');
  var apiURL  = 'https://xjtxrfc6a1.execute-api.eu-central-1.amazonaws.com/v1/todo';
  import './css/listOfNotes.css'
  import notePopup from './notePopup.vue'
  import loader from './loader.vue'
  import auth from './user/auth'
  import EventBus from './eventBus'
  export default {
    created: function() {
      auth.getUser().then(result => {
        token = result.idToken.jwtToken;
        if (typeof token != 'undefined') {
          vr.Http.get(apiURL, { headers: { 'Authorization': token } }).then(done => {
            var items = done.body.Items;
            if (items.length > 0) {
              this.noNotes = false;
              for (var k = 0; k < items.length; k++) {
                this.notes.push(
                  { id: items[k].ID, contents: items[k].Content, showDeletionBar: false }
                );
              }
            }
            // Here we hide the loader
            this.loadingFinished = true;
          }, fail => {
            console.error('Loading notes failed');
          });
        }
      });
      EventBus.$on("save-note", (contents, k) => {
        this.notes[k].contents = contents;
        if (typeof token != 'undefined') {
          vr.Http.put(apiURL + '/' + this.notes[k].id, { Content: contents, headers: { 'Authorization': token } }).then(done => {}, fail => {
            console.error('Updating note failed');
          });
        }
      });
    },
    data: function() {
      return {
        notes: [],
        noNotes: true,
        loadingFinished: false
      }
    },
    methods: {
      addFirstNote: function() {
        this.noNotes = false;
        this.addNote();
      },
      addNote: function() {
        var k = 0, n = this.notes.length;

        if (n > 0) {
          k = 1 + this.notes[n-1].id
        }

        this.notes.push(
          { id: k, contents: '', showDeletionBar: false }
        )

        if (typeof token != 'undefined') {
          vr.Http.post(apiURL, { Content: '', headers: { 'Authorization': token } }).then(done => {}, fail => {
            console.error('Adding note failed');
          });
        }
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

          if (typeof token != 'undefined') {
            vr.Http.delete(apiURL + '/' + noteId, { headers: { 'Authorization': token } }).then(done => {}, fail => {
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