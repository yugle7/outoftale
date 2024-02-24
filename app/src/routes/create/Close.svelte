<script>
	export let profile;
</script>

<a href="/users/{profile.username}">
	<img src="/icons/close.svg" alt="close" />
</a>

<style>
	img {
		min-width: 40px;
	}
	a {
		position: fixed;
		top: 0;
		right: 0;
	}
</style>
