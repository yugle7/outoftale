<script>
	import { page } from '$app/stores';
	import { normText } from '$lib/edit/data';

	import ToProblem from './ToProblem.svelte';

	export let problems;
	export let profile;

	export let params;

	$: search = $page.url.searchParams.get('search') || null;

	$: dst =
		search == null ? problems : problems.filter(({ title }) => normText(title).includes(search));
</script>

{#if dst.length > 0}
	<ul class="top-5">
		{#each dst as problem (problem.id)}
			<li class="hover">
				<ToProblem {problem} {params} {profile} />
			</li>
		{/each}
	</ul>
{:else}
	<h1 class="title shy line-3">Ничего не найдено</h1>
{/if}
