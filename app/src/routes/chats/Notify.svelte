<script>
	import Ago from '$lib/show/Ago.svelte';

	export let chat;
	export let talk;

	export let profile;

	$: is_sender = chat.sender_id === profile.id;
</script>

<div class="col">
	<Ago time={chat.changed} />

	{#if talk.message_id}
		<img src="/icons/at.svg" alt="notify" />
	{:else if chat.sent > talk.read}
		<span class="circle">{chat.sent - talk.read}</span>
	{:else if is_sender}
		<img src="/icons/{chat.sent > chat.read ? 'sent' : 'read'}.svg" alt="read" />
	{/if}
</div>

<style>
	div {
		position: absolute;
		align-items: flex-end;
		top: 20px;
		right: 20px;
	}
	span {
		width: auto;
		float: right;
	}
	img {
		min-width: 20px;
	}
</style>
