<script>
	import { problem_category } from '../problems/data';
	import { draft_sort } from './data';

	import Search from '$lib/view/Search.svelte';
	import Radio from '$lib/view/Radio.svelte';
	import Select from '$lib/view/Select.svelte';
	import Flag from '$lib/view/Flag.svelte';
</script>

<Search key="search" title="Поиск" />
<Select key="category" labels={problem_category} />

<Flag key="applied" title="Применено" />
<Radio key="sort" labels={draft_sort} />
