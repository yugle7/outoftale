<script>
	import { discussion_topic, discussion_sort, default_params } from './data';
	import { screen } from '$lib';

	import Header from '$lib/menu/Header.svelte';
	import Smooth from '$lib/show/Smooth.svelte';
	import Resize from '$lib/show/Resize.svelte';

	import Discussions from './Discussions.svelte';

	import Params from './Params.svelte';

	import Page from '$lib/view/Page.svelte';
	import Side from '$lib/view/Side.svelte';

	export let data;

	$: params = data.params;
	$: profile = data.profile;

	const getTitle = (params) => {
		const { topic, sort } = params;
		const names = [discussion_sort[sort]];
		if (topic != null) names.push(discussion_topic[topic]);
		return names.join(' – ');
	};
</script>

<svelte:head>
	<title>Общение – {getTitle(params)}</title>
</svelte:head>

{#if $screen}
	<Header>Общение</Header>
	<h1 class="title line-2">{getTitle(params)}</h1>

	{#await data.discussions}
		<h1 class="title shy line-3">Получаем</h1>
	{:then discussions}
		<Discussions {discussions} {params} {profile} />
	{/await}

	<Page {default_params}>
		<Params />
	</Page>
{:else}
	<Smooth>
		{#await data.discussions}
			<h1 class="title shy line-3">Получаем</h1>
		{:then discussions}
			<Discussions {discussions} {params} {profile} />
		{/await}
	</Smooth>

	<Resize>
		<Side {default_params}>
			<Params />
		</Side>
	</Resize>
{/if}
