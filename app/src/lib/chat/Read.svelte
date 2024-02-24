<script>
	import { pb } from '$lib';
	import { browser } from '$app/environment';

	import Ago from '$lib/show/Ago.svelte';

	import { down, select, look, show, scroll } from './data';
	import { afterUpdate, onDestroy, onMount } from 'svelte';

	import Message from './Message.svelte';

	export let talk;
	export let chat;

	export let profile;
	export let messages;

	const read = talk.read > 0 && talk.read < chat.sent && talk.read;
	$: is_sender = profile && chat.sender_id === profile.id;

	let output;
	let locked;

	let talk_offset = 0;
	let chat_offset = 0;

	const handleScroll = () => {
		const offset = output.scrollTop + output.clientHeight;

		$down = offset + 10 >= output.scrollHeight;
		if (!talk) return;

		chat_offset = Math.max(chat_offset, offset);

		if (document && talk_offset < chat_offset && talk.read < chat.sent && !locked) {
			locked = true;
			setTimeout(updateTalk, 2000);
			setTimeout(() => (locked = false), 1000);
		}
	};
	async function updateTalk() {
		let read = talk.read - (talk_offset > 0);

		while (talk_offset < chat_offset && read < messages.length) {
			talk_offset = document.getElementById(messages[read].id).offsetTop;
			read++;
		}

		if (talk.id && talk.read < read) {
			if (!is_sender && read > chat.read) {
				await pb.collection('chats').update(chat.id, { read });
			}
			await pb.collection('talks').update(talk.id, { read });
		}
	}

	onMount(() => {
		if (!$look && chat.sent === talk.read) {
			setTimeout(() => {
				output.scroll({ top: output.scrollHeight });
				$down = true;
				$show = true;
			}, 0);
		}
	});

	$: if (output && $scroll !== 0) {
		output.scroll({ top: output.scrollTop + $scroll });
		$scroll = 0;
	}
	$: if (output && $look && document) {
		const m = document.getElementById($look);
		$look = null;

		m.scrollIntoView();
		m.classList.add('look');
		setTimeout(() => m.classList.remove('look'), 2000);
	}
	$: if (output && $select && document) {
		const m = document.getElementById($select);
		$select = null;

		const top = m.offsetTop + m.offsetHeight - output.clientHeight;
		if (top > output.scrollTop) output.scroll({ top });
	}

	$: if (output && $show && document) {
		$show = null;

		if (document.visibilityState !== 'visible') $down = false;

		if ($down) {
			setTimeout(
				() =>
					output.scroll({
						top: output.scrollHeight,
						behavior: 'smooth'
					}),
				0
			);
		}
	}
</script>

<ul id="output" bind:this={output} class="col" on:scroll={handleScroll}>
	{#each messages as message, i (message.id)}
		{#if i === read}
			<div class="center padding-10" id="unread">Новые сообщения</div>
		{/if}
		{#if message.date}
			<div class="center padding-10 line-2">
				<Ago time={message.date} />
			</div>
		{/if}
		{#if !message.deleted}
			<li id={message.id} class:highlighted={() => is_sender && i >= chat.read}>
				<Message {talk} {message} {profile} />
			</li>
		{/if}
	{/each}
</ul>

<style>
	ul {
		flex-grow: 1;
		overflow-y: auto;
	}
</style>
