<script>
	import { screen } from '$lib';

	import Header from '$lib/show/Header.svelte';
	export let topic;
</script>

<Header>
	<button class="padding-5" on:click={() => ($screen = 'menu')}>
		<img class="icon" src="/icons/menu.svg" alt="menu" />
	</button>

	<div class="center">
		<slot />
	</div>

	<a class="padding-5" href="/discussions?topic={topic}">
		<img class="icon" src="/icons/discussions.svg" alt="topic" />
	</a>
</Header>
