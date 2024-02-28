<script>
	import { enhance, applyAction } from '$app/forms';

	import { discussion_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let discussion;
	export let profile;

	let { react, id } = discussion;
</script>

{#if profile}
	<form class="row gap-5" method="post" action="/discussions?/react" use:enhance={() => applyAction}>
		<input type="hidden" value={id} name="discussion_id" id="discussion_id" />
		<input type="hidden" value={react} name="react" id="react" />
		
		{#each discussion_react as r (r)}
			<React
				key={react_key[r]}
				type={r === react}
				count={discussion[r]}
				on:click={() => {
					if (react > 0) discussion[react]--;
					if (r === react) {
						react = 0;
					} else {
						react = r;
						discussion[react]++;
					}
				}}
			/>
		{/each}
	</form>
{:else}
	<div class="row gap-5">
		{#each discussion_react as r (r)}
			<React key={react_key[r]} count={discussion[r]} />
		{/each}
	</div>
{/if}
