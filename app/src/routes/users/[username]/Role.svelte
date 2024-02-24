<script>
	import { enhance } from '$app/forms';

	import { user_role } from '../data';

	export let user;

	$: role = user.role;
	let to;
</script>

<form method="post" action="?/role" class="row gap-10 wrap" use:enhance>
	<input type="hidden" bind:value={user.id} name="user_id" id="user_id" />
	<input type="hidden" bind:value={to} name="role" id="role" />

	<span>{user_role[user.role]}</span>

	&rarr;
	{#if role >= 1}
		<button class="link" on:click={() => (to = role - 1)}>
			{user_role[role - 1]}
		</button>
	{/if}
	{#if role <= 2}
		<button class="link" on:click={() => (to = role + 1)}>
			{user_role[role + 1]}
		</button>
	{/if}
</form>
