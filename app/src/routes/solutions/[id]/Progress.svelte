<script>
	import { solution_progress, to_progress } from '../data';
	import { enhance } from '$app/forms';

	export let profile;
	export let solution;
	export let problem;

	$: progresses = to_progress[solution.progress];

	let progress;
</script>

<form method="post" action="?/progress" class="row gap-10 wrap" use:enhance>
	<span class="right-10">{solution_progress[solution.progress]}</span>

	<input type="hidden" bind:value={problem.weight} id="weight" name="weight" />
	<input type="hidden" bind:value={solution.id} id="id" name="id" />
	<input type="hidden" bind:value={progress} id="progress" name="progress" />

	{#if progresses && profile.id === solution.reviewer_id}
		<span class="right-10">&rarr;</span>
		{#each progresses as p (p)}
			<button class="right-10 link" type="submit" on:click={() => (progress = p)}>
				{solution_progress[p]}
			</button>
		{/each}
	{/if}
</form>

<style>
	form {
		display: inline;
	}
</style>