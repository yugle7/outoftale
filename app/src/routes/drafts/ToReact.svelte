<script>
	import { pb, addId } from '$lib';

	import { draft_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let draft;
	export let profile;

	let { react } = draft;

	async function updateReact(r) {
		const id = addId(profile.id, draft.id);

		react = react === r ? 0 : r;

		try {
			const res = await pb.collection('applies').getOne(id);

			if (res.react !== react) {
				await pb.collection('applies').update(id, { react });

				const data = {};
				if (res.react > 0) data[res.react + '-'] = 1;
				if (react > 0) data[react + '+'] = 1;

				draft = await pb.collection('drafts').update(draft.id, data);
			}
		} catch (err) {
			console.log(err.message);

			react = null;
		}
	}

	async function createReact(r) {
		const id = addId(profile.id, draft.id);

		react = r;
		try {
			await pb.collection('applies').create({
				id,
				react,
				profile_id: profile.id,
				draft_id: draft.id
			});
			const data = {};
			data[react + '+'] = 1;

			draft = await pb.collection('drafts').update(draft.id, data);
		} catch (err) {
			console.log(err.message);

			react = 0;
			await updateReact(r);
		}
	}

	function reactDraft(r) {
		return async () => {
			if (react == null) {
				await createReact(r);
			} else {
				await updateReact(r);
			}
		};
	}
</script>

<div class="row gap-5">
	{#if profile}
		{#each draft_react as r (r)}
			<React key={react_key[r]} on:click={reactDraft(r)} active={r === react} count={draft[r]} />
		{/each}
	{:else}
		{#each draft_react as r (r)}
			<React key={react_key[r]} count={draft[r]} />
		{/each}
	{/if}
</div>
