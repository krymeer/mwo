<template>
	    <i class="material-icons" v-show="!no_notes && !show_big_popup" @click="add_note" id="add_note">note_add</i>
</template>

<script>
	import app from './app.vue'
	export default {
		data: function() {
			return globals;
		},
		methods: {
			add_note: {
				function() {
					app.add_note();
				}
			}
		}
	}
</script>

<style src="./css/styles.css"></style>
<style src="./css/index.css"></style>