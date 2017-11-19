<template>
  <div class="popup big_popup" v-show="ifShowNotePopup">
    <div class="header grid grid_horizontal">
      <h2>Edytuj notatkę</h2>
      <i class="material-icons" @click="hideNotePopup">close</i>
    </div>
    <div class="contents_wrapper">
      <div id="note_placeholder" v-show="showPlaceholder">Tu wpisz swoją notatkę...</div>
      <div contentEditable="true" v-on:paste="removeStyling" v-on:keyup="handleNoteText" class="contents" id="note_contents">
        {{ contents }}
      </div>
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
  export default {
    mounted: function() {
      if (this.contents.replace(/ /g, '').length > 0) {
        this.showPlaceholder = false;
      }
    },
    data: function() {
      return {
        showPlaceholder: true
      }
    },
    props: {
      contents: {
        type: String,
        default: ''
      },
      ifShowNotePopup: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      handleNoteText: function(event) {
        var text = event.target.innerText.trim();
        if (text.length > 0) {
          this.showPlaceholder = false;
        } else {
          this.showPlaceholder = true;
        }
        /*
        if (event.keyCode === 13) {
          return event.preventDefault();
        }
        */
      },
      removeStyling: function(event) {
        event.preventDefault();
        var data = (event.clipboardData || window.clipboardData).getData('text').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        document.execCommand('insertHTML', false, data);        
      },
      saveNote: function() {
        // TODO

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
      },
      hideNotePopup: function() {
        this.$parent.showNotePopup = !this.$parent.showNotePopup;
      }
    }
  }
</script>

<style></style>