<template>
  <div class="popup big_popup" v-show="showNotePopup">
    <div class="header grid grid_horizontal">
      <h2>Edytuj notatkę</h2>
      <i class="material-icons" @click="hideNotePopup">close</i>
    </div>
    <div class="contents_wrapper">
      <div id="note_placeholder" v-show="showPlaceholder">Tu wpisz swoją notatkę...</div>
      <div contentEditable="true" @keydown="handleKeyPressed" @keyup.esc="hideNotePopup" v-on:paste="removeStyling" @keyup="handleNoteText" class="contents" id="note_contents"></div>
    </div>
    <button class="save" @click="saveNote">zapisz</button>
  </div>
</template>

<script>
  function encodeInequalitySymbols(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function decodeInequalitySymbols(str) {
    return str.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }

  function toNewlines(str) {
    return str.replace(/<br>/g, '\n');
  }

  function toLineBreaks(str) {
    return str.replace(/\n/g, '<br>');
  }
  import './css/notePopup.css';
  import EventBus from "./eventBus";
  export default {
    created: function() {
      EventBus.$on("edit-note", (contents, noteId) => {
        if (contents.replace(/ /g, '').length > 0) {
          this.showPlaceholder = false;
          contents = decodeInequalitySymbols(contents);
          contents = toNewlines(contents);
        } else {
          contents = '';
        }
        this.noteId = noteId;
        this.showNotePopup = true;
        document.getElementById('note_contents').innerText = contents;
      });
    },
    data: function() {
      return {
        showNotePopup: false,
        showPlaceholder: true,
        noteId: -1,
        previousKey: -1,
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
        var data = encodeInequalitySymbols((event.clipboardData || window.clipboardData).getData('text'));
        document.execCommand('insertHTML', false, data);        
      },
      saveNote: function() {
        var updatedContents = document.getElementById('note_contents').innerText;
        updatedContents = encodeInequalitySymbols(updatedContents);
        updatedContents = updatedContents.replace(/\n$/, '');
        updatedContents = toLineBreaks(updatedContents);

        EventBus.$emit("save-note", updatedContents, this.noteId);
        this.hideNotePopup();
      },
      hideNotePopup: function() {
        this.showNotePopup = false;
        this.showPlaceholder = true;
      }
    }
  }
</script>