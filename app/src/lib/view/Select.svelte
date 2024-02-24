<script>
	import { params } from '$lib';

	export let key;
	export let labels;
</script>

<div class="col gap-20">
	{#each labels as label, i (i)}
		<button
			class="link"
			class:selected={$params[key] == i}
			on:click|preventDefault={() => ($params[key] = $params[key] != i ? i : null)}
		>
			{label}
		</button>
	{/each}
</div>

