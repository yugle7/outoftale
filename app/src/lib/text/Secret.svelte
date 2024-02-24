<script>
	import { isClick } from '$lib/chat/data';

	export let title;
	export let result;

	let hidden = title !== '+';

	let color;
	let style;

	if (title === '+') {
		title = String.fromCharCode(65291);
		color = 'green';
	} else if (title === '-') {
		title = String.fromCharCode(65293);
		color = 'red';
	}
	if (color) style = `color: var(--color-${color});`;

	const handle = () => {
		if (isClick(window)) hidden = true;
	};
</script>

<span {style}>
	{#if hidden}
		<button class="link right-5" on:click={()=>(hidden = false)}>{title}</button>
	{:else}
		{#each result as r}
			{#if typeof r === 'string'}
				<span class="right-5" on:click={handle} on:keypress role="button" tabindex="0">{r}</span>
			{:else if r.length === 1}
				<span class="monospace right-5" on:click={handle} on:keypress role="button" tabindex="0">
					{r[0]}
				</span>
			{:else if r[0] === '@'}
				<a class="right-5" href="/users/{r[1]}">{r[1]}</a>
			{:else if typeof r[0] === 'string'}
				<a class="right-5" href={r[0]} target="_blank">{r[1]}</a>
			{/if}
		{/each}
	{/if}
</span>
