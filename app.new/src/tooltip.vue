<template>
	<span class="tooltip">
		<span class="hidden" style="display: none">{{ hiddenContents }}</span>
		<span class="visible" v-on:mouseout="mouseOut" v-on:mouseover="mouseOver">{{ contents }}</span>
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
			mouseOver: function( e ) {
        var parent          = e.target.parentElement,
        		parentRect			= parent.getBoundingClientRect(),
            parentTop       = parent.offsetTop,
            parentLeft      = parent.offsetLeft,
            tooltipContents = e.target.previousElementSibling;

        tooltipContents.style.display = 'block';

        var tooltipHeight = tooltipContents.offsetHeight,
            tooltipWidth  = tooltipContents.offsetWidth,
            tooltipTop   	= (parentTop - tooltipHeight) + 'px',
            tooltipLeft  	= parentLeft + 'px',
            tooltipRight	= '',
            tooltipBottom	= '';

        if (parentRect.left + tooltipWidth >= window.innerWidth) {
          tooltipLeft = '';
          tooltipRight = '0px';
        }

        if (parentRect.top - tooltipHeight <= 0) {
          tooltipBottom = '';
          tooltipTop = (parentTop + tooltipHeight) + 'px';
        }

        tooltipContents.style.top = tooltipTop;
        tooltipContents.style.left = tooltipLeft;
        tooltipContents.style.right = tooltipRight;
        tooltipContents.style.bottom = tooltipBottom;
			},

			mouseOut: function( e ) {
				e.target.parentElement.childNodes[0].style.display = 'none';
			}
		}
	}
</script>