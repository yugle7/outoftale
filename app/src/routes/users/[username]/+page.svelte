<script>
	import Header from './Header.svelte';

	import User from './User.svelte';

	import Profile from './Profile.svelte';

	import Chat from '$lib/chat/Chat.svelte';
	import Resize from '$lib/show/Resize.svelte';

	import { screen } from '$lib';
	import { user_role } from '../data';

	export let data;

	$: profile = data.profile;
	$: user = data.user;

	$: chat = data.chat;
	$: talk = data.talk;

	$: person = user || profile;
</script>

<svelte:head>
	<title>{user_role[person.role]} – {person.username}</title>
</svelte:head>

{#if $screen}
	{#if chat}
		<Chat {chat} {talk} {profile} />
	{:else}
		<Header {user} {profile} />
		{#if user}
			<User {user} {profile} />
		{:else if profile}
			<Profile {profile} />
		{/if}
	{/if}
{:else}
	{#if user}
		<User {user} {profile} chat={!chat} />
	{:else}
		<Profile {profile} />
	{/if}
	
	{#if chat}
		<Resize>
			<Chat {chat} {talk} {profile} />
		</Resize>
	{/if}
{/if}
