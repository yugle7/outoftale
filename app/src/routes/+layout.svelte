<script>
	import '../styles.css';

	import Side from '$lib/menu/Side.svelte';
	import Page from '$lib/menu/Page.svelte';

	import { screen, back } from '$lib';
	import { page, navigating } from '$app/stores';

	export let data;
	$: profile = data.profile;

	let width;

	$: $screen = width < 600 ? 'content' : null;

	$: if (!profile && $page.url.pathname) {
		const p = $page.url.pathname;
		if (p.startsWith('/problems') || p.startsWith('/discussions')) {
			$back = p;
		} else if (p.startsWith('/users')) {
			$back = '';
		}
	}
</script>

<svelte:window bind:innerWidth={width} />

<svelte:head>
	<script>
		if (document) {
			theme =
				localStorage.getItem('theme') ||
				(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
			document.documentElement.dataset.theme = theme;
		}
	</script>
</svelte:head>

{#if width}
	{#if $screen}
		<Page {profile} />
		{#if $navigating}
			<h1 class="title shy line-3">Отправляем</h1>
		{:else}
			<slot />
		{/if}
	{:else}
		<main>
			<Side {profile} />
			{#if $navigating}
				<div class="over" />
			{/if}
			<slot />
		</main>
	{/if}
{/if}

<style>
	main {
		display: grid;
		grid-template-columns: auto 1fr auto;
		margin: 0 auto;
		height: 100dvh;
	}
	div {
		animation: send 1s ease-in;
		opacity: 50%;
	}
	@keyframes send {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 0.5;
		}
	}
</style>
