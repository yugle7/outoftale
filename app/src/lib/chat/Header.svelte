<script>
	import { find, chat_type, getTitle } from './data';

	import { screen } from '$lib';
	import { page } from '$app/stores';

	export let talk;
	export let chat;

	const handleFind = () => {
		$find = value > '' ? value.toLowerCase() : null;
	};

	const handleClose = () => {
		value = '';
		$find = null;
	};

	let input;
	let value;

	$: if (input) input.focus();
</script>

<nav>
	{#if $find != null}
		<button class="icon" on:click={handleClose}>
			<img src="/icons/close.svg" alt="close" />
		</button>
		<form on:submit|preventDefault={handleFind}>
			<input type="text" bind:value bind:this={input} />
		</form>
		<button on:click={handleFind}>
			<img src="/icons/find.svg" alt="find" />
		</button>
	{:else}
		{#if $screen}
			<button on:click={() => ($screen = 'menu')}>
				<img class="icon" src="/icons/menu.svg" alt="menu" />
			</button>
			<a class="title" href={$page.url.pathname}>
				{getTitle(chat, talk)}
			</a>
		{:else}
			<a href={$page.url.pathname}>
				<img src="/icons/roll.svg" alt="params" />
			</a>
			<span class="title">{chat_type[chat.type]}</span>
		{/if}

		<button class="link" on:click={() => ($find = '')}>
			<img src="/icons/find.svg" alt="find" />
		</button>
	{/if}
</nav>

<style>
	form,
	input {
		width: 100%;
	}
	a,
	button {
		padding: 5px;
	}
</style>
