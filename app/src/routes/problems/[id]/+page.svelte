<script>
	import { pb, screen } from '$lib';
	import { onDestroy, onMount } from 'svelte';

	import { getTypes } from '../data';
	import { chat_type } from '$lib/chat/data';

	import Header from '$lib/menu/Header.svelte';

	import Solution from './Solution.svelte';
	import Edit from './Edit.svelte';
	import Problem from './Problem.svelte';

	import Chat from '$lib/chat/Chat.svelte';
	import Resize from '$lib/show/Resize.svelte';
	import Close from '$lib/show/Close.svelte';

	import ToChat from '$lib/menu/ToChat.svelte';
	import Footer from './Footer.svelte';

	export let data;

	let { problem, solution } = data;

	$: profile = data.profile;

	$: chat = data.chat;
	$: talk = data.talk;

	let edit;

	async function subscribe() {
		await pb.collection('problems').subscribe(problem.id, async ({ action, record }) => {
			if (action === 'update') {
				if (edit && problem.changed != record.changed) edit = null;
				problem = record;
			}
		});
		if (solution) {
			await pb.collection('solutions').subscribe(solution.id, async ({ action, record }) => {
				if (action === 'update') solution = record;
			});
		}
	}
	function unsubscribe() {
		pb.collection('problems').unsubscribe(problem.id);
		if (solution) pb.collection('solutions').unsubscribe(solution.id);
	}
	onMount(subscribe);
	onDestroy(unsubscribe);

	$: types = getTypes(solution, profile);

	const { title, author } = problem;
</script>

<svelte:head>
	<title>Задача – {title}</title>
	<meta name="description" content="Задача: {title}, Автор: {author.username}" />
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else if problem}
		{#if edit}
			<Close on:click={() => (edit = null)} />
			<Edit {problem} {profile} on:click={() => (edit = false)} />
		{:else if $screen === 'params'}
			<div class="col center gap-20 padding-20">
				<Close on:click={() => ($screen = 'content')} />
				{#each types as type (type)}
					<a href="?type={type}">{chat_type[type]}</a>
				{/each}
			</div>
		{:else}
			{#if types.length > 1}
				<Header to="chat">Задача</Header>
			{:else}
				<ToChat type="2">Задача</ToChat>
			{/if}
			
			<Problem {problem} {solution} {profile} />
			
			{#if profile}
				<div class="highlighted">
					<Solution {solution} />
				</div>
			{/if}
			
			<Footer {problem} {solution} {profile} on:click={() => (edit = true)} />
		{/if}
	{/if}
{:else if problem}
	{#if edit}
		<Edit {problem} {profile} on:click={() => (edit = false)} />
	{:else}
		<div class="scroll">
			<Problem {problem} {solution} {profile} />
			
			{#if profile}
				<div class="highlighted">
					<Solution {solution} />
				</div>
			{/if}
			
			<Footer {problem} {solution} {profile} on:click={() => (edit = true)} />
		</div>
	{/if}

	{#if chat || types.length > 1}
		<Resize>
			{#if chat}
				<Chat {chat} {talk} {profile} />
			{:else}
				<div class="col gap-20 padding-20 side font-16">
					{#each types as type (type)}
						<a href="?type={type}">{chat_type[type]}</a>
					{/each}
				</div>
			{/if}
		</Resize>
	{/if}
{/if}
