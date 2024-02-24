<script>
	import { page } from '$app/stores';

	import { draft_sort, default_params } from './data';
	import { problem_category } from '../problems/data';
	import { screen } from '$lib';

	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';

	import Drafts from './Drafts.svelte';

	import Params from './Params.svelte';
	import Resize from '$lib/show/Resize.svelte';
	
	import Side from '$lib/view/Side.svelte';
	import Page from '$lib/view/Page.svelte';

	export let data;

	$: params = data.params;
	$: profile = data.profile;

	const getTitle = (params) => {
		const { sort, category, editor_id } = params;
		const names = [draft_sort[sort]];
		if (category != null) names.push(problem_category[category]);
		if ($page.url.searchParams.get('search')) names.push('Поиск');
		if (editor_id) names.push('Редактор');
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Правки – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Правки</Header>
	<h1 class="title line-2">{getTitle(params)}</h1>
	
	{#await data.drafts}
		<h1 class="title shy line-3">Получаем</h1>
	{:then drafts}
		<Drafts {drafts} {profile} />
	{/await}
	
	<Page {default_params}>
		<Params />
	</Page>
{:else}
	<Smooth>
		{#await data.drafts}
			<h1 class="title shy line-3">Получаем</h1>
		{:then drafts}
			<Drafts {drafts} {profile} />
		{/await}
	</Smooth>
	
	<Resize>
		<Side {default_params}>
			<Params />
		</Side>
	</Resize>
{/if}
