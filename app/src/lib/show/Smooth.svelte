<script>
	import { afterUpdate, onMount, tick } from 'svelte';

	let col;

	let up = false;
	let down = false;

	const delta = 50;

	function handleScroll() {
		up = col.scrollTop > delta;
		down = col.scrollHeight > delta + col.scrollTop + col.clientHeight;
	}

	function handleDown() {
		col.scroll({
			top: col.scrollHeight + 20,
			behavior: 'smooth'
		});
	}
	function handleUp() {
		col.scroll({
			top: 0,
			behavior: 'smooth'
		});
	}
	onMount(() => {
		tick(() => (down = col.scrollHeight >= col.scrollTop + col.clientHeight));
	});
	afterUpdate(handleScroll);
</script>

<div bind:this={col} on:scroll={handleScroll}>
	{#if up}
		<button class:up on:click|preventDefault={handleUp}>
			<img class="link" src="/icons/hide.svg" alt="up" />
		</button>
	{/if}
	
	<slot />
	
	{#if down}
		<button class:down on:click|preventDefault={handleDown}>
			<img class="link" src="/icons/show.svg" alt="down" />
		</button>
	{/if}
</div>

<style>
	img {
		min-width: 30px;
	}
	button {
		width: 100%;
		position: sticky;
		overscroll-behavior: none;
		z-index: 1;
		text-align: center;
	}
	div {
		overflow: auto;
		-ms-overflow-style: none;
		min-width: 250px;
	}
	.up {
		top: 0;
		background-image: linear-gradient(to bottom, var(--color-0), rgba(0, 0, 0, 0));
		padding-bottom: 10px;
	}
	.down {
		bottom: 0;
		background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), var(--color-0));
		padding-top: 10px;
	}

	div::-webkit-scrollbar {
		width: 0 !important;
	}
</style>
