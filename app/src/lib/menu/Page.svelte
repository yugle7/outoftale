<script>
	import { screen } from '$lib';
	import { onMount } from 'svelte';

	import Close from '$lib/show/Close.svelte';

	import Route from './Route.svelte';

	export let profile;

	let theme;

	onMount(() => {
		theme = document.documentElement.dataset.theme;
	});

	function changeTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		document.documentElement.dataset.theme = theme;
	}
</script>

<menu class="col over top-40 gap-20" class:hidden={$screen !== 'menu'}>
	<Close on:click={() => ($screen = 'content')} />

	<Route href="/about">О сайте</Route>
	<Route href="/problems">Задачи</Route>

	{#if profile?.role >= 2}
		<Route href="/drafts">Правки</Route>
		<Route href="/solutions">Решения</Route>
	{/if}

	<Route href="/users">Люди</Route>
	<Route href="/discussions">Общение</Route>

	{#if profile}
		<Route href="/chats">Чаты</Route>
	{/if}

	{#if profile}
		<Route href="/users/{profile.username}">Профиль</Route>
	{:else}
		<Route href="/login">Войти</Route>
	{/if}

	{#if theme}
		<button class="link center" on:click={changeTheme}>
			{#if theme === 'light'}
				Тьма
			{:else}
				Свет
			{/if}
		</button>
	{/if}
</menu>
