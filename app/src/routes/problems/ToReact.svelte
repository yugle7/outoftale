<script>
	import { enhance, applyAction } from '$app/forms';

	import { problem_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let problem;
	export let profile;

	let { react, id } = problem;
</script>

{#if profile}
	<form class="row gap-5" method="post" action="/problems?/react" use:enhance={() => applyAction}>
		<input type="hidden" value={id} name="problem_id" id="problem_id" />
		<input type="hidden" value={react} name="react" id="react" />

		{#each problem_react as r (r)}
			<React
				key={react_key[r]}
				type={r === react}
				count={problem[r]}
				on:click={() => {
					if (react > 0) problem[react]--;
					if (r === react) {
						react = 0;
					} else {
						react = r;
						problem[react]++;
					}
				}}
			/>
		{/each}
	</form>
{:else}
	<div class="row gap-5">
		{#each problem_react as r (r)}
			<React key={react_key[r]} count={problem[r]} />
		{/each}
	</div>
{/if}
