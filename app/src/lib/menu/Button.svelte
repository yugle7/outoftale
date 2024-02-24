<script>
	export let key;
</script>

<button class="row link gap-15" on:click>
	<img src="/icons/{key}.svg" alt={key} />
	<slot />
</button>

<style>
	img {
		min-width: 40px;
	}
	button {
		align-items: center;
	}
</style>
