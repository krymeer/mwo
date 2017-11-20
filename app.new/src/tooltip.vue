<template>
	<span class="tooltip">
		<span class="hidden" style="display: none">{{ hiddenContents }}</span>
		<span class="visible" v-on:mouseout="mouse_out" v-on:mouseover="mouse_over">{{ contents }}</span>
	</span>
</template>

<script>
	import './css/index.css'
	import './css/styles.css'
	export default {
		methods: {
			mouse_over: function( e ) {
				var tooltip_contents = e.target.parentElement.childNodes[0];
				tooltip_contents.style.display = 'block';

				var parent = e.target.parentElement,
					top = parent.offsetTop,
					left = parent.offsetLeft,
					h = tooltip_contents.offsetHeight,
					w = tooltip_contents.offsetWidth;
				tooltip_contents.style.top = (top-h)+'px';
				tooltip_contents.style.left = left+'px';
				tooltip_contents.style.right = '';

				if( parent.parentElement.offsetWidth-left < w ) {
					tooltip_contents.style.left = '';
					tooltip_contents.style.right = '0px';
				}
			},

			mouse_out: function( e ) {
				var tooltip_contents = e.target.parentElement.childNodes[0];
				tooltip_contents.style.display = 'none';
			}
		}
	}
</script>