<script>
	import { enhance, applyAction } from '$app/forms';
	import { pb, screen } from '$lib';

	import { onDestroy, onMount } from 'svelte';
	import { show, look, down, find } from './data';

	import Header from './Header.svelte';
	import Read from './Read.svelte';
	import Send from './Send.svelte';
	import Find from './Find.svelte';

	export let talk = { read: 0 };
	export let chat;

	let messages = [];

	export let profile;
	let date;
	let sent;

	if ($screen) $screen = 'content';

	async function download() {
		messages = chat.messages;
		sent = messages.length;

		date = null;
		messages.forEach((m) => {
			if (!m.deleted && !m.created.startsWith(date)) {
				m.date = date = m.created.substring(0, 11);
			}
			if (profile) m.react = talk.reacts[m.id];
		});

		$look = talk.message_id;
	}

	async function subscribe() {
		await download();

		await pb.collection('messages').subscribe('*', async ({ action, record }) => {
			if (record.chat_id !== chat.id) return;

			if (action === 'create') {
				if (!record.created.startsWith(date)) {
					record.date = date = record.created.substring(0, 11);
				}
				messages = [...messages, record];
				sent++;

				chat.sent = sent;
				chat.message = record;

				if (profile && $down) {
					await pb.collection('talks').update(talk.id, { read: sent });
					talk.read = sent;

					if (record.author_id !== talk.profile_id) {
						await pb.collection('chats').update(chat.id, { read: sent });
						chat.read = sent;
					}
				}
			}
			if (action === 'update') {
				if (record.deleted && record.author_id === profile.id) {
					record.deleted = null;
				}
				const k = messages.findIndex((m) => m.id === record.id);
				record.date = messages[k].date;
				messages[k] = record;
			}
			$show = true;
		});

		if (profile) {
			await pb.collection('chats').subscribe(chat.id, async ({ action, record }) => {
				if (action === 'update') chat = record;
			});
			await pb.collection('talks').subscribe(talk.id, async ({ action, record }) => {
				if (action === 'update') {
					if (record.message_id) {
						$look = record.message_id;
						await pb.collection('talks').update(talk.id, { message_id: null });
					}
				}
				if (action !== 'delete') {
					talk.deleted = record.deleted;
				}
			});
		}
	}
	function unsubscribe() {
		pb.collection('messages').unsubscribe('*');

		if (profile) {
			pb.collection('chats').unsubscribe(chat.id);
			pb.collection('talks').unsubscribe(talk.id);
		}
	}

	onMount(subscribe);
	onDestroy(unsubscribe);
</script>

<div class="col side">
	<Header {chat} {talk} />
	{#if $find}
		<Find {messages} />
	{:else}
		<Read {talk} {chat} {profile} {messages} />

		{#if profile}
			{#if !profile.role && (chat.type || talk.user.username !== 'support')}
				<a href="/discussions/000000000000000" target="_self" class="footer center link padding-10">
					Стать участником
				</a>
			{:else if talk.deleted}
				<form method="post" action="/chats?/delete" use:enhance={() => applyAction} class="footer">
					<input type="hidden" value={talk.id} name="talk_id" id="talk_id" />
					<input type="hidden" value={false} name="deleted" id="deleted" />

					<button class="center width-100 link padding-10" type="submit">
						Войти в чат
					</button>
				</form>
			{:else}
				<Send {chat} {profile} />
			{/if}
		{:else}
			<a href="/login" class="footer center link padding-10">Войти</a>
		{/if}
	{/if}
</div>
