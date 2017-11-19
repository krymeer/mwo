<template>
	    <i class="material-icons" v-show="!no_notes" @click="add_note" id="add_note">note_add</i>
</template>

<script>
	import EventBus from './eventBus.js'
	export default {
		computed: {
			no_notes: function() {
				return false;
			}
		},
		methods: {
			add_note: function() {
				EventBus.$emit( "show-popup", 2 );
				return true;
			}
		}
	}
</script>

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>