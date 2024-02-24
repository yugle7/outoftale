<script>
	export let contacts;
</script>

<ul>
	{#each contacts as contact}
		<li class="center"><a href="https://{contact}" target="_blank">{contact}</a></li>
	{/each}
</ul>