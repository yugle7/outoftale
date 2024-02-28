<script>
	import { enhance, applyAction } from '$app/forms';

	import { draft_react } from './data';
	import { react_key } from '$lib/chat/data';

	import React from '$lib/show/React.svelte';

	export let draft;
	export let profile;

	let { react, id } = draft;
</script>

{#if profile}
	<form class="row gap-5" method="post" action="/drafts?/react" use:enhance={() => applyAction}>
		<input type="hidden" value={id} name="draft_id" id="draft_id" />
		<input type="hidden" value={react} name="react" id="react" />
		
		{#each draft_react as r (r)}
			<React
				key={react_key[r]}
				type={r === react}
				count={draft[r]}
				on:click={() => {
					if (react > 0) draft[react]--;
					if (r === react) {
						react = 0;
					} else {
						react = r;
						draft[react]++;
					}
				}}
			/>
		{/each}
	</form>
{:else}
	<div class="row gap-5">
		{#each draft_react as r (r)}
			<React key={react_key[r]} count={draft[r]} />
		{/each}
	</div>
{/if}
