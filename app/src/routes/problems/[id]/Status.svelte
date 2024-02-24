<script>
	import { enhance } from '$app/forms';
	import { getStatuses, problem_status } from '../data';

	export let problem;
	export let profile;

	$: statuses = getStatuses(profile, problem);
	let status;
</script>

<form method="post" action="?/status" class="row gap-10 wrap" use:enhance>
	<input type="hidden" bind:value={status} name="status" id="status" />

	<span>{problem_status[problem.status]}</span>

	{#if statuses.length > 0}
		&rarr;
		{#each statuses as s (s)}
			<button class="link" on:click={() => (status = s)}>
				{problem_status[s]}
			</button>
		{/each}
	{/if}
</form>
