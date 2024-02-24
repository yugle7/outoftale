<script>
	import { pb, addId } from '$lib';
	import { reply, select, edit, isClick, message_react, react_key } from './data';

	import Reply from './Reply.svelte';

	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Click from '$lib/show/Click.svelte';
	import Time from '$lib/show/Time.svelte';
	import Text from '$lib/text/Text.svelte';
	import React from '$lib/show/React.svelte';

	export let message;
	export let talk;
	export let profile;

	let clicked;
	let deleted;

	const selectMessage = () => {
		if (isClick(window)) clicked = !clicked;
		if (clicked) $select = message.id;
	};

	async function deleteMessage() {
		deleted = !deleted;
		await pb.collection('messages').update(message.id, { deleted });
		clicked = null;
	}
	function editMessage() {
		$edit = message;
		clicked = null;
	}

	function replyMessage() {
		const { id, text, author_id, author } = message;
		$reply = { id, text, author_id, author };
		clicked = null;
	}

	let old_react = message.react;

	async function updateReact(react) {
		const id = addId(profile.id, message.id);
		if (old_react == null) {
			old_react = 0;
			try {
				await pb.collection('reacts').create({
					id,
					react,
					talk_id: talk.id,
					profile_id: profile.id,
					message_id: message.id,
					chat_id: message.chat_id
				});
				return;
			} catch (err) {
				console.log(err.message);
			}
		}
		let delta = 0;
		let d = react - old_react;

		while (d) {
			const res = await pb.collection('reacts').update(id, { 'react+': d });
			delta += d;
			d = react - res.react;
		}
		old_react = react - delta;
	}
	function reactMessage(r) {
		return async () => {
			const react = clicked || r !== old_react ? r : 0;
			await updateReact(react);

			if (old_react != react) {
				const data = {};

				if (old_react) data[old_react + '-'] = 1;
				message[old_react]--;

				if (react) data[react + '+'] = 1;
				message[react]++;

				await pb.collection('messages').update(message.id, data);
				old_react = react;
				reacts = reacts;
			}
			clicked = false;
		};
	}

	$: reacts = message_react.filter((r) => message[r] > 0).sort((a, b) => message[b] - message[a]);
</script>

<div class="col padding-15 gap-5 relative hover" class:highlighted={clicked}>
	{#if deleted}
		<p class="clamp">{message.text}</p>
		<button class="link" on:click={deleteMessage}>Восстановить</button>
	{:else}
		<div class="font-16">
			<ToAuthor author={message.author} />
			<Time time={message.created} />
		</div>

		{#if message.reply}
			<Reply message={message.reply} />
		{/if}

		{#if profile}
			<Click on:click={selectMessage}>
				<Text text={message.text} />
			</Click>
		{:else}
			<Text text={message.text} />
		{/if}

		{#if clicked}
			<div class="row gap-5">
				{#each message_react as r (r)}
					<React key={react_key[r]} on:click={reactMessage(r)} />
				{/each}
			</div>

			<div class="row gap-10">
				<button class="link" on:click={replyMessage}>Ответить</button>
				{#if profile?.id === message.author_id || profile?.role >= 3}
					<button class="link" on:click={deleteMessage}>Удалить</button>
					<button class="link" on:click={editMessage}>Изменить</button>
				{/if}
			</div>
		{:else if reacts.length > 0}
			<div class="row gap-5">
				{#if profile?.role >= 2}
					{#each reacts as r (r)}
						<React
							count={message[r]}
							key={react_key[r]}
							active={old_react === r}
							on:click={reactMessage(r)}
						/>
					{/each}
				{:else}
					{#each reacts as r (r)}
						<React count={message[r]} key={react_key[r]} />
					{/each}
				{/if}
			</div>
		{/if}
	{/if}
</div>
