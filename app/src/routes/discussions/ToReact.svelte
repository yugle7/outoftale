<script>
	import { pb, addId } from '$lib';

	import { discussion_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let discussion;
	export let profile;

	let { react } = discussion;

	async function updateReact(r) {
		const id = addId(profile.id, discussion.id);

		react = react === r ? 0 : r;

		try {
			const res = await pb.collection('thoughts').getOne(id);

			if (res.react !== react) {
				await pb.collection('thoughts').update(id, { react });

				const data = {};
				if (res.react > 0) data[res.react + '-'] = 1;
				if (react > 0) data[react + '+'] = 1;

				discussion = await pb.collection('discussions').update(discussion.id, data);
			}
		} catch (err) {
			console.log(err.message);

			react = null;
		}
	}

	async function createReact(r) {
		const id = addId(profile.id, discussion.id);

		react = r;
		try {
			await pb.collection('thoughts').create({
				id,
				react,
				profile_id: profile.id,
				discussion_id: discussion.id
			});
			const data = {};
			data[react + '+'] = 1;

			discussion = await pb.collection('discussions').update(discussion.id, data);
		} catch (err) {
			console.log(err.message);

			react = 0;
			await updateReact(r);
		}
	}

	function reactDiscussion(r) {
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
		{#each discussion_react as r (r)}
			<React
				key={react_key[r]}
				on:click={reactDiscussion(r)}
				active={r === react}
				count={discussion[r]}
			/>
		{/each}
	{:else}
		{#each discussion_react as r (r)}
			<React key={react_key[r]} count={discussion[r]} />
		{/each}
	{/if}
</div>
