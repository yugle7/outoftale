<script>
	import { plural, user_role } from '../data';

	import Name from './Name.svelte';
	import Rate from './Rate.svelte';
	import Role from './Role.svelte';
	import Contacts from './Contacts.svelte';
	import Friend from './Friend.svelte';
	import Link from '../../../lib/show/Link.svelte';

	export let user;
	export let chat = false;
	export let profile;

	const { role, email, fullname, contacts, problems, solutions, drafts, discussions } = user;
</script>

<div class="col scroll gap-40 padding-20 center">
	<div class="col gap-10">
		<Name {user} />
		{#if fullname}<h2>{fullname}</h2>{/if}

		<Rate {user} />

		{#if email}{email}{/if}
		{#if contacts}<Contacts {contacts} />{/if}

		{#if profile?.role > Math.max(1, user.role)}
			<Role {user} />
		{:else}
			<span>{user_role[role]}</span>
		{/if}
	</div>

	<div class="row gap-20 line-0 wrap monospace">
		<Link href="/problems?author_id={user.id}" count={problems} key="problems" />
		<Link href="/discussions?author_id={user.id}" count={discussions} key="discussions" />

		{#if profile?.role >= 2}
			<Link href="/solutions?author_id={user.id}" count={solutions} key="solutions" />
			<Link href="/drafts?editor_id={user.id}" count={drafts} key="drafts" />
		{/if}
	</div>

	<div class="col gap-10">
		{#if profile}
			{#if chat && profile.role}
				<a href="?type=0">Написать лично</a>
			{/if}
			<Friend {user} />
		{/if}
	</div>
</div>
