<script>
	import { solution_sort, default_params } from './data';
	import { problem_category } from '../problems/data';
	import { screen } from '$lib';

	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';

	import Page from '$lib/view/Page.svelte';
	import Side from '$lib/view/Side.svelte';

	import Solutions from './Solutions.svelte';

	import Params from './Params.svelte';
	import Resize from '$lib/show/Resize.svelte';

	export let data;

	$: params = data.params;

	const getTitle = (params) => {
		const { sort, weight, category, author_id } = params;
		const names = [solution_sort[sort]];
		if (weight != null) names.push(`Вес ${weight}`);
		if (category != null) names.push(problem_category[category]);
		if (author_id) names.push('Автор');
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Решения – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Решения</Header>
	<h1 class="title line-2">{getTitle(params)}</h1>

	{#await data.solutions}
		<h1 class="title shy line-3">Получаем</h1>
	{:then solutions}
		<Solutions {solutions} />
	{/await}

	<Page {default_params}>
		<Params />
	</Page>
{:else}
	<Smooth>
		{#await data.solutions}
			<h1 class="title shy line-3">Получаем</h1>
		{:then solutions}
			<Solutions {solutions} />
		{/await}
	</Smooth>

	<Resize>
		<Side {default_params}>
			<Params />
		</Side>
	</Resize>
{/if}
