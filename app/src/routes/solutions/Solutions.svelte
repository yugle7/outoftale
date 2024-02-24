<script>
	import { page } from '$app/stores';
	import { pb } from '$lib';
	import { normText } from '$lib/edit/data';

	import { onDestroy, onMount } from 'svelte';
	import ToSolution from './ToSolution.svelte';

	export let solutions;

	$: search = $page.url.searchParams.get('search') || null;

	async function subscribe() {
		await pb.collection('solutions').subscribe('*', async ({ action, record }) => {
			if (action === 'update') {
				const i = solutions.findIndex(({ id }) => id === record.id);
				if (i >= 0) solutions[i] = record;
			}
		});
	}
	function unsubscribe() {
		pb.collection('solutions').unsubscribe('*');
	}

	onMount(subscribe);
	onDestroy(unsubscribe);

	$: dst =
		search == null ? solutions : solutions.filter(({ title }) => normText(title).includes(search));
</script>

{#if dst.length > 0}
	<ul>
		{#each dst as solution (solution.id)}
			<li class="hover">
				<ToSolution {solution} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Ничего не найдено</h1>
{/if}
