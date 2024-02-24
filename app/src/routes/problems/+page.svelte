<script>
	import { page } from '$app/stores';
	import { screen } from '$lib';

	import {
		problem_status,
		problem_sort,
		problem_category,
		weight_name,
		default_params
	} from './data';

	import { solution_progress } from '../solutions/data';


	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';

	import Problems from './Problems.svelte';

	import Params from './Params.svelte';
	import Resize from '$lib/show/Resize.svelte';

	import Page from '$lib/view/Page.svelte';
	import Side from '$lib/view/Side.svelte';

	export let data;

	$: params = data.params;
	$: profile = data.profile;

	const getTitle = (params) => {
		if (!params) return '';

		const { sort, status, weight, category, progress, author_id } = params;
		const names = [problem_sort[sort]];
		if (status != default_params.status) names.push(problem_status[status]);
		if (weight != null) names.push(weight_name[weight]);
		if (category != null) names.push(problem_category[category]);
		if (progress) names.push(solution_progress.filter((p, i) => progress & (1 << i)).join(', '));
		if ($page.url.searchParams.get('search')) names.push('Поиск');
		if (author_id) names.push('Автор');
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Задачи – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Задачи</Header>

	{#await data.problems}
		<h1 class="title shy line-3">Получаем</h1>
	{:then problems}
		<h1 class="title line-2">{getTitle(params)}</h1>
		<Problems {problems} {params} {profile} />
	{/await}

	<Page {default_params}>
		<Params {profile} />
	</Page>
{:else}
	<Smooth>
		{#await data.problems}
			<h1 class="title shy line-3">Получаем</h1>
		{:then problems}
			<Problems {problems} {params} {profile} />
		{/await}
	</Smooth>

	<Resize>
		<Side {default_params}>
			<Params {profile} />
		</Side>
	</Resize>
{/if}
