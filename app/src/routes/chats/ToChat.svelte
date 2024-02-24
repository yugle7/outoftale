<script>
	import { pb } from '$lib';

	import Title from '$lib/chat/Title.svelte';
	import Snippet from '$lib/show/Snippet.svelte';
	import Click from '$lib/show/Click.svelte';

	import Notify from './Notify.svelte';

	export let chat;
	export let params;

	export let profile;

	$: talk = chat.talk;

	let clicked;

	async function handleDelete() {
		await pb.collection('talks').update(talk.id, { deleted: !talk.deleted });
		clicked = false;
	}
</script>

<section class:highlighted={clicked}>
	<div class="col relative padding-20 content-900 gap-5">
		<Title {talk} {chat} {params} />

		{#if talk.deleted}
			<button class="link top-5" on:click={handleDelete}>Вернуться в чат</button>
		{:else}
			<Notify {chat} {talk} {profile} />

			<Click on:click={() => (clicked = !clicked)}>
				<Snippet {chat} {profile} />
			</Click>

			{#if clicked}
				<button class="link top-5" on:click={handleDelete}>Выйти из чата</button>
			{/if}
		{/if}
	</div>
</section>

<style>
	div {
		padding-right: 45px;
	}
</style>