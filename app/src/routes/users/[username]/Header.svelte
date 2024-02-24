<script>
	import { screen } from '$lib';
	import { enhance } from '$app/forms';

	import Header from '$lib/show/Header.svelte';

	export let user = null;
	export let profile;
</script>

<Header>
	<button on:click={() => ($screen = 'menu')}>
		<img class="icon" src="/icons/menu.svg" alt="menu" />
	</button>
	{#if user}
		<div class="center">Человек</div>
		{#if profile}
			<a href="?type=0">
				<img class="icon" src="/icons/chat.svg" alt="to me" />
			</a>
		{:else}
			<a href="/login">
				<img class="icon" src="/icons/login.svg" alt="login" />
			</a>
		{/if}
	{:else if profile}
		<div class="center">Это я</div>
		<form method="post" action="?/logout" use:enhance>
			<button type="submit">
				<img class="icon" src="/icons/logout.svg" alt="logout" />
			</button>
		</form>
	{/if}
</Header>

<style>
	a {
		opacity: 100%;
	}
	a, button {
		padding: 5px;
	}
</style>
