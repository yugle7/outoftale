<script>
	import { user_role } from '../data';
	import { enhance } from '$app/forms';

	export let profile;

	$: role = profile.role;

	let to;

	let roles = [];
	$: if (role) {
		roles = [];

		if (role >= 2) roles.push(role - 1);
		if (role <= 3 && role <= profile.to) roles.push(role + 1);
	}
</script>

<form method="post" action="?/wanted" class="row center gap-10" use:enhance>
	{#if profile.wanted}
		<button class="link">
			{user_role[role]}
		</button>
		&larr;
		<div class="col center">
			<span>{user_role[role + 1]}</span>
			<span class="link font-14">запрошено</span>
		</div>
	{:else}
		<input type="hidden" bind:value={to} name="to" id="to" />

		<span>{user_role[role]}</span>
		{#if roles.length > 0}
			&rarr;
			{#each roles as r (r)}
				<button class="link" on:click={() => (to = r)}>
					{user_role[r]}
				</button>
			{/each}
		{/if}
	{/if}
</form>
