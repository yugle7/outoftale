<script>
	export let key;
	export let count;
	export let href;
</script>

{#if count}
	<a {href} class="row gap-5 link">
		<img src="/icons/{key}.svg" alt={key} />
		<span class="monospace">{count}</span>
	</a>
{/if}

<style>
	a {
		align-items: flex-end;
		padding-left: 0;
	}
	img {
		padding: 0;
	}
</style>
