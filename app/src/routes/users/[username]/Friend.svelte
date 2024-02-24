<script>
	import { enhance } from '$app/forms';

	export let user;

	let { friend } = user;
</script>

<form method="post" action="?/friend" use:enhance>
	<input type="hidden" bind:value={friend} name="friend" id="friend" />
	<input type="hidden" bind:value={user.id} name="user_id" id="user_id" />

	<button class="link" on:click={() => (friend = !friend)}>
		{#if friend}
			Убрать из друзей
		{:else}
			Добавить в друзья
		{/if}
	</button>
</form>
