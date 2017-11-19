<template>
	<div v-show="no_notes" id="no_notes">
		Nie masz jeszcze żadnych notatek.
		<button @click="add_note">dodaj nową</button>
	</div>
</template>

<script>
	import auth from './user/auth'
	export default {
		computed: {
			no_notes: function() {
				return true;
			}
		},
		methods: {
			add_note: function() {
				// TODO: send addNote request
				// auth.addNote().then();
			}
		}
	}
</script>