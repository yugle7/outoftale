<script>
	import { parse } from './data';

	import Secret from './Secret.svelte';

	export let text;
</script>

<div class="col gap-5">
	{#each parse(text) as result}
		{#if typeof result === 'string'}
			<p class="monospace font-20">{result}</p>
		{:else}
			<p>
				{#each result as r}
					{#if typeof r === 'string'}
						<span class="right-5">{r}</span>
					{:else if r.length === 1}
						<span class="monospace font-20 right-5">{r[0]}</span>
					{:else if r[0] === '@'}
						<a href="/users/{r[1]}">{r[1]}</a>
					{:else if typeof r[0] === 'string'}
						<a href={r[0]} target="_blank">{r[1]}</a>
					{:else}
						<Secret title={r[1]} result={r[0]} />
					{/if}
				{/each}
			</p>
		{/if}
	{/each}
</div>