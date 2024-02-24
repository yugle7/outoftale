<script>
	export let key;
</script>

<button class="link" on:click>
	<img class="icon" src="/icons/{key}.svg" alt={key} />
</button>


<style>
	img {
		width: 40px;
	}
</style>