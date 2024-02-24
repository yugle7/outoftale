<script>
	import { params } from '$lib';
	import { getMask } from './data';

	export let key;
	export let labels;
	export let title;

	$: mask = getMask($params[key]);

	let selected = $params[key].length > 0;
</script>

{#if selected}
	<button class="link font-14" on:click|preventDefault={() => (selected = false)}>
		{$params[key].map((v) => labels[v]).join(', ')}
	</button>
{:else}
	<div class="col gap-10">
		<button class="link font-14" on:click|preventDefault={() => (selected = true)}>
			{title}
		</button>

		{#each Object.entries(labels) as [value, label] (value)}
			<label class="link" class:selected={mask & (1 << value)}>
				<input type="checkbox" name={key} id={key} {value} bind:group={$params[key]} />
				{label}
			</label>
		{/each}
	</div>
{/if}

<style>
	input[type='checkbox'] {
		visibility: hidden;
	}
	label:before {
		content: '–';
	}
</style>
