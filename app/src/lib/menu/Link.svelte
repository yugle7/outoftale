<script>
	import { params } from '$lib';
	import { page } from '$app/stores';

	export let href;
	export let key;

	$: selected = $page.url.pathname === href;
</script>

<a {href} class="row gap-15" class:selected on:click={() => ($params = {})}>
	<img src="/icons/{key}.svg" alt={key} />
	<slot />
</a>

<style>
	img {
		min-width: 40px;
	}
	a {
		align-items: center;
		cursor: pointer;
	}
</style>
