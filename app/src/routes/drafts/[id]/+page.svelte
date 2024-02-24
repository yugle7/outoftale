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

	let { draft, problem } = data;

	$: profile = data.profile;

	$: chat = data.chat;
	$: talk = data.talk;

	let edit;

	async function subscribe() {
		await pb.collection('drafts').subscribe(draft.id, async ({ action, record }) => {
			if (action === 'update') {
				if (edit && draft.changed != record.changed) edit = false;
				draft = record;
			}
		});
		await pb.collection('problems').subscribe(problem.id, async ({ action, record }) => {
			console.log(action, record);
			if (action === 'update') problem = record;
		});
	}
	function unsubscribe() {
		pb.collection('drafts').unsubscribe(draft.id);
		pb.collection('problems').unsubscribe(problem.id);
	}
	onMount(subscribe);
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Правка – {draft.title}</title>
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else if draft}
		{#if edit}
			<Close on:click={() => (edit = false)} />
			<Edit {draft} on:click={() => (edit = false)} />
		{:else}
			<ToChat type="8">Правка</ToChat>
			<Read {draft} {problem} {profile} on:click={() => (edit = true)} />
		{/if}
	{/if}
{:else if draft}
	{#if edit}
		<Edit {draft} on:click={() => (edit = false)} />
	{:else}
		<Read {draft} {problem} {profile} chat={!chat} on:click={() => (edit = true)} />
	{/if}

	{#if chat}
		<Resize>
			<Chat {chat} {talk} {profile} />
		</Resize>
	{/if}
{/if}
