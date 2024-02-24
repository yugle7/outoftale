<script>
	import { page } from '$app/stores';
	import { screen } from '$lib';

	export let href;
</script>

<a
	{href}
	class="center"
	class:selected={$page.url.pathname === href}
	on:click={() => ($screen = 'content')}
>
	<slot />
</a>
