<template>
  <div class="grid" id="page_contents">
    <h2 class="page_name">pulpit</h2>
    <div class="grid" v-if="loadingFinished">
      <div v-if="!noNotes">
        <notePopup></notePopup>
        <i class="material-icons" @click="addNote" data-title="dodaj notatkę" id="add_note">note_add</i>
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
      <googleCalendar></googleCalendar>
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
  import googleCalendar from './googleCalendar.vue'
  Vue.use(VueResource);
  export default {
    created: function() {
      auth.getUser().then(result => {
        this.token = result.idToken.jwtToken;

        if (typeof this.token != 'undefined') {
          this.$http.get(apiURL, { headers: { 'Authorization': this.token } }).then(done => {
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
        loadingFinished: false
      }
    },
    methods: {
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
      notePopup, loader, googleCalendar
    }
  }
</script>