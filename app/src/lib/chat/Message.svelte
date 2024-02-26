<script>
	import { enhance, applyAction } from '$app/forms';
	import { getReply } from '$lib';
	import { reply, select, edit, isClick } from './data';

	import Reply from './Reply.svelte';

	import ToAuthor from '$lib/show/ToAuthor.svelte';
	import Click from '$lib/show/Click.svelte';
	import Time from '$lib/show/Time.svelte';
	import Text from '$lib/text/Text.svelte';
	import ToReact from './ToReact.svelte';

	export let message;
	export let profile;

	let deleted;
	let clicked;

	const { id, author_id, created } = message;
</script>

<div class="col padding-15 gap-5 relative hover" class:highlighted={clicked}>
	{#if deleted}
		<p class="clamp">{message.text}</p>
	{:else}
		<div class="font-16">
			<ToAuthor author={message.author} />
			<Time time={created} />
		</div>

		{#if message.reply}
			<Reply message={message.reply} />
		{/if}

		{#if profile}
			<Click
				on:click={() => {
					if (isClick(window)) {
						clicked = !clicked;
						if (clicked) $select = message.id;
					}
				}}
			>
				<Text text={message.text} />
			</Click>

			<ToReact {clicked} {message} {profile} on:submit={() => (clicked = false)} />
		{:else}
			<Text text={message.text} />
			<ToReact {message} {profile} />
		{/if}
	{/if}

	{#if profile}
		<form
			method="post"
			action="/messages?/delete"
			use:enhance={() => applyAction}
			class="row gap-15"
			class:hidden={!clicked}
		>
			<input type="hidden" value={id} name="message_id" id="message_id" />
			<input type="hidden" value={deleted} name="deleted" id="deleted" />

			<button
				class="link"
				class:hidden={deleted}
				on:click|preventDefault={() => {
					$reply = getReply(message);
					clicked = false;
				}}
			>
				Ответить
			</button>

			{#if profile.id === author_id || profile.role >= 3}
				<button class="link" on:click={() => (deleted = clicked = !deleted)}>
					{#if deleted}
						Восстановить
					{:else}
						Удалить
					{/if}
				</button>

				<button
					class="link"
					class:hidden={deleted}
					on:click|preventDefault={() => {
						$edit = message;
						clicked = false;
					}}
				>
					Изменить
				</button>
			{/if}
		</form>
	{/if}
</div>
