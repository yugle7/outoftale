<script>
	import { page } from '$app/stores';
	import { pb } from '$lib';
	import { normText } from '$lib/edit/data';

	import { onDestroy, onMount } from 'svelte';
	import ToDraft from './ToDraft.svelte';

	export let drafts;
	export let profile;

	$: search = $page.url.searchParams.get('search') || null;

	async function subscribe() {
		await pb.collection('drafts').subscribe('*', async ({ action, record }) => {
			if (action === 'update') {
				const i = drafts.findIndex(({ id }) => id === record.id);
				if (i >= 0) drafts[i] = record;
			}
		});
	}
	function unsubscribe() {
		pb.collection('drafts').unsubscribe('*');
	}

	onMount(subscribe);
	onDestroy(unsubscribe);

	$: dst = search == null ? drafts : drafts.filter(({ title }) => normText(title).includes(search));
</script>

{#if dst.length > 0}
	<ul>
		{#each dst as draft (draft.id)}
			<li class="hover">
				<ToDraft {draft} {profile} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Ничего не найдено</h1>
{/if}
