<script>
	import ToUser from './ToUser.svelte';

	export let users;
	export let params;

	export let profile;
</script>

{#if users.length > 0}
	<ul class="top-5">
		{#each users as user (user.id)}
			<li class:highlighted={user.id === profile?.id} class="hover">
				<ToUser {user} {params} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Никого не найдено</h1>
{/if}
