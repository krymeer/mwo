<template>
  <div class="popup big_popup" v-show="showNotePopup">
    <div class="header grid grid_horizontal">
      <h2>Edytuj notatkę</h2>
      <i class="material-icons" @click="hideNotePopup">close</i>
    </div>
    <div class="contents_wrapper">
      <div id="note_placeholder" v-show="showPlaceholder">Tu wpisz swoją notatkę...</div>
      <div contentEditable="true" @keydown="handleKeyPressed" @keyup.esc="hideNotePopup" v-on:paste="removeStyling" @keyup="handleNoteText" class="contents" id="note_contents">{{ noteContents }}</div>
      <!--
        Previously there was a conditional rendering:
          v-if="notes.length > 0 && note_no > -1"
      -->
    </div>
    <button class="save" @click="saveNote">zapisz</button>
  </div>
</template>

<script>
  import './css/notePopup.css'
  import EventBus from "./eventBus";
  export default {
    created: function() {
      EventBus.$on("edit-note", (noteContents, noteId) => {
        this.noteContents = noteContents;
        this.noteId = noteId;
        this.showNotePopup = true;
        if (this.noteContents.replace(/ /g, '').length > 0) {
          this.showPlaceholder = false;
        }
      });
    },
    data: function() {
      return {
        showNotePopup: false,
        showPlaceholder: true,
        noteContents: '',
        noteId: -1,
        previousKey: -1
      }
    },
    methods: {
      handleKeyPressed: function(event) {
        // Hitting Ctrl+Enter causes saving contents of the note
        if (this.previousKey === 17 && event.keyCode === 13) {
          this.saveNote();
        }
        this.previousKey = event.keyCode;
      },
      handleNoteText: function(event) {
        var text = event.target.innerText.trim();
        if (text.length > 0) {
          this.showPlaceholder = false;
        } else {
          this.showPlaceholder = true;
        }
      },
      removeStyling: function(event) {
        event.preventDefault();
        var data = (event.clipboardData || window.clipboardData).getData('text').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        document.execCommand('insertHTML', false, data);        
      },
      saveNote: function() {
        /*
          Previous version

          save_note: function() {
          var text = document.getElementById('note_contents').innerText;
          var note_id = globals.notes[globals.note_no].id;
          Vue.set(globals.notes, globals.note_no, {id: note_id, contents: text, show_deletion_bar: false});
          Vue.http.post( "php_query.php", {action: "save_note", contents: text, user_id: user_id, note_id:  note_id});
          globals.note_no = -1;
          globals.show_big_popup = false;
        */

        var updatedContents = document.getElementById('note_contents').innerText;
        updatedContents = updatedContents.replace(/\n$/, '').replace(/\n/g, '<br>')

        /*
          Here we ought to send a pair (this.noteId, updatedContents) to:
          - the database,
          - the listOfNotes component (?) ‒ so as tu update contents of the modified note.
        */

        this.hideNotePopup();
      },
      hideNotePopup: function() {
        this.showNotePopup = !this.showNotePopup;
      }
    }
  }
</script>

<style></style>