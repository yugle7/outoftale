<script>
	import { params } from '$lib';
	import { getMask } from './data';

	export let key;
	export let labels;
	export let title;

	let values = $params[key].map(String);
	$: $params[key] = values;

	$: mask = getMask(values);
	let selected = values.length > 0;

	$: console.log($params, values);
</script>

<button class="link font-14" on:click|preventDefault={() => (selected = !selected)}>
	{#if selected}
		{values.map((v) => labels[v]).join(', ')}
	{:else}
		{title}
	{/if}
</button>

<div class="col gap-10" class:hidden={selected}>
	{#each Object.entries(labels) as [value, label] (value)}
		<label class="link" class:selected={mask & (1 << value)}>
			<input type="checkbox" name={key} {value} bind:group={values} />
			{label}
		</label>
	{/each}
</div>

<style>
	input[type='checkbox'] {
		visibility: hidden;
	}
	label:before {
		content: '–';
	}
</style>
