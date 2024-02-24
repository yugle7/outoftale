<script>
	import { pb, screen, member_became } from '$lib';

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

	function download() {
		messages = chat.messages;
		sent = messages.length;

		date = null;
		messages.forEach((m) => {
			if (!m.deleted && !m.created.startsWith(date)) {
				m.date = date = m.created.substring(0, 11);
			}
			if (profile) m.react = talk.reacts[m.id];
		});

		if (talk.message_id) {
			$look = talk.message_id;
			pb.collection('talks').update(talk.id, { message_id: null });
		}
	}

	async function subscribe() {
		download();

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
				messages[k] = record;
			}
			$show = true;
		});

		if (profile) {
			await pb.collection('chats').subscribe(chat.id, async ({ action, record }) => {
				if (action === 'update') {
					chat.read = record.read;
					chat.sender_id = record.sender_id;
				}
			});
			await pb.collection('talks').subscribe(talk.id, async ({ action, record }) => {
				if (action === 'update') {
					if (record.message_id) {
						$look = record.message_id;
						pb.collection('talks').update(talk.id, { message_id: null });
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
				<a href="/discassions/{member_became}" target="_self" class="footer center link padding-10">
					Стать участником
				</a>
			{:else if talk.deleted}
				<button
					class="footer center link padding-10"
					on:click={async () => {
						try {
							talk.deleted = false;
							pb.collection('talks').update(talk.id, { deleted: false });
						} catch (err) {
							console.log(err.message);
						}
					}}
				>
					Войти в чат
				</button>
			{:else}
				<Send {talk} {chat} {profile} />
			{/if}
		{:else}
			<a href="/login" class="footer center link padding-10">Войти</a>
		{/if}
	{/if}
</div>
