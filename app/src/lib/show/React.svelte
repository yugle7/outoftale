<script>
	import { react_color } from './data';

	export let key;
	export let type = 0;
	export let count = null;

	$: color = type ? react_color[key] : '';
	const style = `min-width: ${type == 2 ? 30 : 20}px;`;
</script>

<button class:link={type > 0} class="row gap-2 padding-3" on:click>
	<img class={color} {style} src="/icons/{key}.svg" alt={key} />
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
	}

	.green {
		filter: sepia(100%) saturate(10000%) hue-rotate(150deg);
	}
	.red {
		filter: sepia(100%) saturate(10000%) hue-rotate(45deg);
	}
	.yellow {
		filter: sepia(100%) saturate(1000%) hue-rotate(30deg);
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
		filter: sepia(100%) saturate(100000%) hue-rotate(60deg);
	}
</style>
