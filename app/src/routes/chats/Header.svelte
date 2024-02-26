<script>
	import { screen } from '$lib';

	import Header from '$lib/show/Header.svelte';
	
	export let type = null;
</script>

<Header>
	<button class="padding-5" on:click={() => ($screen = 'menu')}>
		<img class="icon" src="/icons/menu.svg" alt="menu" />
	</button>

	<div class="center">
		<slot />
	</div>

	{#if type}
		<a class="padding-5" href="?type={type}">
			<img class="icon" src="/icons/chat.svg" alt="chat" />
		</a>
	{:else}
		<button class="padding-5" on:click={() => ($screen = 'params')}>
			<img class="icon" src="/icons/chat.svg" alt="chat" />
		</button>
	{/if}
</Header>
