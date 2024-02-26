<script>
	import { onDestroy, onMount } from 'svelte';
	import { pb, screen } from '$lib';
	
	import Header from '../../chats/Header.svelte';

	import Problem from './Problem.svelte';
	import Solution from './Solution.svelte';

	import Chat from '$lib/chat/Chat.svelte';
	import Resize from '$lib/show/Resize.svelte';

	export let data;

	let { solution, problem } = data;
	$: profile = data.profile;

	$: chat = data.chat;
	$: talk = data.talk;

	async function subscribe() {
		await pb.collection('solutions').subscribe(solution.id, async ({ action, record }) => {
			if (action === 'update') {
				const { reviewer_id, reviewer } = record;

				if (reviewer_id && reviewer_id !== profile.id && reviewer_id !== solution.reviewer_id) {
					const res = pb.collection('users').getOne(reviewer_id);
					reviewer.role = res.role;
				}
				solution = record;
			}
		});
		await pb.collection('problems').subscribe(problem.id, async ({ action, record }) => {
			if (action === 'update') problem = record;
		});
	}
	function unsubscribe() {
		pb.collection('solutions').unsubscribe(solution.id);
		pb.collection('problems').unsubscribe(problem.id);
	}
	onMount(subscribe);
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<title>Решение – {solution.author.username} – {problem.title}</title>
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else if solution}
		<Header type="7">Решение</Header>

		<Problem {problem} />
		<Solution {solution} {problem} {profile} />
	{/if}
{:else if solution}
	<div class="col scroll width-100">
		<Problem {problem} />
		<Solution {solution} {problem} {profile} chat={!chat} />
	</div>

	{#if chat}
		<Resize>
			<Chat {chat} {talk} {profile} />
		</Resize>
	{/if}
{/if}
