<script>
	import { params } from '$lib';

	export let key;
	export let labels;
</script>

<div class="col gap-20">
	{#each labels as label, i (i)}
		<button
			class="link"
			class:selected={(1 << i) & $params[key]}
			on:click|preventDefault={() => ($params[key] ^= 1 << i)}
		>
			{label}
		</button>
	{/each}
</div>
