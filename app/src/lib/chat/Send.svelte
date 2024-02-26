<script>
	import { enhance, applyAction } from '$app/forms';

	import { onMount } from 'svelte';
	import { screen } from '$lib';
	import { copyPaste, pasteToEnd } from '$lib/edit/data';

	import { scroll, look, reply, edit, down, chat_type } from './data';

	import Reply from './Reply.svelte';

	let input;
	let output;

	export let chat;

	let message;
	let edited;

	let text = '';
	let sent = 0;

	export let profile;

	let disabled = true;

	$: if ($edit) {
		$reply = $edit.reply;
		input.innerText = $edit.text;
	}

	let inputHeight = 0;
	const handleResize = () => {
		if (input && input.innerText !== '') {
			$scroll = input.scrollHeight - inputHeight;
			inputHeight = input.scrollHeight;
		}
	};
	const handleSend = () => {
		edited = Boolean($edit);

		if (edited) {
			const { id } = $edit;
			message = {
				id,
				reply: $reply,
				text: input.innerText
			};
			$look = id;
			$edit = null;
		} else {
			if (sent && chat.sender_id === profile.id && Date.now() - sent < 5000) {
				text += '\n' + input.innerText;

				message = {
					id: chat.message_id,
					text
				};
			} else {
				text = input.innerText;

				message = {
					reply: $reply,
					text
				};
			}
			sent = $reply ? 0 : Date.now();
			$down = true;
		}
		message.chat_id = chat.id;

		input.innerText = '';
		$reply = null;
	};

	onMount(() => {
		inputHeight = input.scrollHeight;
		const observer = new ResizeObserver(handleResize);
		observer.observe(input);
	});
</script>

<form
	method="post"
	action="/messages?/send"
	use:enhance={() => applyAction}
	class="col footer gap-5 padding-10"
	bind:this={output}
>
	<input type="hidden" value={JSON.stringify(message)} name="message" id="message" />
	<input type="hidden" value={edited} name="edited" id="edited" />

	{#if $reply}
		<div class="row away">
			<Reply message={$reply} />

			<button class="icon" on:click|preventDefault={() => ($reply = null)}>
				<img src="/icons/close.svg" alt="close" class="icon" />
			</button>
		</div>
	{/if}

	<div class="row away">
		<div
			class:placeholder={$screen}
			role="textbox"
			tabindex="0"
			on:keydown={(e) => {
				if (e.key === 'Enter') {
					e.preventDefault();
					if (e.ctrlKey || e.altKey || e.metaKey) {
						pasteToEnd('\n');
					} else {
						handleSend();
						setTimeout(() => output.requestSubmit(), 0);
					}
				}
			}}
			on:keyup={() => {
				disabled = input.innerText === '';
			}}
			on:paste|preventDefault={copyPaste}
			contenteditable="true"
			placeholder={chat_type[chat.type]}
			bind:this={input}
		/>
		<button {disabled} class="icon" type="submit" on:click={handleSend}>
			<img src="/icons/send.svg" alt="send" class="icon" />
		</button>
	</div>
</form>
