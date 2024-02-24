<script>
	import { page } from '$app/stores';
	import { pb } from '$lib';

	import { onDestroy, onMount } from 'svelte';
	import { normText } from '$lib/edit/data';

	import ToDiscussion from './ToDiscussion.svelte';

	export let discussions;
	export let profile;

	export let params;

	$: search = $page.url.searchParams.get('search') || null;

	async function subscribe() {
		await pb.collection('discussions').subscribe('*', async ({ action, record }) => {
			if (action === 'update' && (params.type == null || record.type == params.type)) {
				const i = discussions.findIndex(({ id }) => id === record.id);
				if (i >= 0) discussions[i] = record;
			}
		});
	}
	function unsubscribe() {
		pb.collection('discussions').unsubscribe('*');
	}

	onMount(subscribe);
	onDestroy(unsubscribe);

	$: dst =
		search == null
			? discussions
			: discussions.filter(({ title }) => normText(title).includes(search));
</script>

{#if dst.length > 0}
	<ul>
		{#each dst as discussion (discussion.id + discussion.changed)}
			<li class="hover">
				<ToDiscussion {discussion} {params} {profile} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Ничего не найдено</h1>
{/if}
