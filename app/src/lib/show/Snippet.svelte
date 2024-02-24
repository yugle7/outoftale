<script>
	import Author from './Author.svelte';

	export let chat;
	export let profile;

	const { type, sender_id, message } = chat;
	const { text, author } = message || {};
</script>

{#if !message}
	<p>Начать переписку</p>
{:else if profile.id === sender_id}
	<p class="clamp">
		<span class="link small">Я:</span>
		{text}
	</p>
{:else if type === 0}
	<p class="clamp">{text}</p>
{:else}
	<div class="col">
		<Author {author} />
		<p class="clamp">{text}</p>
	</div>
{/if}
