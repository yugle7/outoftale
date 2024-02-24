<script>
	import { react_color } from './data';

	export let key;
	export let active = null;
	export let count = null;

	$: color = active ? react_color[key] : '';
</script>

<button class:link={active != null} class="row gap-2 padding-3" on:click>
	<img class={color} src="/icons/{key}.svg" alt={key} />
	{#if count > 1}<span class="monospace">{count}</span>{/if}
</button>

<style>
	button {
		align-items: flex-end;
		padding-right: 10px;
		padding-left: 0;
	}

	img {
		padding: 0;
		min-width: 20px;
	}

	.green {
		filter: sepia(100%) saturate(10000%) hue-rotate(150deg);
	}
	.red {
		filter: sepia(100%) saturate(10000%) hue-rotate(50deg);
	}
	.yellow {
		filter: sepia(100%) saturate(200%);
	}
	.blue {
		filter: sepia(100%) saturate(10000%) hue-rotate(220deg);
	}
	.purple {
		filter: sepia(100%) saturate(10000%) hue-rotate(270deg);
	}
	.pink {
		filter: sepia(100%) saturate(1000%) hue-rotate(270deg);
	}
	.brown {
		filter: sepia(100%) saturate(10000%) hue-rotate(60deg);
	}
</style>
