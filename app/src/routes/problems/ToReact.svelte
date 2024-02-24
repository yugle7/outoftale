<script>
	import { pb, addId, getAuthor, getProblem } from '$lib';

	import { problem_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let problem;
	export let profile;

	let { react } = problem;

	async function updateReact(r) {
		const id = addId(profile.id, problem.id);

		react = react === r ? 0 : r;

		try {
			const res = await pb.collection('solutions').getOne(id);

			if (res.react !== react) {
				await pb.collection('solutions').update(id, { react });

				const data = {};
				if (res.react > 0) data[res.react + '-'] = 1;
				if (react > 0) data[react + '+'] = 1;

				problem = await pb.collection('problems').update(problem.id, data);
			}
		} catch (err) {
			console.log(err.message);
			
			react = null;
		}
	}

	async function createReact(r) {
		const id = addId(profile.id, problem.id);

		react = r;
		try {
			await pb.collection('solutions').create({
				id,
				react,
				author_id: profile.id,
				auhtor: getAuthor(profile),
				problem_id: problem.id,
				problem: getProblem(problem)
			});
			const data = {};
			data[react + '+'] = 1;

			problem = await pb.collection('problems').update(problem.id, data);
		} catch (err) {
			console.log(err.message);

			react = 0;
			await updateReact(r);
		}
	}

	function reactProblem(r) {
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
		{#each problem_react as r (r)}
			<React
				key={react_key[r]}
				on:click={reactProblem(r)}
				active={r === react}
				count={problem[r]}
			/>
		{/each}
	{:else}
		{#each problem_react as r (r)}
			<React key={react_key[r]} count={problem[r]} />
		{/each}
	{/if}
</div>
