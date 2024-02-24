<script>
	import { params } from '$lib';

	export let key;
	export let values;
	export let title;
</script>

<div class="row gap-10">
	<span>{title}</span>
	
	{#each values as v (v)}
		<label class="button" class:selected={$params[key] == v}>
			<input type="radio" name={key} value={v} bind:group={$params[key]} />
			{v}
		</label>
	{/each}
</div>

<style>
	input[type='radio'] {
		display: none;
	}
	span {
		opacity: 50%;
	}
	label {
		opacity: 50%;
		width: auto;
		padding: 7px 12px;
		float: right;
	}
</style>
