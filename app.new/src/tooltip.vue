<template>
	<span class="tooltip">
		<span class="hidden" style="display: none">{{ hiddenContents }}</span>
		<span class="visible" v-on:mouseout="mouse_out" v-on:mouseover="mouse_over">{{ contents }}</span>
	</span>
</template>

<script>
	import './css/tooltip.css'
	export default {
		props: {
			hiddenContents: {
				type: String,
				default: ''
			},
			contents: {
				type: String,
				default: ''
			}
		},
		methods: {
			mouse_over: function( e ) {
        var parent            = e.target.parentElement,
        		parent_rect				= parent.getBoundingClientRect(),
            parent_t          = parent.offsetTop,
            parent_l          = parent.offsetLeft,
            tooltip_contents  = e.target.previousElementSibling;

        tooltip_contents.style.display = 'block';

        var tooltip_h     	= tooltip_contents.offsetHeight,
            tooltip_w     	= tooltip_contents.offsetWidth,
            tooltip_top   	= (parent_t - tooltip_h) + 'px',
            tooltip_left  	= parent_l + 'px',
            tooltip_right		= '',
            tooltip_bottom	= '';

        if (parent_rect.left + tooltip_w >= window.innerWidth) {
          tooltip_left = '';
          tooltip_right = '0px';
        }

        if (parent_rect.top - tooltip_h <= 0) {
          tooltip_bottom = '';
          tooltip_top = (parent_t + tooltip_h) + 'px';
        }

        tooltip_contents.style.top = tooltip_top;
        tooltip_contents.style.left = tooltip_left;
        tooltip_contents.style.right = tooltip_right;
        tooltip_contents.style.bottom = tooltip_bottom;
			},

			mouse_out: function( e ) {
				e.target.parentElement.childNodes[0].style.display = 'none';
			}
		}
	}
</script>