<script>
	import { onMount } from 'svelte';
	import { pb, screen, addId, getAuthor } from '$lib';
	import { handlePaste } from '$lib/edit/data';

	import { scroll, look, reply, edit, down, chat_type, parseUsernames } from './data';

	import Reply from './Reply.svelte';

	let input;

	export let chat;
	export let talk;

	export let profile;

	let disabled = true;
	let message = {};

	$: is_sender = chat.sender_id === profile.id;
	const author = getAuthor(profile);

	$: if ($edit) {
		$reply = $edit.reply;
		input.innerText = $edit.text;
		disabled = false;
	}

	async function updateTalks(usernames, message_id) {
		if (!usernames.length) return;

		const filter = usernames.map((u) => `username="${u}"`).join('||');
		const res = await pb.collection('users').getFullList({ filter });

		await Promise.all(
			res.map(async ({ id }) => {
				const talk_id = addId(id, chat.id);
				try {
					await pb.collection('talks').update(talk_id, { message_id });
				} catch (err) {
					console.log(err.message);
				}
			})
		);
	}
	async function updateTalk() {
		if (!$reply) return;

		const { author_id } = $reply;

		if (author_id !== profile.id) {
			const talk_id = addId(author_id, chat.id);
			await pb.collection('talks').update(talk_id, { message_id: message.id });
		}
	}
	async function createTalk() {
		const { user_id } = talk;
		const id = addId(user_id, chat.id);
		try {
			await pb.collection('talks').create({
				id,
				profile_id: user_id,
				chat_id: chat.id,
				user_id: profile.id,
				user: author
			});
		} catch (err) {
			console.log(err.message);
		}
	}

	async function createMessage(text) {
		const res = await pb.collection('messages').create({
			text,
			author_id: profile.id,
			author,
			chat_id: chat.id,
			reply: $reply
		});

		const { updated, sent } = await pb.collection('chats').update(chat.id, {
			message: { text, author },
			sender_id: profile.id,
			changed: res.created,
			'sent+': 1
		});
		await pb.collection('talks').update(talk.id, { read: sent });

		message = { id: res.id, text, updated: Date.now() };

		if (chat.type === 1)
			await pb.collection('discussions').update(chat.id, { messages: sent, changed: updated });
	}
	async function updateMessage(text) {
		text = message.text + '\n' + text;

		message.text = text;
		message.updated = Date.now();

		const res = await pb.collection('messages').update(message.id, { text });

		await pb.collection('chats').update(chat.id, {
			message: { text, author },
			changed: res.updated
		});
	}
	async function editMessage(text) {
		const res = await pb.collection('messages').update($edit.id, {
			text,
			reply: $reply
		});

		if (is_sender && $edit.id === message.id) {
			await pb.collection('chats').update(chat.id, {
				message: { text, author: res.author },
				changed: res.updated
			});
		}
	}

	async function sendMessage() {
		if (input && input.innerText !== '') {
			disabled = true;

			const text = input.innerText;
			input.innerText = '';

			if ($edit) {
				await editMessage(text);

				let usernames = new Set(parseUsernames($edit.text));
				usernames = parseUsernames(text).filter((u) => !usernames.has(u));

				await updateTalks(usernames, $edit.id);

				$look = $edit.id;
				$edit = null;
			} else {
				if (is_sender && !$reply && Date.now() - message.updated < 5000) {
					await updateMessage(text);
				} else {
					if (chat.type === 0 && !chat.sender_id) await createTalk();
					await createMessage(text);
					await updateTalk();
				}
				$down = true;
			
				const usernames = parseUsernames(text);
				await updateTalks(usernames, message.id);
			}
			$reply = null;
		}
	}

	let inputHeight = 0;
	function handleResize() {
		if (input && input.innerText !== '') {
			$scroll = input.scrollHeight - inputHeight;
			inputHeight = input.scrollHeight;
		}
	}

	onMount(() => {
		inputHeight = input.scrollHeight;
		const observer = new ResizeObserver(handleResize);
		observer.observe(input);
	});
</script>

<form class="col footer gap-5 padding-10" on:submit|preventDefault={sendMessage}>
	{#if $reply}
		<div class="row away">
			<Reply message={$reply} />
			<button class="icon" on:click={() => ($reply = null)}>
				<img src="/icons/close.svg" alt="close" class="icon" />
			</button>
		</div>
	{/if}

	<div class="row away">
		<div
			class:placeholder={$screen}
			role="textbox"
			tabindex="0"
			on:keydown={async (e) => {
				if (e.key === 'Enter') {
					if (e.ctrlKey || e.altKey || e.metaKey) {
						e.preventDefault();
						
						await sendMessage();
						return true;
					}
				}
			}}
			on:keyup={() => {
				disabled = input.innerText === '';
			}}
			on:paste|preventDefault={handlePaste}
			contenteditable="true"
			placeholder={chat_type[chat.type]}
			bind:this={input}
		/>
		<button {disabled} class="icon" type="submit">
			<img src="/icons/send.svg" alt="send" class="icon" />
		</button>
	</div>
</form>
