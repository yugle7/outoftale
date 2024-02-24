<script>
	import { onMount } from 'svelte';

	let x;
	let width;

	const handleMove = (e) => {
		width = x - e.pageX;
	};
	const handleUp = () => {
		localStorage.setItem('chat_width', width);
		x = null;
		finish();
	};
	const handleDown = (e) => {
		x = width + e.pageX;
		start();
	};

	const start = () => {
		addEventListener('mousemove', handleMove);
		addEventListener('mouseup', handleUp);
	};
	const finish = () => {
		try {
			removeEventListener('mouseup', handleUp);
			removeEventListener('mousemove', handleMove);
		} catch (err) {
			console.log(err.message);
		}
	};

	onMount(() => {
		width = Math.max(200, Math.min(localStorage.getItem('chat_width') || 300, 700));
		return finish;
	});
</script>

<div class="row" style="width: {width}px">
	<button on:mousedown={handleDown} />
	<slot />
</div>

<style>
	button {
		width: 4px;
		background-color: var(--color-10);
		height: 100dvh;
		cursor: ew-resize;
	}
	button:hover {
		background-color: var(--color-20);
	}
</style>
