<script>
	import { params } from '$lib';

	export let key;
	export let values;
	export let title;
</script>

<div class="row line-1 gap-5 font-16">
	<span class="label right-5">{title}</span>
	
	{#each values as v (v)}
		<button
		class="button"
			class:selected={$params[key] === v}
			on:click|preventDefault={() => ($params[key] = v === $params[key] ? null : v)}
		>
			{v}
		</button>
	{/each}
</div>

<style>
	button {
		width: 34px;
		padding: 8px 0;
		transition: none;
	}
	div {
		min-width: fit-content;
	}
</style>
