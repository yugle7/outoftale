<script>
	import { onMount } from 'svelte';

	import Link from './Link.svelte';
	import Button from './Button.svelte';

	export let profile;

	let theme;
	let width;

	onMount(() => {
		theme = document.documentElement.dataset.theme;
		width = localStorage.getItem('menu_width') || 'auto';
	});

	function changeTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
		document.documentElement.dataset.theme = theme;
	}
	function changeWidth() {
		width = width === 'auto' ? '0' : 'auto';
		localStorage.setItem('menu_width', width);
	}
</script>

<menu class="col away">
	{#if width}
		<div class="col left-15 top-20 right-30 gap-20" style="width: {width}">
			<Link href="/about" key="about">О сайте</Link>
			<Link href="/problems" key="problems">Задачи</Link>

			{#if profile?.role >= 2}
				<Link href="/drafts" key="drafts">Правки</Link>
				<Link href="/solutions" key="solutions">Решения</Link>
			{/if}

			<Link href="/users" key="users">Люди</Link>
			<Link href="/discussions" key="discussions">Общение</Link>

			{#if profile}
				<Link href="/chats" key="chats">Чаты</Link>
			{/if}

			{#if profile}
				<Link href="/users/{profile.username}" key="profile">Профиль</Link>
			{:else}
				<Link href="/login" key="login">Войти</Link>
			{/if}

			{#if theme}
				<Button key={theme} on:click={changeTheme}>
					{#if theme === 'light'}
						Тьма
					{:else}
						Свет
					{/if}
				</Button>
			{/if}
		</div>

		<button class="link" on:click={changeWidth}>
			{#if width === 'auto'}
				&larr;
			{:else}
				&rarr;
			{/if}
		</button>
	{/if}
</menu>

<style>
	menu {
		background-color: var(--nav-color);
		border-right: 1px solid var(--color-10);
		white-space: nowrap;
		overflow: hidden;
		min-width: 70px;
	}
	button {
		border-top: 1px solid var(--color-20);
		width: 100%;
		text-align: center;
	}

	@media (max-width: 700px) {
		menu {
			width: 0;
		}
		button {
			display: none;
		}
	}
</style>
