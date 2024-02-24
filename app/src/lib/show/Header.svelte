<script>
	import { onDestroy, onMount } from 'svelte';

	let scrollY = 0;
	let hidden = false;

	function hide() {
		hidden = scrollY < window.scrollY;
		scrollY = window.scrollY;
	}
	onMount(() => {
		window.addEventListener('scroll', hide);
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('scroll', hide);
		}
	});
</script>

<nav class:hidden>
	<slot />
</nav>
<p />

<style>
	p {
		height: 50px;
	}
	nav {
		position: fixed;
		transition: all 1s ease-in-out;
		background-color: var(--nav-color);
	}
	.hidden {
		transform: translateY(-100%);
	}
</style>
