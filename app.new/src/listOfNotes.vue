<template>
	<div v-show="!no_notes" class="grid" id="grid_of_notes">
		<div class="note" v-for="(note, index) in notes" v-bind:class="{ no_hover: show_big_popup }">
		    <div class="deletion_bar" v-show="note.show_deletion_bar"><span>usunąć?</span>
				<i class="material-icons" @click="delete_note(index)">check</i> <i class="material-icons" @click="note.show_deletion_bar = !note.show_deletion_bar">close</i>
		    </div>
		    <span>{{ note.contents }}</span>
		    <div class="btn_panel" v-show="!show_big_popup && !note.show_deletion_bar">
				<i class="material-icons" @click="edit_note(index)">mode_edit</i>
				<i class="material-icons" @click="note.show_deletion_bar = !note.show_deletion_bar">delete</i>
			</div>
		</div>
	</div>
</template>

<script>
	import './css/index.css'
	import './css/styles.css'
	import auth from './user/auth'
	export default {
		computed: {
			// TODO (send get notes request)
			// auth.getNotes().then();
		},
		methods: {
			edit_note: function( k ) {
				var notesCount = 0;
				if( k > -1 && k < notesCount ) {
					// TODO
				}
			},
			delete_note: function( k ) {
				var notesCount  0;
				if( k > -1 && k < notesCount ) {
					// TODO (send delete note request)
					// auth.deleteNote(k).then()
				}
			}
		}
	}
</script>