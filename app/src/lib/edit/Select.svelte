<script>
	import { params } from '$lib';
	import { onMount } from 'svelte';
	import { getMask } from './data';

	export let key;
	export let labels;
	export let title;

	$: mask = getMask($params[key]);

	let selected = true;

	onMount(() => {
		$params[key] = $params[key].map(String);
	});
</script>

<div>
	{#if selected}
		<button class="link font-14" on:click={() => (selected = false)}>
			{$params[key].map((v) => labels[v]).join(', ')}
		</button>
	{:else}
		<button class="link font-14" on:click={() => (selected = true)}>{title}</button>
	{/if}
	<div class="col gap-10 top-10" class:hidden={selected}>
		{#each Object.entries(labels) as [value, label] (value)}
			<label class="link" class:selected={mask & (1 << value)}>
				<input type="checkbox" name={key} {value} bind:group={$params[key]} />
				{label}
			</label>
		{/each}
	</div>
</div>

<style>
	input[type='checkbox'] {
		visibility: hidden;
	}
	label:before {
		content: '–';
	}
</style>
