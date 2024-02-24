<script>
	import { params } from '$lib';

	export let key;
	export let labels;
	export let title;

	let selected = $params[key] != null;
</script>

{#if selected}
	<button class="link font-14" on:click|preventDefault={() => (selected = false)}>
		{labels[$params[key]]}
	</button>
{:else}
	<div class="col gap-10">
		<button class="link font-14" on:click|preventDefault={() => (selected = true)}>{title}</button>
		{#each Object.entries(labels) as [v, label] (v)}
			<label class="link" class:selected={$params[key] == v}>
				<input
					type="radio"
					name={key}
					value={v}
					bind:group={$params[key]}
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
