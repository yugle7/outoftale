<script>
	export let user;

	const { position, rating } = user;
</script>

<span class="monospace">
	{#if rating > 0}
		{position} место — {rating}
	{:else}
		Не в рейтинге
	{/if}
</span>
