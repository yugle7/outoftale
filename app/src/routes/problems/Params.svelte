<script>
	import { problem_status, problem_sort, problem_weight, problem_category } from './data';

	import { solution_progress } from '../solutions/data';

	import Search from '$lib/view/Search.svelte';
	import Click from '$lib/view/Click.svelte';
	import Radio from '$lib/view/Radio.svelte';
	import Select from '$lib/view/Select.svelte';
	import Selects from '$lib/view/Selects.svelte';

	export let profile;
</script>

<Search key="search" title="Поиск" />
<Click key="weight" title="Вес" values={problem_weight} />

<Select key="category" labels={problem_category} />

{#if profile}
	{#if profile.role >= 2}
		<Radio key="status" labels={problem_status} />
	{/if}
	<Selects key="progress" labels={solution_progress} />
{/if}

<Radio key="sort" labels={problem_sort} />
