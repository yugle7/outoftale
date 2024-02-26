<script>
	import { screen } from '$lib';
	import { user_role, user_sort, default_params } from './data';

	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';
	import Resize from '$lib/show/Resize.svelte';

	import Params from './Params.svelte';
	import Users from './Users.svelte';

	import Page from '$lib/view/Page.svelte';
	import Side from '$lib/view/Side.svelte';

	export let data;

	$: profile = data.profile;
	$: params = data.params;

	const getTitle = (params) => {
		const { sort, friend, wanted, role } = params;

		const names = [user_sort[sort]];
		if (friend) names.push('Друзья');
		if (wanted) names.push('Запрошена роль');
		if (role != null) names.push(user_role[role]);
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Люди – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Люди</Header>
	<h1 class="title line-2">{getTitle(params)}</h1>
	
	{#await data.users}
		<h1 class="title shy line-3">Получаем</h1>
	{:then users}
		<Users {users} {params} {profile} />
	{/await}
	
	<Page {default_params}>
		<Params {profile} />
	</Page>
{:else}
	<Smooth>
		{#await data.users}
			<h1 class="title shy line-3">Получаем</h1>
		{:then users}
			<Users {users} {params} {profile} />
		{/await}
	</Smooth>

	<Resize>
		<Side {default_params}>
			<Params {profile} />
		</Side>
	</Resize>
{/if}
