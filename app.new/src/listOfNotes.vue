<template>
	<div class="grid" id="page_contents">
		<h2 class="page_naem">pulpit</h2>
		<div v-if="!no_notes">
  		<notePopup></notePopup>
	    <i class="material-icons" @click="addNote" id="add_note">note_add</i>
	    <div class="grid" id="grid_of_notes">
				<div class="note" v-for="(note, index) in notes">
			    <div class="deletion_bar" v-show="note.show_deletion_bar">
			    	<span>usunąć?</span>
						<i class="material-icons" @click="deleteNote(index)">check</i> <i class="material-icons" @click="note.show_deletion_bar = !note.show_deletion_bar">close</i>
			    </div>
			    <span>{{ note.contents }}</span>
			    <!--v-show="!show_big_popup && !note.show_deletion_bar"-->
			    <div class="btn_panel" >
						<i class="material-icons" @click="editNote(index)">mode_edit</i>
						<i class="material-icons" @click="note.show_deletion_bar = !note.show_deletion_bar">delete</i>
					</div>
				</div>
			</div>
		</div>
		<div v-else-if="no_notes" id="no_notes">
			Nie masz jeszcze żadnych notatek.
			<button @click="addFirstNote">dodaj nową</button>
		</div>
	</div>
</template>

<script>
	import './css/listOfNotes.css'
	import notePopup from './notePopup.vue'
	import auth from './user/auth'
	import EventBus from './eventBus'
	export default {
		created: function() {
			// TODO: get data from the EventBus and assign it to this.notes
			//this.notes = notes;
		},
		computed: {
			// TODO (send get notes request)
			// auth.getNotes().then();
			// ???
		},
		data: function() {
			return {
				notes: [],
				no_notes: true
			}
		},
		methods: {
			addFirstNote: function() {
				this.no_notes = false;
				this.addNote();

			},
			addNote: function() {
				var k = 0, n = this.notes.length;

				if (n > 0) {
					k = 1 + this.notes[n-1].id
				}

				this.notes.push(
					{ id: k, contents: '', show_deletion_bar: false }
				)

				// TODO communication with the EventBus
			},
			editNote: function(k) {
				var n = this.notes.length;

				if (k > -1 && k < n) {
					EventBus.$emit("edit-note", this.notes[k].contents, this.notes[k].id);

					// TODO
				}
			},
			deleteNote: function(k) {
				var n = this.notes.length;

				if (k > -1 && k < n) {
					this.notes[k].show_deletion_bar = false;
          this.notes.splice(this.notes[k], 1);
          n--;

          if (n === 0) {
          	this.no_notes = true;
          }

					// TODO (send delete note request)
					// auth.deleteNote(k).then()
				}
			}
		},
		components: {
			notePopup	
		}
	}
</script>