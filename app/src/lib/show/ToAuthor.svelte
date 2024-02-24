<script>
	import Author from './Author.svelte';
	export let author;
</script>

<a href="/users/{author.username}"><Author {author} /></a>

<style>
	a {
		opacity: 75%;
		padding-right: 5px;
	}
	a:hover {
		opacity: 100%;
	}
</style>