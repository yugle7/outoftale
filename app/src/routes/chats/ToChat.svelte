<script>
	import { enhance, applyAction } from '$app/forms';

	import Title from '$lib/chat/Title.svelte';
	import Snippet from '$lib/show/Snippet.svelte';
	import Click from '$lib/show/Click.svelte';

	import Notify from './Notify.svelte';

	export let chat;
	export let params;

	export let profile;

	$: talk = chat.talk;

	let clicked;
	let { id, deleted } = chat.talk;
</script>

<div class:highlighted={clicked}>
	<form
		method="post"
		action="?/delete"
		use:enhance={() => applyAction}
		class="col relative padding-20 content-900 gap-5"
	>
		<input type="hidden" value={id} name="talk_id" id="talk_id" />
		<input type="hidden" value={deleted} name="deleted" id="deleted" />

		<Title {talk} {chat} {params} />

		{#if !deleted}
			<Notify {chat} {talk} {profile} />

			<Click on:click={() => (clicked = !clicked)}>
				<Snippet {chat} {profile} />
			</Click>
		{/if}

		<button
			class:hidden={!clicked}
			class="link top-5"
			type="submit"
			on:click={() => (deleted = clicked = !deleted)}
		>
			{#if deleted}
				Вернуться в чат
			{:else}
				Выйти из чата
			{/if}
		</button>
	</form>
</div>

<style>
	form {
		padding-right: 45px;
	}
</style>
