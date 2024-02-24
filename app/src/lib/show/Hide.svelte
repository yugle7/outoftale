<script>
	export let hidden = true;
	export let label;

	$: alt = hidden ? 'show' : 'hide';
</script>

<div>
	<button class="link row center" on:click={() => (hidden = !hidden)}>
		<h3 class="font-16">{label}</h3>
		<img src="/icons/{alt}.svg" {alt} />
	</button>

	<div class:hidden>
		<slot />
	</div>
</div>

<style>
	button {
		gap: 3px;
	}
	img {
		min-width: 20px;
		margin-top: 5px;
	}
</style>
