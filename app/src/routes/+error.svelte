<script>
	import { page } from '$app/stores';
</script>

<div class="title">
	<h1>{$page.status}</h1>

	<p>{$page.error.message}</p>
</div>

<style>
	h1 {
		font-size: 48px;
	}
	div {
		padding: 20px;
	}
</style>
