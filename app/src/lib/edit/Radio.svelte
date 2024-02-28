<script>
	import { params } from '$lib';

	export let key;
	export let labels;
	export let title;

	let value = $params[key];
	$: $params[key] = value;

	let selected = value != null;
</script>

{#if selected}
	<button class="link font-14" on:click|preventDefault={() => (selected = false)}>
		{labels[value]}
	</button>
{:else}
	<div class="col gap-10">
		<button class="link font-14" on:click|preventDefault={() => (selected = true)}>{title}</button>
		{#each Object.entries(labels) as [v, label] (v)}
			<label class="link" class:selected={value == v}>
				<input
					type="radio"
					name={key}
					value={v}
					bind:group={value}
					on:change={() => (selected = true)}
				/>
				{label}
			</label>
		{/each}
	</div>
{/if}

<style>
	input[type='radio'] {
		visibility: hidden;
	}
	label:before {
		content: '–';
	}
</style>
