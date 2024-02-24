<script>
	import ToChat from '$lib/menu/ToChat.svelte';

	import Read from './Read.svelte';
	import Edit from './Edit.svelte';

	import Chat from '$lib/chat/Chat.svelte';
	import Resize from '$lib/show/Resize.svelte';
	import Close from '$lib/show/Close.svelte';

	import { pb, screen } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	export let data;

	let { discussion } = data;

	$: profile = data.profile;

	$: chat = data.chat;
	$: talk = data.talk;

	let edit;

	async function subscribe() {
		await pb.collection('discussions').subscribe(discussion.id, async ({ action, record }) => {
			if (action === 'update') {
				if (edit && discussion.changed != record.changed) edit = null;
				discussion = record;
			}
		});
	}
	function unsubscribe() {
		if (discussion) pb.collection('discussions').unsubscribe(discussion.id);
	}

	onMount(subscribe);
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Общение – {discussion.title}</title>
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else if discussion}
		{#if edit}
			<Close on:click={() => (edit = null)} />
			<Edit {discussion} on:click={() => (edit = false)} />
		{:else}
			<ToChat type="1">Общение</ToChat>
			<Read {discussion} {profile} on:click={() => (edit = true)} />
		{/if}
	{/if}
{:else if discussion}
	{#if edit}
		<Edit {discussion} on:click={() => (edit = false)} />
	{:else}
		<Read {discussion} {profile} chat={!chat} on:click={() => (edit = true)} />
	{/if}

	{#if chat}
		<Resize>
			<Chat {chat} {talk} {profile} />
		</Resize>
	{/if}
{/if}
