<script>
	import { screen } from '$lib';

	import Header from '$lib/show/Header.svelte';
	export let to = 'params';
</script>

<Header>
	<button class="padding-5" on:click={() => ($screen = 'menu')}>
		<img class="icon" src="/icons/menu.svg" alt="menu" />
	</button>

	<div class="center"><slot /></div>

	<button class="padding-5" on:click={() => ($screen = 'params')}>
		<img class="icon" src="/icons/{to}.svg" alt={to} />
	</button>
</Header>
